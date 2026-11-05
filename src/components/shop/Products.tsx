"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FEATURED_PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./Products.module.css";

const CATEGORIES = [
  { label: "ALL PIECES", value: "all" },
  { label: "HOODIES", value: "hoodies" },
  { label: "OUTERWEAR", value: "jackets" },
  { label: "FOOTWEAR", value: "footwear" },
  { label: "ESSENTIAL TEES", value: "tees" },
];

export default function Products() {
  const { addToCart, formatPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "aura-premium-black-hoodie": "L",
    "aura-back-print-hoodie": "L",
    "aura-black-puffer-jacket": "M",
    "aura-red-black-sneaker": "42",
    "aura-grey-oversized-tee": "L",
    "aura-beige-oversized-tee": "L",
  });
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter products by active category
  const filteredProducts =
    selectedCategory === "all"
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === selectedCategory);

  // Handle Size Selection
  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  // Handle Add to Cart
  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0];
    addToCart(product, size, 1);

    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  // GSAP ScrollTrigger Entrance
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion || !gridRef.current) return;

      gsap.fromTo(
        gridRef.current.children,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef, dependencies: [selectedCategory] }
  );

  return (
    <section ref={containerRef} className={styles.productsSection} id="shop">
      <div className={styles.ambientLighting} aria-hidden="true" />

      <div className={styles.container}>
        {/* Editorial Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            <span>COLLECTION 01 // AUTUMN-WINTER</span>
          </div>

          <h2 className={styles.title}>CURATED DROPS.</h2>
          <p className={styles.subtitle}>
            Architectural silhouettes, heavyweight custom fabrics, and limited production runs crafted for timeless streetwear presence.
          </p>

          {/* Category Filter Pills */}
          <div className={styles.filterBar} role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`${styles.filterButton} ${
                  selectedCategory === cat.value ? styles.filterButtonActive : ""
                }`}
                onClick={() => setSelectedCategory(cat.value)}
                role="tab"
                aria-selected={selectedCategory === cat.value}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div ref={gridRef} className={styles.grid}>
          {filteredProducts.map((product) => {
            const currentSize =
              selectedSizes[product.id] || product.sizes[0];
            const isAdded = addedProductId === product.id;

            return (
              <article key={product.id} className={styles.card}>
                {/* Product Image Frame */}
                <Link
                  href={`/products/${product.slug}`}
                  className={styles.imageWrapper}
                  aria-label={`View details for ${product.name}`}
                >
                  {product.badge && (
                    <span className={styles.badge}>{product.badge}</span>
                  )}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 33vw"
                    className={styles.productImage}
                  />
                </Link>

                {/* Product Details */}
                <div className={styles.cardContent}>
                  <div className={styles.productMeta}>
                    <span className={styles.productTagline}>{product.tagline}</span>
                    <h3 className={styles.productName}>
                      <Link
                        href={`/products/${product.slug}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {product.name}
                      </Link>
                    </h3>
                  </div>

                  <div className={styles.priceRow}>
                    <div className={styles.price}>
                      <span className={styles.currency}>PKR</span>
                      {product.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className={styles.sizeSelector}>
                    <div className={styles.sizeLabel}>
                      <span>SELECT SIZE</span>
                      <span>{currentSize}</span>
                    </div>
                    <div className={styles.sizePills}>
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`${styles.sizePill} ${
                            currentSize === size ? styles.sizePillActive : ""
                          }`}
                          onClick={() => handleSizeSelect(product.id, size)}
                          aria-label={`Select size ${size}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    className={`${styles.addButton} ${
                      isAdded ? styles.addButtonAdded : ""
                    }`}
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.name} size ${currentSize} to cart`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} />
                        <span>ADDED TO CART</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>ACQUIRE PIECE</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

