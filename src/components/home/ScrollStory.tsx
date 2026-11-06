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
    tagline: "ARCHITECTURAL FIT",
    headline: "01 — BUILT DIFFERENT.",
    description:
      "Crafted from 520 GSM heavyweight French terry and custom-milled waterproof tech membranes. Engineered for cold streets, structural posture, and unapologetic presence.",
    image: "/images/Sitting black hoodie model.jpg",
    imageAlt: "AURA black hoodie sitting fashion model",
    detailLabel1: "SPECIFICATION",
    detailValue1: "520 GSM TERRY",
    detailLabel2: "SILHOUETTE",
    detailValue2: "SCULPTED OVERSIZED",
    frameCode: "NOIR // 01",
    reverse: false,
  },
  {
    id: "slide-02",
    number: "02",
    tagline: "ATELIER CRAFTSMANSHIP",
    headline: "02 — NO COMPROMISE.",
    description:
      "No mass production. Zero shortcuts. Every seam is reinforced with ergonomic double-needle binding and precision tactile graphics, defining modern armor for the street.",
    image: "/images/Grey T-shirt model.jpg",
    imageAlt: "Grey T-shirt model",
    detailLabel1: "PRODUCTION",
    detailValue1: "LIMITED BATCH 250",
    detailLabel2: "HARDWARE",
    detailValue2: "MATTE GRAPHITE",
    frameCode: "NOIR // 02",
    reverse: true,
  },
  {
    id: "slide-03",
    number: "03",
    tagline: "HAUTE STREETWEAR",
    headline: "03 — DEFINE YOUR AURA.",
    description:
      "Step beyond conformity into nocturnal sophistication. A distinct visual statement engineered for individuals who command respect without saying a single word.",
    image: "/images/AURA Store neon model.jpg",
    imageAlt: "AURA Store neon fashion model editorial",
    detailLabel1: "ORIGIN",
    detailValue1: "PARIS // TOKYO",
    detailLabel2: "SERIES",
    detailValue2: "GENESIS DROP",
    frameCode: "NOIR // 03",
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
      const isMobile = window.innerWidth <= 768;

      if (!sectionRef.current || !trackRef.current) return;

      const frames = gsap.utils.toArray<HTMLElement>(
        ".reveal-frame",
        sectionRef.current
      );
      const inners = gsap.utils.toArray<HTMLElement>(
        ".parallax-inner",
        sectionRef.current
      );
      const headlines = gsap.utils.toArray<HTMLElement>(
        ".reveal-headline",
        sectionRef.current
      );
      const descriptions = gsap.utils.toArray<HTMLElement>(
        ".reveal-desc",
        sectionRef.current
      );
      const details = gsap.utils.toArray<HTMLElement>(
        ".reveal-details",
        sectionRef.current
      );

      if (prefersReducedMotion || isMobile) {
        // Natural stacked layout for mobile / reduced motion
        frames.forEach((frame) => {
          gsap.set(frame, { clipPath: "none" });
        });
        headlines.forEach((h) => {
          gsap.set(h, { opacity: 1, y: 0 });
        });
        descriptions.forEach((d) => {
          gsap.set(d, { opacity: 1, y: 0 });
        });
        details.forEach((det) => {
          gsap.set(det, { opacity: 1, y: 0 });
        });
        return;
      }

      const totalSlides = STORY_SLIDES.length;
      const getScrollDistance = () =>
        trackRef.current
          ? trackRef.current.scrollWidth - window.innerWidth
          : window.innerWidth * (totalSlides - 1);

      // Set initial states for incoming slides so headings and frames are never partially visible
      if (frames[0]) {
        gsap.set(frames[0], { clipPath: "inset(0% 0% 0% 0%)" });
      }
      if (headlines[0]) {
        gsap.set(headlines[0], { opacity: 1, y: 0 });
      }
      if (descriptions[0]) {
        gsap.set(descriptions[0], { opacity: 1, y: 0 });
      }

      // Slide 2 hidden initially
      if (frames[1]) gsap.set(frames[1], { clipPath: "inset(0% 100% 0% 0%)" });
      if (headlines[1]) gsap.set(headlines[1], { opacity: 0, y: 40 });
      if (descriptions[1]) gsap.set(descriptions[1], { opacity: 0, y: 25 });
      if (details[1]) gsap.set(details[1], { opacity: 0, y: 15 });

      // Slide 3 hidden initially
      if (frames[2]) gsap.set(frames[2], { clipPath: "inset(0% 100% 0% 0%)" });
      if (headlines[2]) gsap.set(headlines[2], { opacity: 0, y: 40 });
      if (descriptions[2]) gsap.set(descriptions[2], { opacity: 0, y: 25 });
      if (details[2]) gsap.set(details[2], { opacity: 0, y: 15 });

      // Master Timeline: 10 units total
      // Phase 1 (0.0 -> 1.5): Slide 1 hold
      // Phase 2 (1.5 -> 4.5): Slide 1 -> Slide 2 transition & synchronized reveal
      // Phase 3 (4.5 -> 5.5): Slide 2 center hold
      // Phase 4 (5.5 -> 8.5): Slide 2 -> Slide 3 transition & synchronized reveal
      // Phase 5 (8.5 -> 10.0): Slide 3 hold buffer before clean unpin into vertical scroll
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () =>
            `+=${Math.max(window.innerHeight * 2.8, window.innerWidth * 1.8)}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const slideIndex = p < 0.35 ? 0 : p < 0.72 ? 1 : 2;
            setActiveSlideIndex((prev) =>
              prev !== slideIndex ? slideIndex : prev
            );

            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${p * 100}%`;
            }
          },
        },
      });

      // 1. Horizontal Track translations with centered rest holds
      const singleSlideDist = () => window.innerWidth;
      const fullDist = () => getScrollDistance();

      masterTl.to(
        trackRef.current,
        {
          x: () => -singleSlideDist(),
          ease: "power1.inOut",
          duration: 3.0,
        },
        1.5
      );

      masterTl.to(
        trackRef.current,
        {
          x: () => -fullDist(),
          ease: "power1.inOut",
          duration: 3.0,
        },
        5.5
      );

      // 2. Synchronized Slide 2 Reveals (exact window: 2.0 to 4.2)
      if (frames[1]) {
        masterTl.to(
          frames[1],
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.8,
            ease: "power2.inOut",
          },
          2.0
        );
      }
      if (headlines[1]) {
        masterTl.to(
          headlines[1],
          { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" },
          2.2
        );
      }
      if (descriptions[1]) {
        masterTl.to(
          descriptions[1],
          { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" },
          2.5
        );
      }
      if (details[1]) {
        masterTl.to(
          details[1],
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
          2.7
        );
      }

      // 3. Synchronized Slide 3 Reveals (exact window: 6.0 to 8.2)
      if (frames[2]) {
        masterTl.to(
          frames[2],
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.8,
            ease: "power2.inOut",
          },
          6.0
        );
      }
      if (headlines[2]) {
        masterTl.to(
          headlines[2],
          { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" },
          6.2
        );
      }
      if (descriptions[2]) {
        masterTl.to(
          descriptions[2],
          { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" },
          6.5
        );
      }
      if (details[2]) {
        masterTl.to(
          details[2],
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
          6.7
        );
      }

      // 4. Atmospheric Haze lighting transitions
      if (haze1Ref.current && haze2Ref.current && haze3Ref.current) {
        masterTl.to(
          haze1Ref.current,
          { opacity: 0.1, duration: 2.0, ease: "power1.inOut" },
          1.5
        );
        masterTl.to(
          haze2Ref.current,
          { opacity: 1, duration: 2.0, ease: "power1.inOut" },
          2.0
        );
        masterTl.to(
          haze2Ref.current,
          { opacity: 0, duration: 2.0, ease: "power1.inOut" },
          5.5
        );
        masterTl.to(
          haze3Ref.current,
          { opacity: 1, duration: 2.0, ease: "power1.inOut" },
          6.0
        );
      }

      // 5. Subtle Image Parallax on each inner model
      if (inners[0]) {
        masterTl.fromTo(
          inners[0],
          { xPercent: 6, scale: 1.04 },
          { xPercent: -6, scale: 1, ease: "none", duration: 3.5 },
          0.5
        );
      }
      if (inners[1]) {
        masterTl.fromTo(
          inners[1],
          { xPercent: 6, scale: 1.04 },
          { xPercent: -6, scale: 1, ease: "none", duration: 3.5 },
          3.0
        );
      }
      if (inners[2]) {
        masterTl.fromTo(
          inners[2],
          { xPercent: 6, scale: 1.04 },
          { xPercent: -6, scale: 1, ease: "none", duration: 3.5 },
          6.5
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.storySection} id="story">
      {/* Background Lighting Atmospheres */}
      <div
        ref={haze1Ref}
        className={`${styles.ambientHaze} ${styles.ambientHaze1}`}
      />
      <div
        ref={haze2Ref}
        className={`${styles.ambientHaze} ${styles.ambientHaze2}`}
      />
      <div
        ref={haze3Ref}
        className={`${styles.ambientHaze} ${styles.ambientHaze3}`}
      />
      <div className={styles.fineNoise} />

      {/* Horizontal Story Slides Track */}
      <div ref={trackRef} className={styles.track}>
        {STORY_SLIDES.map((slide, idx) => (
          <article
            key={slide.id}
            className={`${styles.slide} ${slide.reverse ? styles.slideReverse : ""
              }`}
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

                <div className={`${styles.slideDetails} reveal-details`}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>
                      {slide.detailLabel1}
                    </span>
                    <span className={styles.detailValue}>
                      {slide.detailValue1}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>
                      {slide.detailLabel2}
                    </span>
                    <span className={styles.detailValue}>
                      {slide.detailValue2}
                    </span>
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
                      sizes="(max-width: 968px) 90vw, 500px"
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
