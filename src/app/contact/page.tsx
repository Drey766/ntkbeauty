'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { LuMapPin, LuClock, LuMail } from 'react-icons/lu'

const FAQS = [
  { q: 'Do you deliver nationwide in Kenya?', a: 'Yes! We deliver to all 47 counties. Nairobi gets same-day/next-day delivery. Upcountry takes 2–4 business days via courier.' },
  { q: 'What payment methods do you accept?', a: 'We accept M-Pesa (Lipa Na M-Pesa), and cash on delivery for select areas within Nairobi.' },
  { q: 'Are your products genuine?', a: 'Absolutely. We source directly from authorised distributors and brand representatives. All products are 100% genuine.' },
  { q: 'How do I know which products suit my skin?', a: 'WhatsApp us! Our skincare experts offer free consultations to recommend the right products for your skin type and concerns.' },
  { q: 'What is your return policy?', a: 'We accept returns within 7 days for unopened products in original packaging. WhatsApp us to initiate a return.' },
  { q: 'Do you offer free delivery?', a: 'Yes — orders above KShs 5,000 get free delivery to Nairobi. For other counties, flat rates apply.' },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    // In production, POST to an API route that emails/WhatsApps the shop owner
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', message: '' })
    setSending(false)
  }

  return (
    <div className="section-padding">
      <div className="container-site">
        <div className="text-center mb-12">
          <span className="section-tag mx-auto">Get in Touch</span>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-brand-dark">Contact Us</h1>
          <p className="text-brand-muted font-body mt-3 max-w-md mx-auto">We'd love to hear from you — skin questions, orders, or just to say hi.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Store info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-display text-xl font-medium text-brand-dark mb-4">Store Information</h2>
              <ul className="space-y-4 font-body text-sm">
                {[
                  { icon: LuMapPin, label: 'Location', value: 'Nairobi, Kenya (Online Store)' },
                  { icon: LuClock, label: 'Hours', value: 'Mon – Sat: 9:00 AM – 6:00 PM EAT' },
                  { icon: LuMail, label: 'Email', value: 'hello@ntkbeauty.co.ke' },
                ].map(item => (
                  <li key={item.label} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 mt-0.5 shrink-0 text-brand-rose" aria-hidden />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-brand-muted font-semibold mb-0.5">{item.label}</p>
                      <p className="text-brand-dark">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/254700000000?text=Hi!%20I%20have%20a%20question%20about%20NT%20Beauty."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 card p-5 hover:border-brand-green/40 transition-colors group">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <p className="font-body font-semibold text-brand-dark group-hover:text-brand-green transition-colors">Chat on WhatsApp</p>
                <p className="text-xs text-brand-muted font-body">Fastest response — usually within minutes</p>
              </div>
              <svg className="w-4 h-4 text-brand-muted ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>

          {/* Contact form */}
          <div className="card p-6">
            <h2 className="font-display text-xl font-medium text-brand-dark mb-5">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Your Name</label>
                <input className="input" type="text" placeholder="Jane Wanjiku" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input className="input" type="email" placeholder="jane@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input h-32 resize-none" placeholder="What can we help you with?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3.5">
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-medium text-brand-dark mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={`faq-${i}`} className="card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-body font-medium text-brand-dark text-sm">{faq.q}</span>
                  <svg className={`w-4 h-4 text-brand-muted flex-shrink-0 ml-3 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm font-body text-brand-muted leading-relaxed border-t border-brand-beige pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
