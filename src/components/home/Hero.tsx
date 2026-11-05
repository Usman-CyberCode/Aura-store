"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const modelWrapperRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const modelImageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect Reduced Motion preferences
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            `.${styles.editorialBadge}`,
            `.${styles.headlineWord}`,
            `.${styles.subtitle}`,
            `.${styles.ctaGroup}`,
            `.${styles.editorialCoords}`,
            `.${styles.scrollIndicator}`,
            `.${styles.modelImage}`,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // 1. Initial Timeline - Page load entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Model slow cinematic entrance & zoom
      tl.fromTo(
        modelImageRef.current,
        {
          scale: 1.15,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.8,
          ease: "power2.out",
        },
        0.1
      );

      // Editorial badge reveal
      tl.fromTo(
        `.${styles.editorialBadge}`,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.3
      );

      // Headline words stagger reveal
      tl.fromTo(
        `.${styles.headlineWord}`,
        {
          y: 60,
          opacity: 0,
          rotateX: 20,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
        },
        0.4
      );

      // Subtitle reveal
      tl.fromTo(
        `.${styles.subtitle}`,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0.75
      );

      // CTA Buttons reveal
      tl.fromTo(
        `.${styles.ctaGroup}`,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.9
      );

      // Peripheral editorial coordinates & scroll indicator
      tl.fromTo(
        [`.${styles.editorialCoords}`, `.${styles.scrollIndicator}`],
        { opacity: 0 },
        { opacity: 1, duration: 1.2 },
        1.1
      );

      // 2. Scroll Parallax Animations
      if (modelWrapperRef.current) {
        gsap.to(modelWrapperRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (textLayerRef.current) {
        gsap.to(textLayerRef.current, {
          yPercent: -12,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "80% top",
            scrub: 1,
          },
        });
      }
    },
    { scope: containerRef }
  );

  const scrollToNext = () => {
    const nextSection = document.getElementById("story") || document.getElementById("shop");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  };

  return (
    <section ref={containerRef} className={styles.hero} id="hero">
      {/* Cinematic Atmospheric Lighting */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.charcoalVignette} />
        <div className={styles.subtleRedGlow} />
        <div className={styles.ambientNoiseOverlay} />
      </div>

      {/* Model Image Layer */}
      <div ref={modelWrapperRef} className={styles.modelWrapper} aria-hidden="true">
        <div className={styles.imageFrame} ref={modelImageRef}>
          <div className={styles.modelHalo} />
          <Image
            src="/images/Black masked hoodie model.png"
            alt="AURA masked black hoodie model"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 520px"
            className={styles.modelImage}
          />
        </div>
      </div>

      {/* Typography & Call-To-Action Content */}
      <div className={styles.contentContainer}>
        <div ref={textLayerRef} className={styles.textLayer}>
          {/* Editorial Badge */}
          <div className={styles.editorialBadge}>
            <span className={styles.badgePulse} />
            <span className={styles.badgeText}>FW26 DROP 01 // NOIR SERIES</span>
          </div>

          {/* Headline */}
          <h1 className={styles.headline} aria-label="OWN YOUR AURA.">
            <span className={styles.headlineWord}>OWN</span>
            <span className={styles.headlineWord}>YOUR</span>
            <span className={styles.headlineWord}>
              AURA<span className={styles.headlinePeriod}>.</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Streetwear. Identity. Attitude.
          </p>

          {/* Actions */}
          <div className={styles.ctaGroup}>
            <Link href="#shop" className={styles.btnPrimary}>
              <span>SHOP COLLECTION</span>
              <ArrowRight size={14} />
            </Link>
            <Link href="#lookbook" className={styles.btnSecondary}>
              <span>EXPLORE LOOKBOOK</span>
              <ArrowUpRight size={14} className={styles.btnIcon} />
            </Link>
          </div>
        </div>
      </div>

      {/* Peripheral Editorial Elements */}
      <div className={styles.editorialCoords} aria-hidden="true">
        <div className={styles.editorialCoordinatesItem}>
          <span>PARIS / TOKYO / NYC</span>
        </div>
        <div className={styles.editorialCoordinatesItem}>
          <span>LIMITED EDITION 01</span>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div
        className={styles.scrollIndicator}
        onClick={scrollToNext}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToNext()}
        aria-label="Scroll to explore collection"
      >
        <span className={styles.scrollLabel}>SCROLL</span>
        <div className={styles.scrollLineContainer} aria-hidden="true">
          <div className={styles.scrollLineProgress} />
        </div>
      </div>
    </section>
  );
}

