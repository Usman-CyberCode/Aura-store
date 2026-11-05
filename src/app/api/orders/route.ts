import { NextRequest, NextResponse } from "next/server";
import { FEATURED_PRODUCTS, getProductBySlug } from "@/data/products";
import {
  CreateOrderPayload,
  Order,
  OrderItemResponse,
  OrderApiResponse,
} from "@/types/order";
import { saveOrder, generateOrderNumber } from "@/lib/orders";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9\s\-()]{8,20}$/;

export async function POST(req: NextRequest) {
  try {
    let body: CreateOrderPayload;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json<OrderApiResponse>(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { customer, items, paymentMethod } = body;
    const errors: Record<string, string> = {};

    // 1. Customer Details Validation
    if (!customer) {
      return NextResponse.json<OrderApiResponse>(
        { success: false, message: "Missing customer details." },
        { status: 400 }
      );
    }

    if (!customer.fullName || customer.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters.";
    }

    if (!customer.email || !EMAIL_REGEX.test(customer.email.trim())) {
      errors.email = "Please provide a valid email address.";
    }

    if (!customer.phone || !PHONE_REGEX.test(customer.phone.trim())) {
      errors.phone = "Please provide a valid phone number (min 8 digits).";
    }

    if (!customer.address || customer.address.trim().length < 5) {
      errors.address = "Street address must be at least 5 characters.";
    }

    if (!customer.city || customer.city.trim().length < 2) {
      errors.city = "City is required.";
    }

    // 2. Payment Method Validation
    if (paymentMethod !== "cod" && paymentMethod !== "bank_transfer") {
      errors.paymentMethod = "Payment method must be 'cod' or 'bank_transfer'.";
    }

    // 3. Items Validation & Server-Side Price Verification
    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.items = "Cart is empty. At least one item is required.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json<OrderApiResponse>(
        {
          success: false,
          message: "Please correct the errors before placing your order.",
          errors,
        },
        { status: 400 }
      );
    }

    const verifiedItems: OrderItemResponse[] = [];
    let calculatedSubtotal = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Validate quantity
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty <= 0) {
        return NextResponse.json<OrderApiResponse>(
          {
            success: false,
            message: `Invalid quantity for item #${i + 1}. Must be an integer >= 1.`,
          },
          { status: 400 }
        );
      }

      // Look up product in server-side authoritative catalogue
      const product =
        getProductBySlug(item.productId) ||
        FEATURED_PRODUCTS.find((p) => p.id === item.productId);

      if (!product) {
        return NextResponse.json<OrderApiResponse>(
          {
            success: false,
            message: `Product '${item.productId}' not found in official catalog.`,
          },
          { status: 404 }
        );
      }

      // Validate size selection
      if (product.sizes && product.sizes.length > 0) {
        if (!item.size || !product.sizes.includes(item.size)) {
          return NextResponse.json<OrderApiResponse>(
            {
              success: false,
              message: `Invalid size '${item.size}' for ${product.name}. Allowed: ${product.sizes.join(
                ", "
              )}`,
            },
            { status: 400 }
          );
        }
      }

      // Authoritative server-side price calculation
      const unitPrice = product.price;
      const lineTotal = unitPrice * qty;
      calculatedSubtotal += lineTotal;

      verifiedItems.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: item.size || "Standard",
        quantity: qty,
        unitPrice,
        lineTotal,
        image: product.image,
      });
    }

    // Server calculated totals (Promotional Free Express Shipping applied)
    const calculatedShipping = 0;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    // 4. Construct Order Object
    const orderId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber: generateOrderNumber(),
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        postalCode: customer.postalCode?.trim() || undefined,
        notes: customer.notes?.trim() || undefined,
      },
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      total: calculatedTotal,
      paymentMethod,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save to server-side orders store
    await saveOrder(newOrder);

    return NextResponse.json<OrderApiResponse>(
      {
        success: true,
        message: "Order placed successfully.",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[AURA ORDERS API ERROR]", error);
    return NextResponse.json<OrderApiResponse>(
      {
        success: false,
        message: "An internal server error occurred while processing the order.",
      },
      { status: 500 }
    );
  }
}
