'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatPrice, getShippingFee, KENYA_COUNTIES } from '@/lib/utils'
import { Address } from '@/types'
import toast from 'react-hot-toast'
import { LuPartyPopper } from 'react-icons/lu'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address')
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState<Address>({
    full_name: '', phone: '', email: user?.email || '', county: 'Nairobi', town: '', street: ''
  })
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [orderId, setOrderId] = useState('')

  const shippingFee = subtotal >= 5000 ? 0 : getShippingFee(address.county)
  const total = subtotal + shippingFee

  function updateAddress(k: keyof Address, v: string) {
    setAddress(prev => ({ ...prev, [k]: v }))
  }

  async function submitOrder() {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items, shipping_address: address, subtotal, shipping_fee: shippingFee, total,
          payment_method: 'mpesa', mpesa_phone: mpesaPhone, user_id: user?.id
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrderId(data.order_id)
      clearCart()
      setStep('confirm')
      toast.success('Order placed! Check your M-Pesa for payment prompt.')
    } catch (err) {
      toast.error((err as Error).message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && step !== 'confirm') {
    router.replace('/cart')
    return null
  }

  if (step === 'confirm') return (
    <div className="section-padding">
      <div className="container-site max-w-lg text-center">
        <LuPartyPopper className="w-16 h-16 mx-auto mb-5 text-brand-rose" aria-hidden />
        <h1 className="font-display text-3xl font-medium text-brand-dark mb-3">Order Placed!</h1>
        <p className="text-brand-muted font-body mb-2">Order ID: <span className="font-mono text-brand-dark font-medium">{orderId}</span></p>
        <p className="text-sm text-brand-muted font-body mb-6">You should receive an M-Pesa prompt shortly. We'll WhatsApp you when your order ships.</p>
        <div className="flex gap-3 justify-center">
          <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="btn-primary">Track via WhatsApp</a>
          <button onClick={() => router.push('/shop')} className="btn-outline">Keep Shopping</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="section-padding">
      <div className="container-site">
        <h1 className="font-display text-4xl font-medium text-brand-dark mb-8">Checkout</h1>
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {(['address', 'payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-colors ${step === s || (s === 'address' && step === 'payment') ? 'bg-brand-rose text-white' : 'bg-brand-cream text-brand-muted border border-brand-beige'}`}>{i + 1}</div>
              <span className={`text-sm font-body capitalize ${step === s ? 'text-brand-dark font-medium' : 'text-brand-muted'}`}>{s === 'address' ? 'Delivery Address' : 'Payment'}</span>
              {i < 1 && <div className="w-12 h-px bg-brand-beige" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {step === 'address' && (
              <div className="card p-6 space-y-4">
                <h2 className="font-display text-xl font-medium text-brand-dark mb-2">Delivery Details</h2>
                {[
                  { key: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Jane Wanjiku' },
                  { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '0712 345 678' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@email.com' },
                  { key: 'town', label: 'Town / Area', type: 'text', placeholder: 'Westlands' },
                  { key: 'street', label: 'Street / Estate / Building', type: 'text', placeholder: 'Sarit Centre, Shop B12' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="label">{field.label}</label>
                    <input className="input" type={field.type} placeholder={field.placeholder}
                      value={address[field.key as keyof Address]}
                      onChange={e => updateAddress(field.key as keyof Address, e.target.value)} required />
                  </div>
                ))}
                <div>
                  <label className="label">County</label>
                  <select className="input" value={address.county} onChange={e => updateAddress('county', e.target.value)}>
                    {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button onClick={() => {
                  if (!address.full_name || !address.phone || !address.email || !address.town || !address.street) {
                    toast.error('Please fill in all fields'); return
                  }
                  setStep('payment')
                }} className="btn-primary w-full justify-center py-3.5 mt-2">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="card p-6 space-y-4">
                <h2 className="font-display text-xl font-medium text-brand-dark mb-2">Pay with M-Pesa</h2>
                <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 text-sm font-body text-brand-dark">
                  <p className="font-semibold mb-1">How it works:</p>
                  <ol className="list-decimal list-inside space-y-1 text-brand-dark/80">
                    <li>Enter your M-Pesa number below</li>
                    <li>Click "Pay Now" — we'll send you an STK push</li>
                    <li>Check your phone and enter your M-Pesa PIN</li>
                    <li>You'll get a confirmation SMS from M-Pesa</li>
                  </ol>
                </div>
                <div>
                  <label className="label">M-Pesa Phone Number</label>
                  <input className="input" type="tel" placeholder="0712 345 678 or 254712345678"
                    value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} />
                  <p className="text-xs text-brand-muted font-body mt-1">Must be registered to an M-Pesa account</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('address')} className="btn-outline flex-1">← Back</button>
                  <button onClick={submitOrder} disabled={loading || !mpesaPhone} className="btn-primary flex-1 justify-center py-3.5">
                    {loading ? 'Processing…' : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="font-display text-xl font-medium text-brand-dark mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm font-body">
                    <span className="text-brand-dark line-clamp-1 flex-1 mr-2">{item.product.name} <span className="text-brand-muted">×{item.quantity}</span></span>
                    <span className="font-medium flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-beige pt-3 space-y-2 text-sm font-body">
                <div className="flex justify-between"><span className="text-brand-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-brand-muted">Shipping</span><span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span></div>
                <div className="flex justify-between font-semibold text-brand-dark border-t border-brand-beige pt-2">
                  <span>Total</span><span className="text-base">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
