export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number          // integer KES
  original_price?: number | null
  images: string[]
  category: string
  brand: string
  skin_types: string[]
  concerns: string[]
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  rating: number
  review_count: number
  ingredients?: string
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface WishlistItem {
  product: Product
}

export interface Address {
  full_name: string
  phone: string
  email: string
  county: string
  town: string
  street: string
}

export interface Order {
  id: string
  user_id?: string
  items: CartItem[]
  shipping_address: Address
  subtotal: number
  shipping_fee: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'mpesa' | 'cod'
  payment_status: 'pending' | 'paid' | 'failed'
  mpesa_transaction_id?: string
  created_at?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  author_name: string
  published: boolean
  read_time: number
  created_at?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'customer' | 'admin'
  created_at?: string
}

export interface Review {
  id: string
  product_id: string
  user_id?: string
  user_name: string
  rating: number
  comment: string
  verified_purchase: boolean
  created_at?: string
}

export type ProductCategory =
  | 'cleansers'
  | 'serums'
  | 'moisturizers'
  | 'sunscreen'
  | 'toners'
  | 'masks'
  | 'eyecare'
  | 'treatments'
  | 'bodycare'
