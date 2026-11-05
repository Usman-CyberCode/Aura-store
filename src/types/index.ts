export interface Product {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  category: "outerwear" | "hoodies" | "tees" | "footwear" | "accessories";
  image: string;
  badge?: "New" | "Exclusive" | "Limited";
  inStock: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

