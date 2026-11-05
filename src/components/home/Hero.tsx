"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const modelImageRef = useRef<HTMLDivElement>(null);
  const subBrandRef = useRef<HTMLDivElement>(null);
  const brandTitleRef = useRef<HTMLHeadingElement>(null);
  const editionTagRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            modelImageRef.current,
            subBrandRef.current,
            brandTitleRef.current,
            editionTagRef.current,
            ctaRef.current,
            scrollIndicatorRef.current,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // Initial Entrance Timeline (Page load cinematic reveal, no scrub)
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Initial hero image subtle scale animation
      tl.fromTo(
        modelImageRef.current,
        { scale: 1.08, opacity: 10 },
        { scale: 1, opacity: 10, duration: 1.8, ease: "power2.out" },
        0
      );

      // 2. Huge centered typography reveal with smooth opacity + translateY
      tl.fromTo(
        brandTitleRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        0.35
      );

      // 3. Small supporting text appears after headline
      tl.fromTo(
        [subBrandRef.current, editionTagRef.current],
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
        0.65
      );

      // 4. CTA appears last
      tl.fromTo(
        ctaRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.9
      );

      // 5. Scroll indicator subtle entrance
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 0.75, duration: 1 },
        1.15
      );

      // Subtle scroll parallax exit as user begins scrolling down
      if (modelImageRef.current && containerRef.current) {
        gsap.to(modelImageRef.current, {
          yPercent: 12,
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
      {/* 1. Dominant Centered Fashion Model Visual */}
      <div ref={modelImageRef} className={styles.modelContainer} aria-hidden="true">
        <Image
          src="/images/Black masked hoodie model.png"
          alt="AURA Haute Couture Campaign Model"
          fill
          priority
          sizes="100vw"
          className={styles.modelImage}
        />
        {/* Subtle Blue-Gray Cinematic Vignette and Soft Gradients */}
        <div className={styles.cinematicOverlay} />
      </div>

      {/* 2. Editorial Typography & CTA Layer */}
      <div className={styles.editorialContent}>
        {/* Supporting Sub-Brand Tag */}
        <div ref={subBrandRef} className={styles.subBrand}>
          <span>AURA X1</span>
        </div>

        {/* Huge Bold Centered Headline Over Model */}
        <h1 ref={brandTitleRef} className={styles.brandTitle} aria-label="AURA">
          AURA
        </h1>

        {/* Supporting Edition Detail */}
        <p ref={editionTagRef} className={styles.editionTag}>
          FIRST EDITION — PRODUCTION CLOSED
        </p>

        {/* Minimal Centered Outlined Button */}
        <div ref={ctaRef} className={styles.ctaWrapper}>
          <button
            type="button"
            onClick={scrollToNext}
            className={styles.discoverBtn}
            aria-label="Discover AURA collection"
          >
            <span>DISCOVER</span>
          </button>
        </div>
      </div>

      {/* 3. Small Downward Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className={styles.scrollIndicator}
        onClick={scrollToNext}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToNext()}
        aria-label="Scroll to discover"
      >
        <ChevronDown size={14} className={styles.scrollChevron} />
      </div>
    </section>
  );
}
