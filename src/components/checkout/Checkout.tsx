"use client";

import { useState, useRef, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Banknote,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useCart } from "@/components/cart/CartProvider";
import { Order, PaymentMethod, OrderApiResponse } from "@/types/order";
import styles from "./Checkout.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9\s\-()]{8,20}$/;

export default function Checkout() {
  const { items, subtotal, clearCart, formatPrice } = useCart();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  // Interaction & submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Client-side Validation (for immediate user feedback)
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Full name is required (min 2 characters).";
    }

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!phone.trim() || !PHONE_REGEX.test(phone.trim())) {
      errors.phone = "Please enter a valid phone number (min 8 digits).";
    }

    if (!address.trim() || address.trim().length < 5) {
      errors.address = "Complete street address is required.";
    }

    if (!city.trim() || city.trim().length < 2) {
      errors.city = "City is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    // Prevent checkout if cart is empty
    if (items.length === 0) {
      setGlobalError("Your cart is empty. Please add items before placing an order.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          postalCode,
          notes,
        },
        items: items.map((item) => ({
          productId: item.product.slug,
          size: item.size,
          quantity: item.quantity,
        })),
        paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: OrderApiResponse = await res.json();

      if (!res.ok || !data.success || !data.order) {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setGlobalError(data.message || "Failed to place order. Please review your details.");
        setIsSubmitting(false);
        return;
      }

      // Success: store order confirmation, then clear cart
      setConfirmedOrder(data.order);
      clearCart();

      // Smooth scroll to top of confirmation card
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Order submission network error:", err);
      setGlobalError("A connection error occurred. Please verify your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // GSAP animation
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!containerRef.current || prefersReducedMotion) return;

      gsap.fromTo(
        [formRef.current, summaryRef.current],
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }
      );
    },
    { scope: containerRef, dependencies: [confirmedOrder] }
  );

  return (
    <section ref={containerRef} className={styles.checkoutSection}>
      {/* Cinematic Lighting Atmosphere */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.charcoalBackdrop} />
        <div className={styles.subtleRedAccent} />
      </div>

      <div className={styles.container}>
        {/* CASE 1: ORDER CONFIRMATION VIEW */}
        {confirmedOrder ? (
          <div className={styles.confirmationContainer}>
            <div className={styles.confirmHeader}>
              <div className={styles.confirmIconRing}>
                <CheckCircle2 size={30} />
              </div>
              <span className={styles.confirmOrderBadge}>DISPATCH QUEUED // GENESIS FW26</span>
              <h1 className={styles.confirmTitle}>ORDER CONFIRMED</h1>
              <p className={styles.pageSubtitle}>
                Thank you for acquiring with AURA. A confirmation has been transmitted to your email.
              </p>
              <div className={styles.confirmOrderNumber}>
                {confirmedOrder.orderNumber}
              </div>
            </div>

            <div className={styles.confirmGrid}>
              <div className={styles.confirmBlock}>
                <span className={styles.confirmLabel}>RECIPIENT &amp; CONTACT</span>
                <p className={styles.confirmValue}>
                  <strong>{confirmedOrder.customer.fullName}</strong>
                  <br />
                  {confirmedOrder.customer.email}
                  <br />
                  {confirmedOrder.customer.phone}
                </p>
              </div>

              <div className={styles.confirmBlock}>
                <span className={styles.confirmLabel}>DELIVERY DESTINATION</span>
                <p className={styles.confirmValue}>
                  {confirmedOrder.customer.address}
                  <br />
                  {confirmedOrder.customer.city}
                  {confirmedOrder.customer.postalCode ? `, ${confirmedOrder.customer.postalCode}` : ""}
                </p>
              </div>

              <div className={styles.confirmBlock}>
                <span className={styles.confirmLabel}>PAYMENT METHOD</span>
                <p className={styles.confirmValue}>
                  {confirmedOrder.paymentMethod === "cod"
                    ? "CASH ON DELIVERY (Pay in PKR upon arrival)"
                    : "MANUAL BANK TRANSFER (Pending Receipt)"}
                </p>
              </div>

              <div className={styles.confirmBlock}>
                <span className={styles.confirmLabel}>ESTIMATED DELIVERY</span>
                <p className={styles.confirmValue}>
                  2 — 4 BUSINESS DAYS (Complimentary Express)
                </p>
              </div>
            </div>

            {/* Confirmed Items List */}
            <div className={styles.confirmItemsSection}>
              <span className={styles.confirmLabel}>ACQUIRED PIECES ({confirmedOrder.items.length})</span>
              <div className={styles.summaryItemsList}>
                {confirmedOrder.items.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} className={styles.summaryItem}>
                    <div className={styles.itemThumbFrame}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="60px"
                        className={styles.itemThumb}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemSizeTag}>
                        SIZE: <span className={styles.itemSizeHighlight}>{item.size}</span>
                      </span>
                    </div>
                    <div className={styles.itemPriceQty}>
                      <span className={styles.itemLineTotal}>{formatPrice(item.lineTotal)}</span>
                      <span className={styles.itemQtyMultiply}>QTY: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.confirmTotalRow}>
                <span className={styles.confirmLabel}>FINAL TOTAL</span>
                <span className={styles.confirmTotalAmount}>{formatPrice(confirmedOrder.total)}</span>
              </div>
            </div>

            <div className={styles.confirmActionRow}>
              <Link href="/" className={styles.returnShopBtn}>
                <ArrowLeft size={14} />
                <span>RETURN TO HOME</span>
              </Link>
              <Link href="/#shop" className={styles.returnShopBtn} style={{ background: "transparent", color: "#ffffff", border: "1px solid var(--border-medium)" }}>
                <span>EXPLORE COLLECTION</span>
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* CASE 2: EMPTY CART VIEW */
          <div className={styles.emptyStateContainer}>
            <div className={styles.confirmIconRing}>
              <ShoppingBag size={28} />
            </div>
            <h1 className={styles.emptyTitle}>YOUR CART IS EMPTY</h1>
            <p className={styles.emptyDesc}>
              You do not have any garments queued for checkout. Browse our collection to acquire contemporary streetwear pieces.
            </p>
            <Link href="/#shop" className={styles.returnShopBtn}>
              <ArrowLeft size={14} />
              <span>ACQUIRE PIECES FROM SHOP</span>
            </Link>
          </div>
        ) : (
          /* CASE 3: ACTIVE CHECKOUT FORM */
          <>
            <header className={styles.checkoutHeader}>
              <div className={styles.kicker}>
                <span className={styles.kickerDot} />
                <span>AURA CONCIERGE // SECURE TRANSACTION</span>
              </div>
              <h1 className={styles.pageTitle}>CHECKOUT.</h1>
              <p className={styles.pageSubtitle}>
                Complete your details to acquire Genesis pieces with complimentary nationwide delivery.
              </p>
            </header>

            <div className={styles.layoutGrid}>
              {/* Form Section */}
              <form ref={formRef} className={styles.formSection} onSubmit={handleSubmit} noValidate>
                {/* Global Submission Error Message */}
                {globalError && (
                  <div className={styles.globalApiError} role="alert">
                    <AlertCircle size={16} />
                    <span>{globalError}</span>
                  </div>
                )}

                {/* 1. Customer Information */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitleRow}>
                    <span className={styles.blockNumber}>01</span>
                    <h2 className={styles.blockTitle}>CUSTOMER &amp; DELIVERY DETAILS</h2>
                  </div>

                  <div className={styles.inputGrid}>
                    {/* Full Name */}
                    <div className={`${styles.fieldGroup} ${styles.inputGridFull}`}>
                      <label htmlFor="fullName" className={styles.fieldLabel}>
                        FULL NAME *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (fieldErrors.fullName) {
                            setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                          }
                        }}
                        placeholder="e.g. Alexander Vance"
                        className={`${styles.inputControl} ${
                          fieldErrors.fullName ? styles.inputControlError : ""
                        }`}
                        aria-invalid={!!fieldErrors.fullName}
                        aria-describedby={fieldErrors.fullName ? "err-fullName" : undefined}
                        required
                      />
                      {fieldErrors.fullName && (
                        <span id="err-fullName" className={styles.fieldError}>
                          {fieldErrors.fullName}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className={styles.fieldGroup}>
                      <label htmlFor="email" className={styles.fieldLabel}>
                        EMAIL ADDRESS *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) {
                            setFieldErrors((prev) => ({ ...prev, email: "" }));
                          }
                        }}
                        placeholder="name@domain.com"
                        className={`${styles.inputControl} ${
                          fieldErrors.email ? styles.inputControlError : ""
                        }`}
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? "err-email" : undefined}
                        required
                      />
                      {fieldErrors.email && (
                        <span id="err-email" className={styles.fieldError}>
                          {fieldErrors.email}
                        </span>
                      )}
                    </div>

                    {/* Phone */}
                    <div className={styles.fieldGroup}>
                      <label htmlFor="phone" className={styles.fieldLabel}>
                        PHONE NUMBER *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (fieldErrors.phone) {
                            setFieldErrors((prev) => ({ ...prev, phone: "" }));
                          }
                        }}
                        placeholder="e.g. +92 300 1234567"
                        className={`${styles.inputControl} ${
                          fieldErrors.phone ? styles.inputControlError : ""
                        }`}
                        aria-invalid={!!fieldErrors.phone}
                        aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
                        required
                      />
                      {fieldErrors.phone && (
                        <span id="err-phone" className={styles.fieldError}>
                          {fieldErrors.phone}
                        </span>
                      )}
                    </div>

                    {/* Street Address */}
                    <div className={`${styles.fieldGroup} ${styles.inputGridFull}`}>
                      <label htmlFor="address" className={styles.fieldLabel}>
                        STREET ADDRESS *
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (fieldErrors.address) {
                            setFieldErrors((prev) => ({ ...prev, address: "" }));
                          }
                        }}
                        placeholder="House / Apartment, Street, Sector"
                        className={`${styles.inputControl} ${
                          fieldErrors.address ? styles.inputControlError : ""
                        }`}
                        aria-invalid={!!fieldErrors.address}
                        aria-describedby={fieldErrors.address ? "err-address" : undefined}
                        required
                      />
                      {fieldErrors.address && (
                        <span id="err-address" className={styles.fieldError}>
                          {fieldErrors.address}
                        </span>
                      )}
                    </div>

                    {/* City */}
                    <div className={styles.fieldGroup}>
                      <label htmlFor="city" className={styles.fieldLabel}>
                        CITY *
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (fieldErrors.city) {
                            setFieldErrors((prev) => ({ ...prev, city: "" }));
                          }
                        }}
                        placeholder="e.g. Lahore, Karachi, Islamabad"
                        className={`${styles.inputControl} ${
                          fieldErrors.city ? styles.inputControlError : ""
                        }`}
                        aria-invalid={!!fieldErrors.city}
                        aria-describedby={fieldErrors.city ? "err-city" : undefined}
                        required
                      />
                      {fieldErrors.city && (
                        <span id="err-city" className={styles.fieldError}>
                          {fieldErrors.city}
                        </span>
                      )}
                    </div>

                    {/* Postal Code (Optional) */}
                    <div className={styles.fieldGroup}>
                      <label htmlFor="postalCode" className={styles.fieldLabel}>
                        POSTAL CODE (OPTIONAL)
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 54000"
                        className={styles.inputControl}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitleRow}>
                    <span className={styles.blockNumber}>02</span>
                    <h2 className={styles.blockTitle}>PAYMENT SELECTION</h2>
                  </div>

                  <div className={styles.paymentGrid} role="radiogroup" aria-label="Select Payment Method">
                    {/* Option 1: Cash on Delivery */}
                    <div
                      className={`${styles.paymentOption} ${
                        paymentMethod === "cod" ? styles.paymentOptionActive : ""
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                      role="radio"
                      aria-checked={paymentMethod === "cod"}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setPaymentMethod("cod")}
                    >
                      <div className={styles.paymentHeader}>
                        <div className={styles.paymentTitleWrapper}>
                          <div
                            className={`${styles.radioIndicator} ${
                              paymentMethod === "cod" ? styles.radioIndicatorActive : ""
                            }`}
                          >
                            {paymentMethod === "cod" && <div className={styles.radioDot} />}
                          </div>
                          <span className={styles.paymentTitle}>CASH ON DELIVERY</span>
                        </div>
                        <Banknote size={18} style={{ color: "var(--accent-red)" }} />
                      </div>
                      <p className={styles.paymentDescription}>
                        Pay in cash upon doorstep delivery. Inspect luxury packaging before making payment.
                      </p>
                    </div>

                    {/* Option 2: Bank Transfer */}
                    <div
                      className={`${styles.paymentOption} ${
                        paymentMethod === "bank_transfer" ? styles.paymentOptionActive : ""
                      }`}
                      onClick={() => setPaymentMethod("bank_transfer")}
                      role="radio"
                      aria-checked={paymentMethod === "bank_transfer"}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setPaymentMethod("bank_transfer")}
                    >
                      <div className={styles.paymentHeader}>
                        <div className={styles.paymentTitleWrapper}>
                          <div
                            className={`${styles.radioIndicator} ${
                              paymentMethod === "bank_transfer"
                                ? styles.radioIndicatorActive
                                : ""
                            }`}
                          >
                            {paymentMethod === "bank_transfer" && (
                              <div className={styles.radioDot} />
                            )}
                          </div>
                          <span className={styles.paymentTitle}>DIRECT BANK TRANSFER</span>
                        </div>
                        <Building2 size={18} style={{ color: "var(--accent-red)" }} />
                      </div>
                      <p className={styles.paymentDescription}>
                        Transfer securely via online banking or ATM. Order will be confirmed upon manual verification.
                      </p>

                      {paymentMethod === "bank_transfer" && (
                        <div className={styles.bankDetailsBox}>
                          <div className={styles.bankRow}>
                            <span className={styles.bankLabel}>BANK:</span>
                            <span className={styles.bankVal}>Standard Chartered Pakistan</span>
                          </div>
                          <div className={styles.bankRow}>
                            <span className={styles.bankLabel}>TITLE:</span>
                            <span className={styles.bankVal}>AURA FASHION HOUSE LTD</span>
                          </div>
                          <div className={styles.bankRow}>
                            <span className={styles.bankLabel}>IBAN:</span>
                            <span className={styles.bankVal}>PK36SCBL0000001122334455</span>
                          </div>
                          <div className={styles.bankRow}>
                            <span className={styles.bankLabel}>REFERENCE:</span>
                            <span className={styles.bankVal}>Your Full Name or Order No.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className={styles.submitBlock}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitBtn}
                    aria-label="Confirm and place order"
                  >
                    <span>
                      {isSubmitting
                        ? "PROCESSING ORDER..."
                        : `CONFIRM ORDER — ${formatPrice(subtotal)}`}
                    </span>
                    <ArrowRight size={16} />
                  </button>

                  <div className={styles.securityNote}>
                    <ShieldCheck size={14} style={{ color: "var(--accent-red)" }} />
                    <span>256-BIT ENCRYPTION • VERIFIED AURA DISPATCH GUARANTEE</span>
                  </div>
                </div>
              </form>

              {/* Order Summary Sticky Column */}
              <div ref={summaryRef} className={styles.summaryCol}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryHeader}>
                    <h2 className={styles.summaryTitle}>ORDER SUMMARY</h2>
                    <span className={styles.itemsCountBadge}>
                      [{items.reduce((acc, i) => acc + i.quantity, 0)} PIECES]
                    </span>
                  </div>

                  {/* Items List */}
                  <div className={styles.summaryItemsList}>
                    {items.map((item) => (
                      <div key={item.id} className={styles.summaryItem}>
                        <div className={styles.itemThumbFrame}>
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="60px"
                            className={styles.itemThumb}
                          />
                        </div>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{item.product.name}</span>
                          <span className={styles.itemSizeTag}>
                            SIZE: <span className={styles.itemSizeHighlight}>{item.size}</span>
                          </span>
                        </div>
                        <div className={styles.itemPriceQty}>
                          <span className={styles.itemLineTotal}>
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <span className={styles.itemQtyMultiply}>
                            QTY: {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className={styles.pricingTable}>
                    <div className={styles.pricingRow}>
                      <span>SUBTOTAL</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className={styles.pricingRow}>
                      <span>SHIPPING</span>
                      <span className={styles.freeShippingTag}>COMPLIMENTARY</span>
                    </div>

                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>TOTAL</span>
                      <span className={styles.totalAmount}>{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  <div className={styles.securityNote}>
                    <Truck size={14} style={{ color: "var(--accent-red)" }} />
                    <span>DELIVERY WITHIN 2-4 DAYS NATIONWIDE</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

