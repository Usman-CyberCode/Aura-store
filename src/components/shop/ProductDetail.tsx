"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Product } from "@/types/product";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./ProductDetail.module.css";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart, formatPrice } = useCart();

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.length === 1 ? product.sizes[0] : ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const containerRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  // Reset state when navigating to another product
  useEffect(() => {
    setActiveImage(product.image);
    setSelectedSize(product.sizes.length === 1 ? product.sizes[0] : "");
    setQuantity(1);
    setSizeError(false);
    setIsAdded(false);
  }, [product.slug, product.image, product.sizes]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    addToCart(product, selectedSize || "ONE SIZE", quantity);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    if (sizeError) setSizeError(false);
  };

  // GSAP Animations
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!containerRef.current || prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Gallery entrance
      if (galleryRef.current) {
        tl.fromTo(
          galleryRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 1 },
          0.1
        );
      }

      // Details stagger entrance
      if (detailsRef.current) {
        tl.fromTo(
          detailsRef.current.children,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          0.2
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className={styles.productDetailSection}>
      {/* Cinematic Lighting Atmosphere */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.charcoalBackdrop} />
        <div className={styles.subtleRedAccent} />
      </div>

      <div className={styles.container}>
        {/* Navigation Breadcrumbs & Back Link */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>
            HOME
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href="/#shop" className={styles.breadcrumbLink}>
            COLLECTION
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <Link href="/#shop" className={styles.backLink}>
          <ArrowLeft size={14} />
          <span>BACK TO CURATED DROPS</span>
        </Link>

        {/* Product Layout Grid */}
        <div className={styles.layoutGrid}>
          {/* Gallery Column */}
          <div ref={galleryRef} className={styles.galleryCol}>
            <div className={styles.mainImageFrame}>
              {product.badge && (
                <span className={styles.badge}>{product.badge}</span>
              )}
              <span className={styles.imageFrameTag}>
                {product.category.toUpperCase()} // FW26
              </span>
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={styles.mainImage}
              />
            </div>

            {/* Thumbnail Navigation (if gallery has items) */}
            {galleryImages.length > 1 && (
              <div className={styles.thumbnailStrip} role="tablist" aria-label="Product image thumbnails">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    className={`${styles.thumbnailBtn} ${
                      activeImage === img ? styles.thumbnailActive : ""
                    }`}
                    onClick={() => setActiveImage(img)}
                    role="tab"
                    aria-selected={activeImage === img}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} perspective ${idx + 1}`}
                      fill
                      sizes="80px"
                      className={styles.thumbImg}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Column */}
          <div ref={detailsRef} className={styles.detailsCol}>
            <div className={styles.headerInfo}>
              <div className={styles.categoryLabel}>
                <span className={styles.categoryDot} />
                <span>FW26 DROP // {product.category.toUpperCase()}</span>
              </div>

              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.productTagline}>{product.tagline}</p>
            </div>

            {/* Price & Status */}
            <div className={styles.priceBlock}>
              <div className={styles.price}>
                <span className={styles.currency}>PKR</span>
                {product.price.toLocaleString()}
              </div>
              <div className={styles.stockStatus}>
                <span className={styles.stockDot} />
                <span>IN STOCK // LIMITED PRODUCTION</span>
              </div>
            </div>

            {/* Editorial Description */}
            <p className={styles.description}>{product.description}</p>

            {/* Specifications Details */}
            <div className={styles.specList}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>COLORWAY</span>
                <span className={styles.specVal}>{product.color}</span>
              </div>
              {product.material && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>MATERIAL</span>
                  <span className={styles.specVal}>{product.material}</span>
                </div>
              )}
              {product.cut && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>CUT &amp; SILHOUETTE</span>
                  <span className={styles.specVal}>{product.cut}</span>
                </div>
              )}
              {product.care && (
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>CARE GUIDELINES</span>
                  <span className={styles.specVal}>{product.care}</span>
                </div>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className={styles.sizeArea}>
                <div className={styles.sizeHeader}>
                  <span className={styles.sizeHeading}>SELECT SIZE</span>
                  <span className={styles.selectedSizeText}>
                    {selectedSize ? `CHOSEN: ${selectedSize}` : "REQUIRED"}
                  </span>
                </div>

                <div className={styles.sizePills} role="radiogroup" aria-label="Available sizes">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.sizeBtn} ${
                        selectedSize === size ? styles.sizeBtnActive : ""
                      }`}
                      onClick={() => handleSizeClick(size)}
                      role="radio"
                      aria-checked={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {sizeError && (
                  <p className={styles.sizeErrorMsg} role="alert">
                    Please select a size to acquire this piece.
                  </p>
                )}
              </div>
            )}

            {/* Quantity and Add to Cart Button */}
            <div className={styles.purchaseControls}>
              <div className={styles.quantityBox} aria-label="Select quantity">
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity((prev) => prev + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                className={`${styles.addToCartBtn} ${
                  isAdded ? styles.addToCartAdded : ""
                }`}
                onClick={handleAddToCart}
                aria-label={`Add ${quantity} ${product.name} to cart`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO CART</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>ACQUIRE PIECE — {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Service & Authenticity Guarantees */}
            <div className={styles.guarantees}>
              <div className={styles.guaranteeItem}>
                <Truck size={14} className={styles.guaranteeIcon} />
                <span>COMPLIMENTARY EXPRESS DELIVERY</span>
              </div>
              <div className={styles.guaranteeItem}>
                <ShieldCheck size={14} className={styles.guaranteeIcon} />
                <span>GENUINE AURA AUTHENTICITY TAG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

