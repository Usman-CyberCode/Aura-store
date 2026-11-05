"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./ScrollStory.module.css";

interface StorySlide {
  id: string;
  number: string;
  tagline: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  detailLabel1: string;
  detailValue1: string;
  detailLabel2: string;
  detailValue2: string;
  frameCode: string;
  reverse?: boolean;
}

const STORY_SLIDES: StorySlide[] = [
  {
    id: "slide-01",
    number: "01",
    tagline: "ARCHITECTURAL SILHOUETTES // THE GENESIS",
    headline: "01 — BUILT DIFFERENT.",
    description:
      "Crafted from 520 GSM heavyweight French terry and custom-milled waterproof tech membranes. Engineered for cold streets, structural posture, and unapologetic presence.",
    image: "/images/Sitting black hoodie model.png",
    imageAlt: "AURA black hoodie sitting fashion model",
    detailLabel1: "SPECIFICATION",
    detailValue1: "520 GSM TERRY",
    detailLabel2: "SILHOUETTE",
    detailValue2: "SCULPTED OVERSIZED",
    frameCode: "EDITION 01 // NOIR",
    reverse: false,
  },
  {
    id: "slide-02",
    number: "02",
    tagline: "AVANT-GARDE STREETWEAR // REBELLION",
    headline: "02 — NO COMPROMISE.",
    description:
      "No mass production. Zero shortcuts. Every seam is reinforced with ergonomic double-needle binding and precision tactile graphics, defining modern armor for the street.",
    image: "/images/AURA back-print hoodie.png",
    imageAlt: "AURA signature back-print luxury hoodie",
    detailLabel1: "PRODUCTION",
    detailValue1: "LIMITED BATCH 250",
    detailLabel2: "HARDWARE",
    detailValue2: "MATTE GRAPHITE",
    frameCode: "AUTHENTIC AURA // FW26",
    reverse: true,
  },
  {
    id: "slide-03",
    number: "03",
    tagline: "METROPOLITAN ENERGY // FUTURE COUTURE",
    headline: "03 — DEFINE YOUR AURA.",
    description:
      "Step beyond conformity into nocturnal sophistication. A distinct visual statement engineered for individuals who command respect without saying a single word.",
    image: "/images/AURA Store neon model.png",
    imageAlt: "AURA Store neon fashion model editorial",
    detailLabel1: "ORIGIN",
    detailValue1: "PARIS // TOKYO",
    detailLabel2: "SERIES",
    detailValue2: "GENESIS DROP",
    frameCode: "NOCTURNAL // DROP 01",
    reverse: false,
  },
];

