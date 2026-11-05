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
  secondaryImage: string;
  secondaryAlt: string;
  secondaryTag: string;
}

const CHAPTERS: LookbookChapter[] = [
  {
    id: "noir-edit",
    number: "01",
    tabLabel: "01 NOIR EDIT",
    heading: "01 — THE NOIR EDIT",
    description:
      "Architectural volume and subterranean silhouettes. Heavyweight drop-shoulder silhouettes engineered for cold concrete environments and unapologetic presence.",
    location: "PARIS / 11TH ARRONDISSEMENT",
    palette: "OBSIDIAN / GRAPHITE / CHARCOAL",
    code: "LB-26-01 // NOIR",
    primaryImage: "/images/Black masked hoodie model.png",
    primaryAlt: "AURA Noir Edit black masked hoodie",
    primaryTag: "LOOK 01 // OVERSIZED HOODIE",
    secondaryImage: "/images/Black puffer jacket model.png",
    secondaryAlt: "AURA Tactical puffer silhouette",
    secondaryTag: "LOOK 02 // TACTICAL PUFFER",
  },
  {
    id: "after-dark",
    number: "02",
    tabLabel: "02 AFTER DARK",
    heading: "02 — AFTER DARK",
    description:
      "Nocturnal luminescence colliding with high-density streetwear defiance. Designed for nocturnal transit, underground frequencies, and sharp metropolitan focus.",
    location: "SHIBUYA DISTRICT / TOKYO",
    palette: "PITCH BLACK / CRIMSON LUMEN",
    code: "LB-26-02 // LUMEN",
    primaryImage: "/images/AURA Store neon model.png",
    primaryAlt: "AURA Store neon model campaign",
    primaryTag: "LOOK 03 // STORE NOCTURNE",
    secondaryImage: "/images/Full-body masked model.png",
    secondaryAlt: "AURA Full-body masked silhouette",
    secondaryTag: "LOOK 04 // FULL-BODY ARMOR",
  },
  {
    id: "street-culture",
    number: "03",
    tabLabel: "03 STREET CULTURE",
    heading: "03 — STREET CULTURE",
    description:
      "Drop-shoulder minimalist tailoring meets uncompromised ease. Pure geometric proportion and tactile jersey cuts for everyday contemporary identity.",
    location: "LOWER EAST SIDE / NYC",
    palette: "SLATE GREY / WARM ALABASTER",
    code: "LB-26-03 // ESSENTIAL",
    primaryImage: "/images/Grey T-shirt model.png",
    primaryAlt: "AURA Grey oversized streetwear t-shirt model",
    primaryTag: "LOOK 05 // SLATE OVERSIZED",
    secondaryImage: "/images/Beige T-shirt model.png",
    secondaryAlt: "AURA Alabaster oversized essential t-shirt model",
    secondaryTag: "LOOK 06 // ALABASTER ESSENTIAL",
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

      if (prefersReducedMotion || isMobile) {
        // Natural stacked layout for mobile / reduced motion
        const primaryFrames = gsap.utils.toArray<HTMLElement>(
          ".lb-primary-frame",
          sectionRef.current
        );
        const secondaryFrames = gsap.utils.toArray<HTMLElement>(
          ".lb-secondary-frame",
          sectionRef.current
        );
        [...primaryFrames, ...secondaryFrames].forEach((frame) => {
          gsap.set(frame, { clipPath: "none" });
        });
        return;
      }

      const totalChapters = CHAPTERS.length;
      const getScrollDistance = () =>
        trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 2400;

      // Master Horizontal Scroll Timeline with Pinning (duration: 3 units)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const currentIdx = Math.min(
              totalChapters - 1,
              Math.floor(self.progress * totalChapters)
            );
            setActiveChapter((prev) => (prev !== currentIdx ? currentIdx : prev));

            if (progressLineRef.current) {
              progressLineRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // 1. Horizontal movement of the track (total timeline duration: 3)
      tl.to(
        trackRef.current,
        {
          x: () => -getScrollDistance(),
          ease: "none",
          duration: 3,
        },
        0
      );

      // 2. Clip-path reveals for chapters 2 and 3 properly paced across 3 units
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
      const inners = gsap.utils.toArray<HTMLElement>(
        ".lb-parallax-inner",
        sectionRef.current
      );

      // Chapter 1 is initially visible
      if (primaryFrames[0]) {
        gsap.set(primaryFrames[0], { clipPath: "inset(0% 0% 0% 0%)" });
      }

      // Chapter 2 reveals (at time 0.9 to 1.7)
      if (primaryFrames[1]) {
        tl.fromTo(
          primaryFrames[1],
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.7 },
          0.9
        );
      }
      if (secondaryFrames[1]) {
        tl.fromTo(
          secondaryFrames[1],
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.7 },
          1.0
        );
      }
      if (headings[1]) {
        tl.fromTo(
          headings[1],
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.6 },
          1.0
        );
      }
      if (descs[1]) {
        tl.fromTo(
          descs[1],
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.6 },
          1.1
        );
      }

      // Chapter 3 reveals (at time 1.9 to 2.7)
      if (primaryFrames[2]) {
        tl.fromTo(
          primaryFrames[2],
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.7 },
          1.9
        );
      }
      if (secondaryFrames[2]) {
        tl.fromTo(
          secondaryFrames[2],
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.7 },
          2.0
        );
      }
      if (headings[2]) {
        tl.fromTo(
          headings[2],
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.6 },
          2.0
        );
      }
      if (descs[2]) {
        tl.fromTo(
          descs[2],
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.6 },
          2.1
        );
      }

      // Inner image subtle parallax shift
      inners.forEach((inner, i) => {
        tl.fromTo(
          inner,
          { xPercent: 10, scale: 1.04 },
          { xPercent: -10, scale: 1, ease: "none", duration: 1 },
          i * 1.0
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

      {/* Pinned Section Editorial Header */}
      <header className={styles.fixedHeader}>
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

      {/* Horizontal Chapters Track */}
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
                <span className={styles.chapterNumber}>CHAPTER // {chapter.number}</span>
                <h3 className={`${styles.chapterHeading} lb-heading`}>
                  {chapter.heading}
                </h3>
                <p className={`${styles.chapterDesc} lb-desc`}>
                  {chapter.description}
                </p>

                <div className={styles.chapterSpecs}>
                  <div className={styles.specRow}>
                    <span>LOCATION</span>
                    <span className={styles.specValue}>{chapter.location}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span>PALETTE</span>
                    <span className={styles.specValue}>{chapter.palette}</span>
                  </div>
                  <div className={styles.specRow}>
                    <span>SPECIFICATION</span>
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
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Progress & Chapter Navigation Bar */}
      <div className={styles.progressControls} aria-hidden="true">
        <div className={styles.chapterTracker}>
          {CHAPTERS.map((ch, idx) => (
            <span
              key={ch.id}
              className={`${styles.chapterTab} ${
                activeChapter === idx ? styles.chapterTabActive : ""
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

