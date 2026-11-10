# NTK Beauty Kenya — Full Stack E-Commerce

Premium Korean skincare and beauty products for the Kenyan market. Built with Next.js 14, Supabase, M-Pesa Daraja API, and WhatsApp Business Cloud API.

## Tech Stack
- **Framework:** Next.js 14 App Router
- **Styling:** Tailwind CSS with custom brand tokens
- **Database/Auth/Storage:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** M-Pesa Daraja STK Push
- **Order Notifications:** WhatsApp Business Cloud API
- **Deployment:** Vercel

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page (Client Component)
│   ├── shop/               # Shop + product detail
│   ├── blog/               # Blog list + post
│   ├── cart/               # Shopping cart
│   ├── wishlist/           # Wishlist
│   ├── checkout/           # Checkout + M-Pesa
│   ├── contact/            # Contact + FAQ
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── components/             # Reusable UI components
├── context/                # React Context (Cart, Wishlist, Auth)
├── lib/                    # Supabase client + utilities
└── types/                  # TypeScript interfaces
```

## Key Features

- **553 real products** 
- **M-Pesa STK Push** — customers pay from their phone
- **WhatsApp order notifications** — owner gets instant message on every order
- **Supabase Auth** — email/password with admin roles
- **Image uploads** — Supabase Storage with drag-preview in admin
- **Blog CMS** — full CRUD in admin dashboard
- **Skin concern filtering** — Acne, Dark Spots, Hydration, etc.
- **Persistent cart/wishlist** — saved to localStorage
- **Order management** — status updates in admin

---
