"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
  { label: "SHOP", href: "/#shop" },
  { label: "STORY", href: "/#story" },
  { label: "LOOKBOOK", href: "/#lookbook" },
  { label: "ABOUT", href: "/#about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const { totalItems, openCart } = useCart();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useGSAP(
    () => {
      // Navbar scroll trigger to activate backdrop blur & border
      const trigger = ScrollTrigger.create({
        start: "top -40px",
        onToggle: (self) => {
          setIsScrolled(self.isActive);
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: headerRef }
  );

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.navContainer}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logoWrapper} aria-label="AURA STORE Home">
          <span className={styles.logoText}>
            AURA STORE
            <span className={styles.logoDot} />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.navLinks} aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Cart & Mobile Toggle) */}
        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.cartButton}
            onClick={openCart}
            aria-label={`Shopping Cart with ${totalItems} items`}
          >
            <ShoppingBag size={15} />
            <span>CART</span>
            <span className={styles.cartCount}>{totalItems}</span>
          </button>

          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenu} ${
          mobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <nav className={styles.mobileNavList} aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className={styles.mobileNavLink}
            style={{ textAlign: "left", display: "flex", alignItems: "center", gap: "12px", color: "var(--accent-red)" }}
            onClick={() => {
              setMobileMenuOpen(false);
              openCart();
            }}
          >
            <span>VIEW CART ({totalItems})</span>
            <ShoppingBag size={20} />
          </button>
        </nav>
        <div className={styles.mobileMeta}>
          <span>AURA STORE // FW26</span>
          <span>HAUTE COUTURE</span>
        </div>
      </div>
    </header>
  );
}
