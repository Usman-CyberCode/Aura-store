import { Product } from "@/types/product";

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "aura-premium-black-hoodie",
    slug: "aura-obsidian-heavyweight-hoodie",
    name: "AURA Obsidian Heavyweight Hoodie",
    tagline: "520 GSM Sculpted French Terry",
    description:
      "Engineered from dense 520 GSM combed organic cotton with reinforced double-needle seams, sculpted oversized drop-shoulder cut, and concealed kangaroo pocket. Designed to retain architectural drape across seasons.",
    price: 14800,
    category: "hoodies",
    image: "/images/Sitting black hoodie model.png",
    gallery: [
      "/images/Sitting black hoodie model.png",
      "/images/Black masked hoodie model.png",
      "/images/Hoodie rack.png",
    ],
    badge: "LIMITED EDITION",
    sizes: ["S", "M", "L", "XL"],
    color: "Washed Obsidian",
    material: "100% Combed Organic Cotton (520 GSM)",
    cut: "Sculpted Oversized / Dropped Shoulder",
    care: "Machine wash cold inside-out. Hang dry only.",
  },
  {
    id: "aura-back-print-hoodie",
    slug: "aura-signature-back-print-hoodie",
    name: "AURA Signature Back-Print Hoodie",
    tagline: "High-Density Tactile Typography",
    description:
      "Iconic high-density matte graphite AURA branding on the reverse. Engineered ribbed cuffs, bespoke gunmetal eyelets, and architectural drape with an oversized lined hood.",
    price: 16500,
    category: "hoodies",
    image: "/images/AURA back-print hoodie.png",
    gallery: [
      "/images/AURA back-print hoodie.png",
      "/images/Sitting black hoodie model.png",
      "/images/Black masked hoodie model.png",
    ],
    badge: "NEW DROP",
    sizes: ["S", "M", "L", "XL"],
    color: "Pitch Black",
    material: "Heavyweight French Terry (500 GSM)",
    cut: "Relaxed Boxy Fit",
    care: "Dry clean recommended or cold gentle wash.",
  },
  {
    id: "aura-black-puffer-jacket",
    slug: "aura-tactical-puffer-jacket",
    name: "AURA Tactical Puffer Jacket",
    tagline: "All-Weather Technical Insulation",
    description:
      "Water-repellent technical ripstop shell packed with lightweight thermal fill. Features a stand collar, tonal hardware, storm flap closure, and signature architectural volume.",
    price: 24900,
    category: "jackets",
    image: "/images/Black puffer jacket model.png",
    gallery: [
      "/images/Black puffer jacket model.png",
      "/images/Full-body masked model.png",
    ],
    badge: "EXCLUSIVE",
    sizes: ["S", "M", "L", "XL"],
    color: "Matte Charcoal",
    material: "Waterproof Micro-Ripstop Nylon with Thermal Eco-Fill",
    cut: "Volumetric High-Collar Silhouette",
    care: "Specialist clean only.",
  },
  {
    id: "aura-red-black-sneaker",
    slug: "aura-nocturne-court-sneaker",
    name: "AURA Nocturne Court Sneaker",
    tagline: "Hand-Crafted Italian Nappa & Suede",
    description:
      "Sculpted silhouette composed of premium full-grain Italian leather and crimson suede panelling. Finished with padded collars, waxed cotton laces, and a lugged traction sole.",
    price: 21500,
    category: "footwear",
    image: "/images/Red-black sneaker.png",
    gallery: [
      "/images/Red-black sneaker.png",
      "/images/Black-red sneakers model.png",
    ],
    badge: "ARCHIVE",
    sizes: ["40", "41", "42", "43", "44"],
    color: "Noir / Crimson Accent",
    material: "Full-Grain Italian Calfskin & Crimson Suede",
    cut: "Low-Top Padded Court Silhouette",
    care: "Wipe with damp cloth. Apply specialized leather balm.",
  },
  {
    id: "aura-grey-oversized-tee",
    slug: "aura-minimalist-grey-t-shirt",
    name: "AURA Minimalist Grey T-Shirt",
    tagline: "280 GSM Compact Jersey",
    description:
      "Boxy streetwear silhouette cut from pre-shrunk compact cotton jersey. Clean raw-hem finish and tonal micro-embroidery at the nape. Ideal for standalone wear or foundational layering.",
    price: 7800,
    category: "tees",
    image: "/images/Grey T-shirt model.png",
    gallery: [
      "/images/Grey T-shirt model.png",
      "/images/Beige T-shirt model.png",
    ],
    badge: "NEW DROP",
    sizes: ["S", "M", "L", "XL"],
    color: "Heather Slate",
    material: "280 GSM Pre-Shrunk Compact Cotton",
    cut: "Extended Shoulder / Boxy Torso",
    care: "Machine wash cold with similar colors.",
  },
  {
    id: "aura-beige-oversized-tee",
    slug: "aura-alabaster-oversized-t-shirt",
    name: "AURA Alabaster Oversized T-Shirt",
    tagline: "280 GSM Drop-Shoulder Essential",
    description:
      "Earthy neutral tone crafted for effortless layering. Features dropped shoulder seams, ribbed crewneck collar, and relaxed silhouette with a tactile matte finish.",
    price: 7800,
    category: "tees",
    image: "/images/Beige T-shirt model.png",
    gallery: [
      "/images/Beige T-shirt model.png",
      "/images/Grey T-shirt model.png",
    ],
    sizes: ["S", "M", "L", "XL"],
    color: "Warm Alabaster",
    material: "280 GSM Organic Cotton Jersey",
    cut: "Relaxed Drop-Shoulder Cut",
    care: "Wash cold. Tumble dry low or air dry.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return FEATURED_PRODUCTS.find(
    (product) => product.slug === slug || product.id === slug
  );
}

export function getAllProductSlugs(): string[] {
  return FEATURED_PRODUCTS.map((p) => p.slug);
}
