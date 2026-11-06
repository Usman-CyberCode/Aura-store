"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Lookbook.module.css";

interface LookbookChapter {
  id: string;
  number: string;
  tabLabel: string;
  heading: string;
  description: string;
  location: string;
  palette: string;
  code: string;
  primaryImage: string;
  primaryAlt: string;
  primaryTag: string;
  primaryPosition?: string;
  secondaryImage: string;
  secondaryAlt: string;
  secondaryTag: string;
  secondaryPosition?: string;
}

const CHAPTERS: LookbookChapter[] = [
  {
    id: "noir-edit",
    number: "01",
    tabLabel: "01 NOIR EDIT",
    heading: "01 — THE NOIR EDIT",
    description:
      "Architectural volume and subterranean silhouettes. Heavyweight drop-shoulder silhouettes engineered for cold concrete environments and unapologetic presence.",
    location: "PARIS // 11TH ARRONDISSEMENT",
    palette: "OBSIDIAN / GRAPHITE / CHARCOAL",
    code: "LB-26-01 // NOIR",
    primaryImage: "/images/Black masked hoodie model.jpg",
    primaryAlt: "AURA Noir Edit black masked hoodie",
    primaryTag: "LOOK 01 // OVERSIZED HOODIE",
    primaryPosition: "center 30%",
    secondaryImage: "/images/AURA Store neon model (2).jpg",
    secondaryAlt: "AURA Tactical puffer silhouette",
    secondaryTag: "LOOK 02 // TACTICAL PUFFER",
    secondaryPosition: "center 25%",
  },
  {
    id: "after-dark",
    number: "02",
    tabLabel: "02 AFTER DARK",
    heading: "02 — AFTER DARK",
    description:
      "Nocturnal luminescence colliding with high-density streetwear defiance. Designed for nocturnal transit, underground frequencies, and sharp metropolitan focus.",
    location: "SHIBUYA DISTRICT // TOKYO",
    palette: "PITCH BLACK // CRIMSON LUMEN",
    code: "LB-26-02 // LUMEN",
    primaryImage: "/images/Full-body maske.jpg",
    primaryAlt: "AURA Store neon model campaign",
    primaryTag: "LOOK 03 // STORE NOCTURNE",
    primaryPosition: "center 22%",
    secondaryImage: "/images/Full-body model.jpg",
    secondaryAlt: "AURA Full-body masked silhouette",
    secondaryTag: "LOOK 04 // FULL-BODY ARMOR",
    secondaryPosition: "center 18%",
  },
  {
    id: "street-culture",
    number: "03",
    tabLabel: "03 STREET CULTURE",
    heading: "03 — STREET CULTURE",
    description:
      "Drop-shoulder minimalist tailoring meets uncompromised ease. Pure geometric proportion and tactile jersey cuts for everyday contemporary identity.",
    location: "LOWER EAST SIDE // NYC",
    palette: "SLATE GREY // WARM ALABASTER",
    code: "LB-26-03 // ESSENTIAL",
    primaryImage: "/images/Grey T-shirt model 111.jpg",
    primaryAlt: "AURA Grey oversized streetwear t-shirt model",
    primaryTag: "LOOK 05 // SLATE OVERSIZED",
    primaryPosition: "center 20%",
    secondaryImage: "/images/Beige T-shirt model.png",
    secondaryAlt: "AURA Alabaster oversized essential t-shirt model",
    secondaryTag: "LOOK 06 // ALABASTER ESSENTIAL",
    secondaryPosition: "center 35%",
  },
];

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.innerWidth <= 768;

      if (!sectionRef.current || !trackRef.current) return;

      const primaryFrames = gsap.utils.toArray<HTMLElement>(
        ".lb-primary-frame",
        sectionRef.current
      );
      const secondaryFrames = gsap.utils.toArray<HTMLElement>(
        ".lb-secondary-frame",
        sectionRef.current
      );
      const headings = gsap.utils.toArray<HTMLElement>(
        ".lb-heading",
        sectionRef.current
      );
      const descs = gsap.utils.toArray<HTMLElement>(
        ".lb-desc",
        sectionRef.current
      );
      const specs = gsap.utils.toArray<HTMLElement>(
        ".lb-specs",
        sectionRef.current
      );
      const inners = gsap.utils.toArray<HTMLElement>(
        ".lb-parallax-inner",
        sectionRef.current
      );

      if (prefersReducedMotion || isMobile) {
        // Natural stacked layout for mobile / reduced motion
        [...primaryFrames, ...secondaryFrames].forEach((frame) => {
          gsap.set(frame, { clipPath: "none" });
        });
        headings.forEach((h) => gsap.set(h, { opacity: 1, y: 0 }));
        descs.forEach((d) => gsap.set(d, { opacity: 1, y: 0 }));
        specs.forEach((s) => gsap.set(s, { opacity: 1, y: 0 }));
        return;
      }

      const totalChapters = CHAPTERS.length;
      const getScrollDistance = () =>
        trackRef.current
          ? trackRef.current.scrollWidth - window.innerWidth
          : window.innerWidth * (totalChapters - 1);

      // Initial state: Chapter 1 visible, Chapter 2 & 3 hidden to avoid premature visibility
      if (primaryFrames[0]) gsap.set(primaryFrames[0], { clipPath: "inset(0% 0% 0% 0%)" });
      if (secondaryFrames[0]) gsap.set(secondaryFrames[0], { clipPath: "inset(0% 0% 0% 0%)" });
      if (headings[0]) gsap.set(headings[0], { opacity: 1, y: 0 });
      if (descs[0]) gsap.set(descs[0], { opacity: 1, y: 0 });
      if (specs[0]) gsap.set(specs[0], { opacity: 1, y: 0 });

      // Chapter 2 initially hidden
      if (primaryFrames[1]) gsap.set(primaryFrames[1], { clipPath: "inset(0% 100% 0% 0%)" });
      if (secondaryFrames[1]) gsap.set(secondaryFrames[1], { clipPath: "inset(100% 0% 0% 0%)" });
      if (headings[1]) gsap.set(headings[1], { opacity: 0, y: 35 });
      if (descs[1]) gsap.set(descs[1], { opacity: 0, y: 20 });
      if (specs[1]) gsap.set(specs[1], { opacity: 0, y: 15 });

      // Chapter 3 initially hidden
      if (primaryFrames[2]) gsap.set(primaryFrames[2], { clipPath: "inset(100% 0% 0% 0%)" });
      if (secondaryFrames[2]) gsap.set(secondaryFrames[2], { clipPath: "inset(0% 100% 0% 0%)" });
      if (headings[2]) gsap.set(headings[2], { opacity: 0, y: 35 });
      if (descs[2]) gsap.set(descs[2], { opacity: 0, y: 20 });
      if (specs[2]) gsap.set(specs[2], { opacity: 0, y: 15 });

      // Phased Master Horizontal Timeline (10 units duration)
      // Phase 1 (0.0 -> 1.5): Chapter 1 hold
      // Phase 2 (1.5 -> 4.5): Transition to Chapter 2 & synchronized reveal
      // Phase 3 (4.5 -> 5.5): Chapter 2 center hold ("02 — AFTER DARK" steady and balanced)
      // Phase 4 (5.5 -> 8.5): Transition to Chapter 3 & synchronized reveal
      // Phase 5 (8.5 -> 10.0): Chapter 3 exit buffer before unpinning
      const tl = gsap.timeline({
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
            const currentIdx = p < 0.35 ? 0 : p < 0.72 ? 1 : 2;
            setActiveChapter((prev) =>
              prev !== currentIdx ? currentIdx : prev
            );

            if (progressLineRef.current) {
              progressLineRef.current.style.width = `${p * 100}%`;
            }
          },
        },
      });

      // 1. Phased Horizontal Track Translations
      tl.to(
        trackRef.current,
        {
          x: () => -window.innerWidth,
          ease: "power1.inOut",
          duration: 3.0,
        },
        1.5
      );

      tl.to(
        trackRef.current,
        {
          x: () => -getScrollDistance(),
          ease: "power1.inOut",
          duration: 3.0,
        },
        5.5
      );

      // 2. Chapter 2 Synchronized Reveals (exact window: 2.0 to 4.2)
      if (primaryFrames[1]) {
        tl.to(
          primaryFrames[1],
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1.8 },
          2.0
        );
      }
      if (secondaryFrames[1]) {
        tl.to(
          secondaryFrames[1],
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1.8 },
          2.2
        );
      }
      if (headings[1]) {
        tl.to(
          headings[1],
          { y: 0, opacity: 1, ease: "power3.out", duration: 1.4 },
          2.2
        );
      }
      if (descs[1]) {
        tl.to(
          descs[1],
          { y: 0, opacity: 1, ease: "power3.out", duration: 1.4 },
          2.5
        );
      }
      if (specs[1]) {
        tl.to(
          specs[1],
          { y: 0, opacity: 1, ease: "power3.out", duration: 1.2 },
          2.7
        );
      }

      // 3. Chapter 3 Synchronized Reveals (exact window: 6.0 to 8.2)
      if (primaryFrames[2]) {
        tl.to(
          primaryFrames[2],
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1.8 },
          6.0
        );
      }
      if (secondaryFrames[2]) {
        tl.to(
          secondaryFrames[2],
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1.8 },
          6.2
        );
      }
      if (headings[2]) {
        tl.to(
          headings[2],
          { y: 0, opacity: 1, ease: "power3.out", duration: 1.4 },
          6.2
        );
      }
      if (descs[2]) {
        tl.to(
          descs[2],
          { y: 0, opacity: 1, ease: "power3.out", duration: 1.4 },
          6.5
        );
      }
      if (specs[2]) {
        tl.to(
          specs[2],
          { y: 0, opacity: 1, ease: "power3.out", duration: 1.2 },
          6.7
        );
      }

      // 4. Subtle Inner Parallax shifts across chapters
      inners.forEach((inner, i) => {
        const startT = Math.floor(i / 2) * 3.5;
        tl.fromTo(
          inner,
          { xPercent: 6, scale: 1.04 },
          { xPercent: -6, scale: 1, ease: "none", duration: 3.5 },
          startT
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.lookbookSection} id="lookbook">
      {/* Cinematic Lighting Backdrop */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.charcoalGradient} />
        <div className={styles.subtleRedAccent} />
      </div>

      {/* 1. Structural Section Editorial Header (Separated from horizontal content) */}
      <header className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.kicker}>
            <span className={styles.kickerLine} />
            <span>EDITORIAL CAMPAIGN // FW26</span>
          </div>
          <h2 className={styles.sectionTitle}>THE LOOKBOOK</h2>
        </div>
        <p className={styles.subtitle}>
          A visual language of modern street culture.
        </p>
      </header>

      {/* 2. Middle Horizontal Content Area (Cleanly dedicated slot) */}
      <div className={styles.trackArea}>
        <div ref={trackRef} className={styles.track}>
          {CHAPTERS.map((chapter) => (
            <article
              key={chapter.id}
              className={styles.chapterSlide}
              aria-label={chapter.heading}
            >
              <div className={styles.chapterInner}>
                {/* Text / Metadata Column */}
                <div className={styles.chapterTextCol}>
                  <div className={styles.chapterMeta}>
                    <span className={styles.chapterNumber}>{chapter.number}</span>
                    <span className={styles.chapterCode}>{chapter.code}</span>
                  </div>

                  <h3 className={`${styles.chapterHeading} lb-heading`}>
                    {chapter.heading}
                  </h3>
                  <p className={`${styles.chapterDesc} lb-desc`}>
                    {chapter.description}
                  </p>

                  <div className={`${styles.chapterSpecs} lb-specs`}>
                    <div className={styles.specRow}>
                      <span>LOCATION</span>
                      <span className={styles.specValue}>{chapter.location}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span>PALETTE</span>
                      <span className={styles.specValue}>{chapter.palette}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span>IDENTIFIER</span>
                      <span className={styles.specValue}>{chapter.code}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Large Editorial Image */}
                <div className={`${styles.primaryImageFrame} lb-primary-frame`}>
                  <span className={styles.frameTag}>{chapter.primaryTag}</span>
                  <span className={styles.frameCoords}>AURA LABS // 2026</span>
                  <div className={`${styles.innerParallax} lb-parallax-inner`}>
                    <Image
                      src={chapter.primaryImage}
                      alt={chapter.primaryAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 38vw"
                      className={styles.fashionImage}
                      style={{ objectPosition: chapter.primaryPosition || "center center" }}
                    />
                  </div>
                </div>

                {/* Secondary Detail Editorial Image */}
                <div className={`${styles.secondaryImageFrame} lb-secondary-frame`}>
                  <span className={styles.frameTag}>{chapter.secondaryTag}</span>
                  <span className={styles.frameCoords}>FIGURE 02</span>
                  <div className={`${styles.innerParallax} lb-parallax-inner`}>
                    <Image
                      src={chapter.secondaryImage}
                      alt={chapter.secondaryAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className={styles.fashionImage}
                      style={{ objectPosition: chapter.secondaryPosition || "center center" }}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 3. Structural Bottom Progress & Chapter Navigation Bar */}
      <div className={styles.progressControls} aria-hidden="true">
        <div className={styles.chapterTracker}>
          {CHAPTERS.map((ch, idx) => (
            <span
              key={ch.id}
              className={`${styles.chapterTab} ${activeChapter === idx ? styles.chapterTabActive : ""
                }`}
            >
              {ch.tabLabel}
            </span>
          ))}
        </div>

        <div className={styles.timelineBar}>
          <div ref={progressLineRef} className={styles.timelineProgress} />
        </div>
      </div>
    </section>
  );
}
