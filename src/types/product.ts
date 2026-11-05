export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in PKR
  category: "hoodies" | "jackets" | "footwear" | "tees";
  image: string;
  gallery?: string[];
  badge?: "NEW DROP" | "LIMITED EDITION" | "EXCLUSIVE" | "ARCHIVE";
  sizes: string[];
  color: string;
  material?: string;
  cut?: string;
  care?: string;
}

export interface CartItem {
  id: string; // generated as `${productId}-${size}`
  product: Product;
  size: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  formatPrice: (amount: number) => string;
}
