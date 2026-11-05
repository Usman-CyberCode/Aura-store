export type PaymentMethod = "cod" | "bank_transfer";

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderItemRequest {
  productId: string; // id or slug
  size: string;
  quantity: number;
}

export interface OrderItemResponse {
  productId: string;
  slug: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number; // calculated server-side in PKR
  lineTotal: number; // calculated server-side
  image: string;
}

export interface CreateOrderPayload {
  customer: CustomerDetails;
  items: OrderItemRequest[];
  paymentMethod: PaymentMethod;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItemResponse[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}

export interface OrderApiResponse {
  success: boolean;
  message?: string;
  order?: Order;
  errors?: Record<string, string>;
}
