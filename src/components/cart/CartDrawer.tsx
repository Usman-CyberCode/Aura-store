"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "./CartProvider";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    formatPrice,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC key and prevent body scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const handleContinueShopping = () => {
    closeCart();
    const shopEl = document.getElementById("shop");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    } else if (typeof window !== "undefined") {
      window.location.href = "/#shop";
    }
  };

  return (
    <>
      {/* Dimmed Blurred Backdrop */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />

      {/* Slide-in Drawer */}
      <aside
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        aria-label="Shopping Cart Drawer"
        aria-hidden={!isOpen}
        role="dialog"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <h2 className={styles.title}>YOUR CART</h2>
            <span className={styles.itemCountBadge}>
              [{totalItems} {totalItems === 1 ? "PIECE" : "PIECES"}]
            </span>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconFrame}>
              <ShoppingBag size={28} />
            </div>
            <h3 className={styles.emptyTitle}>YOUR CART IS EMPTY</h3>
            <p className={styles.emptySubtitle}>
              Explore our current collection and acquire essential contemporary streetwear pieces.
            </p>
            <button
              type="button"
              className={styles.emptyButton}
              onClick={handleContinueShopping}
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className={styles.body}>
            {items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                {/* Thumbnail */}
                <div className={styles.itemImageFrame}>
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="84px"
                    className={styles.itemImage}
                  />
                </div>

                {/* Info */}
                <div className={styles.itemInfo}>
                  <h4 className={styles.itemName}>{item.product.name}</h4>
                  <div className={styles.itemMeta}>
                    <span>SIZE: <span className={styles.sizeBadge}>{item.size}</span></span>
                    <span>•</span>
                    <span>{item.product.color}</span>
                  </div>
                  <div className={styles.itemPrice}>
                    {formatPrice(item.product.price)}
                  </div>

                  {/* Quantity Control */}
                  <div className={styles.quantityControl}>
                    <button
                      type="button"
                      className={styles.qtyButton}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className={styles.qtyNumber}>{item.quantity}</span>
                    <button
                      type="button"
                      className={styles.qtyButton}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.shippingNote}>
              <span className={styles.shippingDot} />
              <span>COMPLIMENTARY NATIONWIDE SHIPPING</span>
            </div>

            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>SUBTOTAL</span>
              <span className={styles.subtotalAmount}>{formatPrice(subtotal)}</span>
            </div>

            <Link
              href="/checkout"
              className={styles.checkoutButton}
              onClick={closeCart}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ShieldCheck size={16} />
            </Link>

            <button
              type="button"
              className={styles.continueShoppingLink}
              onClick={handleContinueShopping}
            >
              CONTINUE BROWSING
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

