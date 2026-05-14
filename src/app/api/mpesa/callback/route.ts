import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { Body: { stkCallback } } = body

    const supabase = createSupabaseAdmin()
    const checkoutId = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode

    if (resultCode === 0) {
      // Payment successful
      const metadata = stkCallback.CallbackMetadata?.Item || []
      const txnId = metadata.find((m: { Name: string; Value: string }) => m.Name === 'MpesaReceiptNumber')?.Value

      await supabase
        .from('orders')
        .update({ payment_status: 'paid', status: 'confirmed', mpesa_transaction_id: txnId || checkoutId })
        .eq('mpesa_transaction_id', checkoutId)
    } else {
      // Payment failed or cancelled
      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('mpesa_transaction_id', checkoutId)
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' })
  }
}
