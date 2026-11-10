import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Normalize phone to 2547XXXXXXXX format for M-Pesa
function normalizePhone(phone: string): string {
  phone = phone.replace(/\s+/g, '').replace(/[^0-9+]/, '')
  if (phone.startsWith('+254')) return phone.slice(1)
  if (phone.startsWith('0')) return '254' + phone.slice(1)
  if (phone.startsWith('254')) return phone
  return '254' + phone
}

// Get M-Pesa access token from Daraja API
async function getMpesaToken(): Promise<string> {
  const credentials = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
  const res = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${credentials}` }
  })
  const data = await res.json()
  return data.access_token
}

// Initiate M-Pesa STK Push
async function initiateStkPush(phone: string, amount: number, orderId: string): Promise<{ CheckoutRequestID: string } | null> {
  try {
    const token = await getMpesaToken()
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = Buffer.from(`${process.env.MPESA_BUSINESS_SHORT_CODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64')
    const res = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: normalizePhone(phone),
        PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
        PhoneNumber: normalizePhone(phone),
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `NTKBEAUTY-${orderId.slice(0, 8).toUpperCase()}`,
        TransactionDesc: 'NTK Beauty Order Payment',
      })
    })
    return await res.json()
  } catch {
    return null
  }
}

// Send WhatsApp notification to shop owner
async function notifyOwner(order: Record<string, unknown>) {
  try {
    const addr = order.shipping_address as Record<string, string>
    const items = order.items as Array<{ product: { name: string }; quantity: number; }>
    const message = [
      `🛍️ *New Order — NTK Beauty*`,
      `Order ID: ${(order.id as string)?.slice(0, 8)}`,
      `Customer: ${addr.full_name} (${addr.phone})`,
      `County: ${addr.county}, ${addr.town}`,
      `Address: ${addr.street}`,
      ``,
      `*Items:*`,
      ...items.map(i => `• ${i.product.name} ×${i.quantity}`),
      ``,
      `Total: KShs ${(order.total as number)?.toLocaleString()}`,
      `Payment: M-Pesa (pending)`,
    ].join('\n')

    await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: process.env.OWNER_WHATSAPP_NUMBER,
        type: 'text',
        text: { body: message },
      })
    })
  } catch {
    // Don't fail the order if WhatsApp notification fails
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shipping_address, subtotal, shipping_fee, total, payment_method, mpesa_phone, user_id } = body

    const supabase = createSupabaseAdmin()

    // Save order to database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user_id || null,
        items,
        shipping_address,
        subtotal,
        shipping_fee,
        total,
        status: 'pending',
        payment_method,
        payment_status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    // Initiate M-Pesa STK push
    if (payment_method === 'mpesa' && mpesa_phone) {
      const stkResult = await initiateStkPush(mpesa_phone, total, order.id)
      if (stkResult?.CheckoutRequestID) {
        await supabase.from('orders').update({ mpesa_transaction_id: stkResult.CheckoutRequestID }).eq('id', order.id)
      }
    }

    // Notify shop owner via WhatsApp
    await notifyOwner(order)

    return NextResponse.json({ order_id: order.id, success: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