export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const haze1Ref = useRef<HTMLDivElement>(null);
  const haze2Ref = useRef<HTMLDivElement>(null);
  const haze3Ref = useRef<HTMLDivElement>(null);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!sectionRef.current || !trackRef.current) return;

      if (prefersReducedMotion) {
        // Natural layout without scroll-jacking or pin
        return;
      }

      const totalSlides = STORY_SLIDES.length;
      const getScrollDistance = () =>
        trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 2000;

      // Master Scrub Timeline for horizontal movement
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Update active index based on progress
            const slideIndex = Math.min(
              totalSlides - 1,
              Math.floor(self.progress * totalSlides)
            );
            setActiveSlideIndex(slideIndex);

            // Update custom progress bar
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // 1. Move track horizontally across slides
      masterTl.to(
        trackRef.current,
        {
          x: () => -getScrollDistance(),
          ease: "none",
        },
        0
      );

      // 2. Animate atmospheric haze lighting between slides
      if (haze1Ref.current && haze2Ref.current && haze3Ref.current) {
        // Shift to crimson haze at slide 2
        masterTl.to(
          haze1Ref.current,
          { opacity: 0.2, ease: "power1.inOut" },
          0.2
        );
        masterTl.to(
          haze2Ref.current,
          { opacity: 1, ease: "power1.inOut" },
          0.3
        );

        // Shift to nocturnal neon haze at slide 3
        masterTl.to(
          haze2Ref.current,
          { opacity: 0, ease: "power1.inOut" },
          0.7
        );
        masterTl.to(
          haze3Ref.current,
          { opacity: 1, ease: "power1.inOut" },
          0.75
        );
      }

      // 3. Slide 2 & Slide 3 Clip-Path Reveals and Image Parallax
      const frames = gsap.utils.toArray<HTMLElement>(".reveal-frame");
      const inners = gsap.utils.toArray<HTMLElement>(".parallax-inner");
      const headlines = gsap.utils.toArray<HTMLElement>(".reveal-headline");
      const descriptions = gsap.utils.toArray<HTMLElement>(".reveal-desc");

      // Slide 1 elements entrance
      if (frames[0]) {
        gsap.set(frames[0], { clipPath: "inset(0% 0% 0% 0%)" });
      }

      // Slide 2 Reveal (around 30% - 60% of scrub)
      if (frames[1]) {
        masterTl.fromTo(
          frames[1],
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" },
          0.1
        );
      }
      if (headlines[1]) {
        masterTl.fromTo(
          headlines[1],
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out" },
          0.35
        );
      }
      if (descriptions[1]) {
        masterTl.fromTo(
          descriptions[1],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out" },
          0.4
        );
      }

      // Slide 3 Reveal (around 65% - 95% of scrub)
      if (frames[2]) {
        masterTl.fromTo(
          frames[2],
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" },
          0.7
        );
      }
      if (headlines[2]) {
        masterTl.fromTo(
          headlines[2],
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out" },
          0.75
        );
      }
      if (descriptions[2]) {
        masterTl.fromTo(
          descriptions[2],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out" },
          0.8
        );
      }

      // Parallax drift on all inner images
      inners.forEach((inner, i) => {
        masterTl.fromTo(
          inner,
          { xPercent: 12, scale: 1.05 },
          { xPercent: -12, scale: 1, ease: "none" },
          (i * 0.45)
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.storySection} id="story">
      {/* Background Lighting Atmospheres */}
      <div ref={haze1Ref} className={`${styles.ambientHaze} ${styles.ambientHaze1}`} />
      <div ref={haze2Ref} className={`${styles.ambientHaze} ${styles.ambientHaze2}`} />
      <div ref={haze3Ref} className={`${styles.ambientHaze} ${styles.ambientHaze3}`} />
      <div className={styles.fineNoise} />

      {/* Horizontal Story Slides Track */}
      <div ref={trackRef} className={styles.track}>
        {STORY_SLIDES.map((slide, idx) => (
          <article
            key={slide.id}
            className={`${styles.slide} ${slide.reverse ? styles.slideReverse : ""}`}
            aria-label={slide.headline}
          >
            <div className={styles.slideInner}>
              {/* Text Column */}
              <div className={styles.textContent}>
                <div className={styles.slideMeta}>
                  <span className={styles.slideNumber}>{slide.number}</span>
                  <span className={styles.slideTagline}>{slide.tagline}</span>
                </div>

                <h2 className={`${styles.slideHeadline} reveal-headline`}>
                  {slide.headline}
                </h2>

                <p className={`${styles.slideDescription} reveal-desc`}>
                  {slide.description}
                </p>

                <div className={styles.slideDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{slide.detailLabel1}</span>
                    <span className={styles.detailValue}>{slide.detailValue1}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{slide.detailLabel2}</span>
                    <span className={styles.detailValue}>{slide.detailValue2}</span>
                  </div>
                </div>
              </div>

              {/* Image Column */}
              <div className={styles.imageCol}>
                <div className={`${styles.imageFrame} reveal-frame`}>
                  <div className={styles.frameCornerMark}>+</div>
                  <div className={styles.frameStamp}>{slide.frameCode}</div>
                  <div className={`${styles.imageInner} parallax-inner`}>
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      sizes="(max-width: 768px) 90vw, 500px"
                      className={styles.campaignImage}
                      priority={idx === 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Fixed Story Progress Bar & Navigation Controls */}
      <div className={styles.storyControls} aria-hidden="true">
        <div className={styles.counterContainer}>
          <span className={styles.currentSlideNum}>0{activeSlideIndex + 1}</span>
          <span>/</span>
          <span>0{STORY_SLIDES.length}</span>
        </div>

        <div className={styles.progressTrack}>
          <div ref={progressBarRef} className={styles.progressBar} />
        </div>

        <div className={styles.paginationDots}>
          {STORY_SLIDES.map((_, i) => (
            <span
              key={`dot-${i}`}
              className={`${styles.dot} ${activeSlideIndex === i ? styles.dotActive : ""
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

