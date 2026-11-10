import { LuDroplets, LuFlaskConical, LuDroplet, LuSun, LuLeaf, LuSparkles, LuEye, LuTarget, LuBath, LuShieldCheck, LuMoon, LuWaves, LuHourglass, LuFeather, LuMicroscope } from 'react-icons/lu'

// Utility: merge Tailwind classes safely (like shadcn/ui cn())
// Install clsx: npm install clsx
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ')
}
// Format price in KES — e.g. 2500 → "KShs 2,500"
export function formatPrice(price: number): string {
  return `KShs ${price.toLocaleString('en-KE')}`
}
// Slugify a string for URL-safe slugs
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '')
}
// Shipping fee logic based on Kenya county
export function getShippingFee(county: string): number {
  const NAIROBI_TOWNS = ['Nairobi']
  const CENTRAL_COUNTIES = ['Kiambu', 'Murang\'a', 'Nyeri', 'Kirinyaga', 'Nyandarua']
  if (NAIROBI_TOWNS.includes(county)) return 200
  if (CENTRAL_COUNTIES.includes(county)) return 350
  return 500 // rest of Kenya
}
// All 47 Kenya counties for checkout form
export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale',
  'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru',
  'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
]
// Product category definitions used throughout the app
export const PRODUCT_CATEGORIES = [
  { slug: 'cleansers', label: 'Cleansers', icon: LuDroplets, description: 'Gentle cleansers for every skin type' },
  { slug: 'serums', label: 'Serums & Ampoules', icon: LuFlaskConical, description: 'Targeted treatments packed with active ingredients' },
  { slug: 'moisturizers', label: 'Moisturizers', icon: LuDroplet, description: 'Hydrating creams and lotions' },
  { slug: 'sunscreen', label: 'Sunscreen', icon: LuSun, description: 'SPF protection for Kenyan skies' },
  { slug: 'toners', label: 'Toners', icon: LuLeaf, description: 'Balance and prep your skin' },
  { slug: 'masks', label: 'Masks & Exfoliators', icon: LuSparkles, description: 'Weekly treatments for glowing skin' },
  { slug: 'eyecare', label: 'Eye & Lip Care', icon: LuEye, description: 'Delicate care for delicate skin' },
  { slug: 'treatments', label: 'Spot Treatments', icon: LuTarget, description: 'Targeted solutions for acne, spots & pigmentation' },
  { slug: 'bodycare', label: 'Body Care', icon: LuBath, description: 'Head-to-toe skincare rituals' },
]
// Skin concerns for filtering and homepage
export const SKIN_CONCERNS = [
  { slug: 'acne', label: 'Acne', icon: LuShieldCheck, description: 'Clear breakouts for good' },
  { slug: 'dark-spots', label: 'Dark Spots', icon: LuMoon, description: 'Fade hyperpigmentation' },
  { slug: 'hydration', label: 'Hydration', icon: LuWaves, description: 'Quench thirsty skin' },
  { slug: 'anti-aging', label: 'Anti-Aging', icon: LuHourglass, description: 'Turn back the clock' },
  { slug: 'sensitive-skin', label: 'Sensitive Skin', icon: LuFeather, description: 'Gentle, calming formulas' },
  { slug: 'pore-care', label: 'Pore Care', icon: LuMicroscope, description: 'Minimize and refine pores' },
]
// Truncate text to a given number of characters
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}