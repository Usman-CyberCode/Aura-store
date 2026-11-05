/**
 * AURA STORE — Order Persistence Layer
 *
 * NOTE: This is a clearly documented development-only in-memory order store.
 * Data persists during server runtime in memory, but resets on server restarts.
 * It is architected with clean async contracts to allow direct drop-in replacement
 * with PostgreSQL / Prisma / Supabase in future production stages.
 */

import { Order } from "@/types/order";

// Global singleton map to preserve orders across hot reloads in development
const globalForOrders = globalThis as unknown as {
  __aura_orders_store__?: Map<string, Order>;
};

if (!globalForOrders.__aura_orders_store__) {
  globalForOrders.__aura_orders_store__ = new Map<string, Order>();
}

const ordersStore = globalForOrders.__aura_orders_store__;

/**
 * Generate a luxury editorial order number (e.g. AURA-2026-X7K9)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timestampPart = Date.now().toString(36).substring(4).toUpperCase();
  return `AURA-${year}-${randomPart}${timestampPart}`;
}

/**
 * Save an order to the in-memory store.
 * NOTE: To protect customer privacy, addresses and phone numbers are NEVER logged.
 */
export async function saveOrder(order: Order): Promise<Order> {
  // Store by order ID
  ordersStore.set(order.id, order);

  // Safe developer logging (excluding sensitive PII like exact address and phone)
  console.log(
    `[AURA ORDERS] Order Created: ${order.orderNumber} | Customer: ${order.customer.fullName} | Items: ${order.items.length} | Total: PKR ${order.total.toLocaleString()}`
  );

  return order;
}

/**
 * Retrieve an order by its unique ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  return ordersStore.get(id) || null;
}

/**
 * Retrieve an order by its public orderNumber
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  for (const order of ordersStore.values()) {
    if (order.orderNumber === orderNumber) {
      return order;
    }
  }
  return null;
}

/**
 * Return total stored orders count (for development inspection)
 */
export async function getOrdersCount(): Promise<number> {
  return ordersStore.size;
}

