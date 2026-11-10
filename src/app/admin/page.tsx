'use client'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { Product, Order, BlogPost } from '@/types'
import { formatPrice, PRODUCT_CATEGORIES } from '@/lib/utils'
import toast from 'react-hot-toast'
import Image from 'next/image'
import type { IconType } from 'react-icons'
import { LuLayoutDashboard, LuPackage, LuReceipt, LuPenLine, LuUsers, LuWallet, LuFolderUp, LuLink, LuCircleCheck, LuCirclePause } from 'react-icons/lu'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'blog' | 'customers'

// ── Blank product form ───────────────────────────────────────────────────────
const blankProduct = (): Partial<Product> => ({
  name: '', slug: '', description: '', price: 0, original_price: null,
  images: [], category: 'serums', brand: '', skin_types: ['All'],
  concerns: [], in_stock: true, is_featured: false, is_new: false, rating: 4.5, review_count: 0,
})

export default function AdminPage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<AdminTab>('dashboard')

  // Data
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 })

  // Product form
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [savingProduct, setSavingProduct] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Blog form
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null)
  const [savingPost, setSavingPost] = useState(false)

  useEffect(() => {
    if (!loading && !isAdmin) router.replace('/')
  }, [isAdmin, loading, router])

  useEffect(() => {
    if (isAdmin) loadData()
  }, [isAdmin, tab])

  async function loadData() {
    const supabase = getSupabase()
    if (tab === 'dashboard' || tab === 'products') {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(50)
      if (data) setProducts(data as Product[])
    }
    if (tab === 'orders' || tab === 'dashboard') {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50)
      if (data) setOrders(data as Order[])
    }
    if (tab === 'blog') {
      const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
      if (data) setPosts(data as BlogPost[])
    }
    if (tab === 'dashboard') {
      const [{ count: pc }, { count: oc }, { count: cc }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])
      const { data: rev } = await supabase.from('orders').select('total').eq('payment_status', 'paid')
      const revenue = (rev || []).reduce((s: number, o: { total: number }) => s + o.total, 0)
      setStats({ products: pc || 0, orders: oc || 0, revenue, customers: cc || 0 })
    }
  }

  async function saveProduct() {
    if (!editingProduct?.name || !editingProduct?.price) { toast.error('Name and price required'); return }
    setSavingProduct(true)
    const supabase = getSupabase()
    const slug = editingProduct.slug || editingProduct.name!.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    const payload = { ...editingProduct, slug, updated_at: new Date().toISOString() }
    if (editingProduct.id) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id)
      if (error) { toast.error(error.message); setSavingProduct(false); return }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { toast.error(error.message); setSavingProduct(false); return }
    }
    toast.success(editingProduct.id ? 'Product updated!' : 'Product created!')
    setEditingProduct(null)
    loadData()
    setSavingProduct(false)
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    const supabase = getSupabase()
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product deleted')
    loadData()
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editingProduct) return
    setUploadingImage(true)
    const supabase = getSupabase()
    const ext = file.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`
    const { error, data } = await supabase.storage.from('products').upload(path, file)
    if (error) { toast.error('Upload failed: ' + error.message); setUploadingImage(false); return }
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(data.path)
    setEditingProduct(prev => ({ ...prev!, images: [...(prev!.images || []), publicUrl] }))
    setUploadingImage(false)
    toast.success('Image uploaded!')
  }

  async function addImageUrl() {
    const url = prompt('Paste image URL:')
    if (url) setEditingProduct(prev => ({ ...prev!, images: [...(prev!.images || []), url] }))
  }

  async function updateOrderStatus(orderId: string, status: string) {
    const supabase = getSupabase()
    await supabase.from('orders').update({ status }).eq('id', orderId)
    toast.success('Order status updated')
    loadData()
  }

  async function savePost() {
    if (!editingPost?.title) { toast.error('Title required'); return }
    setSavingPost(true)
    const supabase = getSupabase()
    const slug = editingPost.slug || editingPost.title!.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    const payload = { ...editingPost, slug }
    if (editingPost.id) {
      await supabase.from('blog_posts').update(payload).eq('id', editingPost.id)
    } else {
      await supabase.from('blog_posts').insert(payload)
    }
    toast.success(editingPost.id ? 'Post updated!' : 'Post published!')
    setEditingPost(null)
    loadData()
    setSavingPost(false)
  }

  if (loading) return <div className="section-padding container-site text-center text-brand-muted font-body">Loading…</div>
  if (!isAdmin) return null

  const TABS: { key: AdminTab; label: string; icon: IconType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
    { key: 'products', label: 'Products', icon: LuPackage },
    { key: 'orders', label: 'Orders', icon: LuReceipt },
    { key: 'blog', label: 'Blog', icon: LuPenLine },
    { key: 'customers', label: 'Customers', icon: LuUsers },
  ]

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container-site py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-medium text-brand-dark">Admin Dashboard</h1>
          <span className="badge-new px-3 py-1 text-xs">NTK Beauty Admin</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-brand-beige rounded-2xl p-1 mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-medium transition-all whitespace-nowrap ${tab === t.key ? 'bg-brand-rose text-white shadow-sm' : 'text-brand-muted hover:text-brand-dark'}`}>
              <t.icon className="w-4 h-4" aria-hidden /> {t.label}
            </button>
          ))}
        </div>

        {/* ── Dashboard ─────────────────────────────────────────── */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Products', value: stats.products, icon: LuPackage, color: 'bg-brand-rose/10 text-brand-rose' },
                { label: 'Orders', value: stats.orders, icon: LuReceipt, color: 'bg-brand-green/10 text-brand-green' },
                { label: 'Revenue', value: formatPrice(stats.revenue), icon: LuWallet, color: 'bg-amber-50 text-amber-700' },
                { label: 'Customers', value: stats.customers, icon: LuUsers, color: 'bg-blue-50 text-blue-700' },
              ].map(s => (
                <div key={s.label} className="card p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${s.color}`}><s.icon className="w-5 h-5" aria-hidden /></div>
                  <p className="font-display text-2xl font-semibold text-brand-dark">{s.value}</p>
                  <p className="text-xs text-brand-muted font-body mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-5">
                <h3 className="font-body font-semibold text-brand-dark mb-3">Recent Orders</h3>
                <div className="space-y-2">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex justify-between text-sm font-body">
                      <span className="text-brand-muted font-mono text-xs">{o.id?.slice(0, 8)}…</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${o.status === 'delivered' ? 'bg-brand-green/10 text-brand-green' : o.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-brand-rose/10 text-brand-rose'}`}>{o.status}</span>
                      <span className="font-medium">{formatPrice(o.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="font-body font-semibold text-brand-dark mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button onClick={() => { setTab('products'); setEditingProduct(blankProduct()) }} className="w-full btn-primary justify-center py-2.5 text-sm">+ Add New Product</button>
                  <button onClick={() => { setTab('blog'); setEditingPost({ title: '', excerpt: '', content: '', category: 'Skincare Basics', author_name: 'NTK Beauty Team', published: true, read_time: 5, cover_image: '' }) }} className="w-full btn-outline justify-center py-2.5 text-sm">+ Write Blog Post</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Products ──────────────────────────────────────────── */}
        {tab === 'products' && (
          <div>
            {/* Always-visible Add button */}
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-brand-muted font-body">{products.length} products</p>
              <button onClick={() => setEditingProduct(blankProduct())} className="btn-primary">+ Add Product</button>
            </div>

            {/* Product form */}
            {editingProduct && (
              <div className="card p-6 mb-6 animate-fade-in">
                <h2 className="font-display text-xl font-medium text-brand-dark mb-5">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Product Name *</label>
                    <input className="input" value={editingProduct.name || ''} onChange={e => setEditingProduct(p => ({ ...p!, name: e.target.value }))} placeholder="COSRX Advanced Snail…" />
                  </div>
                  <div>
                    <label className="label">Brand</label>
                    <input className="input" value={editingProduct.brand || ''} onChange={e => setEditingProduct(p => ({ ...p!, brand: e.target.value }))} placeholder="COSRX" />
                  </div>
                  <div>
                    <label className="label">Price (KShs) *</label>
                    <input className="input" type="number" value={editingProduct.price || ''} onChange={e => setEditingProduct(p => ({ ...p!, price: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className="label">Original Price (KShs)</label>
                    <input className="input" type="number" value={editingProduct.original_price || ''} onChange={e => setEditingProduct(p => ({ ...p!, original_price: parseInt(e.target.value) || null }))} />
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select className="input" value={editingProduct.category || 'serums'} onChange={e => setEditingProduct(p => ({ ...p!, category: e.target.value }))}>
                      {PRODUCT_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Slug (auto-generated if blank)</label>
                    <input className="input" value={editingProduct.slug || ''} onChange={e => setEditingProduct(p => ({ ...p!, slug: e.target.value }))} placeholder="cosrx-snail-mucin" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Description</label>
                    <textarea className="input h-24 resize-none" value={editingProduct.description || ''} onChange={e => setEditingProduct(p => ({ ...p!, description: e.target.value }))} />
                  </div>

                  {/* Images */}
                  <div className="md:col-span-2">
                    <label className="label">Images (up to 5)</label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {(editingProduct.images || []).map((img, i) => (
                        <div key={`edit-img-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-brand-beige group">
                          <Image src={img} alt={`Product ${i+1}`} fill className="object-cover" sizes="80px" />
                          <button onClick={() => setEditingProduct(p => ({ ...p!, images: p!.images!.filter((_, idx) => idx !== i) }))}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                      {(editingProduct.images || []).length < 5 && (
                        <div className="flex gap-2">
                          <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                            className="w-20 h-20 border-2 border-dashed border-brand-beige rounded-xl flex flex-col items-center justify-center text-brand-muted hover:border-brand-rose hover:text-brand-rose transition-colors text-xs gap-1">
                            {uploadingImage ? '…' : (<><LuFolderUp className="w-5 h-5" aria-hidden /><span>Upload</span></>)}
                          </button>
                          <button onClick={addImageUrl}
                            className="w-20 h-20 border-2 border-dashed border-brand-beige rounded-xl flex flex-col items-center justify-center text-brand-muted hover:border-brand-rose hover:text-brand-rose transition-colors text-xs gap-1">
                            <LuLink className="w-5 h-5" aria-hidden /><span>URL</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-6">
                    {[
                      { key: 'in_stock', label: 'In Stock' },
                      { key: 'is_featured', label: 'Featured' },
                      { key: 'is_new', label: 'New' },
                    ].map(toggle => (
                      <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox"
                          checked={!!editingProduct[toggle.key as keyof typeof editingProduct]}
                          onChange={e => setEditingProduct(p => ({ ...p!, [toggle.key]: e.target.checked }))}
                          className="accent-brand-rose w-4 h-4" />
                        <span className="text-sm font-body text-brand-dark">{toggle.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={saveProduct} disabled={savingProduct} className="btn-primary">{savingProduct ? 'Saving…' : editingProduct.id ? 'Save Changes' : 'Create Product'}</button>
                  <button onClick={() => setEditingProduct(null)} className="btn-outline">Cancel</button>
                </div>
              </div>
            )}

            {/* Products table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-beige">
                      <th className="text-left text-xs uppercase tracking-wider text-brand-muted font-body font-semibold p-4">Product</th>
                      <th className="text-left text-xs uppercase tracking-wider text-brand-muted font-body font-semibold p-4 hidden md:table-cell">Category</th>
                      <th className="text-left text-xs uppercase tracking-wider text-brand-muted font-body font-semibold p-4">Price</th>
                      <th className="text-left text-xs uppercase tracking-wider text-brand-muted font-body font-semibold p-4 hidden sm:table-cell">Status</th>
                      <th className="p-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-brand-cream/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-brand-beige flex-shrink-0">
                              {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />}
                            </div>
                            <div>
                              <p className="text-sm font-body font-medium text-brand-dark line-clamp-1">{p.name}</p>
                              <p className="text-xs text-brand-muted font-body">{p.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-xs font-body text-brand-muted capitalize">{p.category}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-body font-medium text-brand-dark">{formatPrice(p.price)}</span>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.in_stock ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-muted/10 text-brand-muted'}`}>
                            {p.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingProduct(p)} className="text-xs text-brand-rose hover:text-brand-rose-dark font-body transition-colors">Edit</button>
                            <button onClick={() => deleteProduct(p.id)} className="text-xs text-brand-muted hover:text-red-600 font-body transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Orders ────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-beige">
                    {['Order ID', 'Customer', 'Total', 'Status', 'Payment', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs uppercase tracking-wider text-brand-muted font-body font-semibold p-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-brand-cream/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-brand-muted">{o.id?.slice(0, 8)}…</td>
                      <td className="p-4">
                        <p className="text-sm font-body text-brand-dark">{o.shipping_address?.full_name}</p>
                        <p className="text-xs text-brand-muted">{o.shipping_address?.phone}</p>
                      </td>
                      <td className="p-4 text-sm font-body font-semibold text-brand-dark">{formatPrice(o.total)}</td>
                      <td className="p-4">
                        <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                          className="text-xs border border-brand-beige rounded-lg px-2 py-1 font-body text-brand-dark bg-white focus:outline-none focus:border-brand-rose">
                          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${o.payment_status === 'paid' ? 'bg-brand-green/10 text-brand-green' : o.payment_status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                          {o.payment_status}
                        </span>
                      </td>
                      <td className="p-4">
                        <a href={`https://wa.me/${o.shipping_address?.phone?.replace(/^0/, '254')}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-brand-green hover:text-green-700 font-body transition-colors">WhatsApp</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Blog ─────────────────────────────────────────────── */}
        {tab === 'blog' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-brand-muted font-body">{posts.length} posts</p>
              <button onClick={() => setEditingPost({ title: '', excerpt: '', content: '', category: 'Skincare Basics', author_name: 'NTK Beauty Team', published: true, read_time: 5, cover_image: '', slug: '' })} className="btn-primary">+ New Post</button>
            </div>

            {editingPost && (
              <div className="card p-6 mb-6 animate-fade-in">
                <h2 className="font-display text-xl font-medium text-brand-dark mb-5">{editingPost.id ? 'Edit Post' : 'New Blog Post'}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="label">Title *</label>
                      <input className="input" value={editingPost.title || ''} onChange={e => setEditingPost(p => ({ ...p!, title: e.target.value }))} placeholder="5 Best Serums for Hyperpigmentation…" />
                    </div>
                    <div>
                      <label className="label">Category</label>
                      <select className="input" value={editingPost.category || ''} onChange={e => setEditingPost(p => ({ ...p!, category: e.target.value }))}>
                        {['Skincare Basics', 'Ingredients', 'K-Beauty', 'Skin Concerns', 'SPF & Sun Care'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Read Time (minutes)</label>
                      <input className="input" type="number" value={editingPost.read_time || 5} onChange={e => setEditingPost(p => ({ ...p!, read_time: parseInt(e.target.value) }))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Cover Image URL</label>
                      <input className="input" value={editingPost.cover_image || ''} onChange={e => setEditingPost(p => ({ ...p!, cover_image: e.target.value }))} placeholder="https://images.unsplash.com/…" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Excerpt</label>
                      <textarea className="input h-20 resize-none" value={editingPost.excerpt || ''} onChange={e => setEditingPost(p => ({ ...p!, excerpt: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Content (HTML)</label>
                      <textarea className="input h-48 resize-y font-mono text-xs" value={editingPost.content || ''} onChange={e => setEditingPost(p => ({ ...p!, content: e.target.value }))} placeholder="<p>Your article content…</p>" />
                    </div>
                    <div>
                      <label className="label">Author Name</label>
                      <input className="input" value={editingPost.author_name || ''} onChange={e => setEditingPost(p => ({ ...p!, author_name: e.target.value }))} />
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <input type="checkbox" checked={!!editingPost.published} onChange={e => setEditingPost(p => ({ ...p!, published: e.target.checked }))} className="accent-brand-rose w-4 h-4" id="pub" />
                      <label htmlFor="pub" className="text-sm font-body text-brand-dark cursor-pointer">Published</label>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={savePost} disabled={savingPost} className="btn-primary">{savingPost ? 'Saving…' : editingPost.id ? 'Save Changes' : 'Publish Post'}</button>
                    <button onClick={() => setEditingPost(null)} className="btn-outline">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {posts.map(p => (
                <div key={p.id} className="card p-4 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-brand-beige">
                    {p.cover_image && <Image src={p.cover_image} alt={p.title} fill className="object-cover" sizes="64px" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-brand-dark line-clamp-1">{p.title}</p>
                    <p className="text-xs text-brand-muted font-body">{p.category} · {p.read_time} min read · {p.published
                      ? <span className="inline-flex items-center gap-1 text-brand-green"><LuCircleCheck className="w-3.5 h-3.5" aria-hidden /> Published</span>
                      : <span className="inline-flex items-center gap-1"><LuCirclePause className="w-3.5 h-3.5" aria-hidden /> Draft</span>}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPost(p)} className="text-xs text-brand-rose font-body hover:text-brand-rose-dark transition-colors">Edit</button>
                    <button onClick={async () => { if (!confirm('Delete post?')) return; const s = getSupabase(); await s.from('blog_posts').delete().eq('id', p.id); loadData() }} className="text-xs text-brand-muted font-body hover:text-red-600 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Customers ─────────────────────────────────────────── */}
        {tab === 'customers' && <CustomersTab />}
      </div>
    </div>
  )
}

function CustomersTab() {
  const [customers, setCustomers] = useState<Array<{ id: string; email: string; full_name: string; role: string; created_at: string }>>([])

  useEffect(() => {
    const supabase = getSupabase()
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setCustomers(data as typeof customers)
    })
  }, [])

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-beige">
              {['Name', 'Email', 'Role', 'Joined'].map(h => (
                <th key={h} className="text-left text-xs uppercase tracking-wider text-brand-muted font-body font-semibold p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-beige">
            {customers.map(c => (
              <tr key={c.id} className="hover:bg-brand-cream/50">
                <td className="p-4 text-sm font-body text-brand-dark">{c.full_name || '—'}</td>
                <td className="p-4 text-sm font-body text-brand-muted">{c.email}</td>
                <td className="p-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.role === 'admin' ? 'bg-brand-rose/10 text-brand-rose' : 'bg-brand-cream text-brand-muted border border-brand-beige'}`}>{c.role}</span>
                </td>
                <td className="p-4 text-xs text-brand-muted font-body">{c.created_at ? new Date(c.created_at).toLocaleDateString('en-KE') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
