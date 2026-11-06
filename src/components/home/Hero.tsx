"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const modelImageRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleAuraRef = useRef<HTMLSpanElement>(null);
  const titleStoreRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const bottomTagRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            modelImageRef.current,
            watermarkRef.current,
            labelRef.current,
            titleAuraRef.current,
            titleStoreRef.current,
            taglineRef.current,
            ctaRef.current,
            indicatorsRef.current,
            scrollIndicatorRef.current,
            bottomTagRef.current,
          ],
          { opacity: 1, y: 0, x: 0, scale: 1 }
        );
        return;
      }

      // Initial Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Smooth initial image reveal & subtle background image scale
      tl.fromTo(
        modelImageRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" },
        0
      );

      // Subtle background watermark reveal
      tl.fromTo(
        watermarkRef.current,
        { opacity: 0, x: -30 },
        { opacity: 0, x: 0, duration: 1.6, ease: "power3.out" },
        0.2
      );

      // 2. Typography staggered entrance
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.3
      );

      tl.fromTo(
        titleAuraRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
        0.45
      );

      tl.fromTo(
        titleStoreRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
        0.58
      );

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.75
      );

      // 3. CTA entrance after headline
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.95
      );

      // 4. Campaign indicators animate subtly
      if (indicatorsRef.current) {
        tl.fromTo(
          indicatorsRef.current.children,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" },
          1.1
        );
      }

      // 5. Scroll indicator & bottom right tag entrance
      tl.fromTo(
        [scrollIndicatorRef.current, bottomTagRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.9 },
        1.25
      );

      // Subtle exit parallax on scroll
      if (modelImageRef.current && containerRef.current) {
        gsap.to(modelImageRef.current, {
          yPercent: 2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef }
  );

  const scrollToShop = () => {
    const shopSection = document.getElementById("shop");
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  const scrollToNext = () => {
    const nextSection = document.getElementById("story") || document.getElementById("shop");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section ref={containerRef} className={styles.hero} id="hero">
      {/* 1. Dominant Background Image Layer */}
      <div ref={modelImageRef} className={styles.imageBackground} aria-hidden="true">
        <Image
          src="/images/hero-aura.jpg"
          alt="AURA STORE Luxury Streetwear Campaign"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        {/* Seamless Dark Gradient Overlays */}
        <div className={styles.gradientOverlay} />
      </div>

      {/* 2. Large Subtle Background AURA Typographic Watermark */}
      <div ref={watermarkRef} className={styles.bgWatermark} aria-hidden="true">
        <span>AURA</span>
      </div>

      {/* 3. Main Editorial Content Container (Left-Aligned) */}
      <div className={styles.contentContainer}>
        <div className={styles.textContent}>
          {/* Small Label: PREMIUM STREETWEAR */}
          <div ref={labelRef} className={styles.labelBadge}>
            <span className={styles.badgeLine} />
            <span>PREMIUM STREETWEAR</span>
          </div>

          {/* Huge Headline: AURA (white) STORE (crimson red) */}
          <h1 className={styles.mainTitle} aria-label="AURA STORE">
            <span ref={titleAuraRef} className={styles.titleLineAura}>
              AURA
            </span>
            <span ref={titleStoreRef} className={styles.titleLineStore}>
              STORE
            </span>
          </h1>

          {/* Tagline: WEAR THE VISION. */}
          <p ref={taglineRef} className={styles.tagline}>
            WEAR THE VISION.
          </p>

          {/* CTA: EXPLORE COLLECTION */}
          <div ref={ctaRef} className={styles.ctaWrapper}>
            <button
              type="button"
              onClick={scrollToShop}
              className={styles.exploreBtn}
              aria-label="Explore Collection"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={14} className={styles.btnArrow} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Right Side Minimal 01 / 02 / 03 Campaign Indicators */}
      <div ref={indicatorsRef} className={styles.campaignIndicators} aria-hidden="true">
        <div className={`${styles.indicatorItem} ${styles.indicatorActive}`}>
          <span className={styles.indicatorNum}>01</span>
          <span className={styles.indicatorLine} />
          <span className={styles.indicatorLabel}>FW26 GENESIS</span>
        </div>
        <div className={styles.indicatorItem}>
          <span className={styles.indicatorNum}>02</span>
          <span className={styles.indicatorLine} />
          <span className={styles.indicatorLabel}>AFTER DARK</span>
        </div>
        <div className={styles.indicatorItem}>
          <span className={styles.indicatorNum}>03</span>
          <span className={styles.indicatorLine} />
          <span className={styles.indicatorLabel}>STREET CULTURE</span>
        </div>
      </div>

      {/* 5. Bottom Left Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className={styles.scrollIndicator}
        onClick={scrollToNext}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToNext()}
        aria-label="Scroll to explore"
      >
        <div className={styles.scrollLineTrack}>
          <div className={styles.scrollLineThumb} />
        </div>
        <span className={styles.scrollText}>SCROLL</span>
      </div>

      {/* 6. Bottom Right Tag: MORE THAN FASHION. */}
      <div ref={bottomTagRef} className={styles.bottomRightTag} aria-hidden="true">
        <span className={styles.tagDot} />
        <span>MORE THAN FASHION.</span>
      </div>
    </section>
  );
}
