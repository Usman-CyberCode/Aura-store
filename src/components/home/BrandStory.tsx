"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./BrandStory.module.css";

export default function BrandStory() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);
  const centerFrameRef = useRef<HTMLDivElement>(null);
  const parallaxImgRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!containerRef.current || prefersReducedMotion) {
        return;
      }

      // 1. Headline Word-by-Word ScrollTrigger Reveal
      const headlineWords = gsap.utils.toArray<HTMLElement>(".bs-word");
      gsap.fromTo(
        headlineWords,
        {
          y: 70,
          opacity: 0,
          rotateX: 25,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Animated Red Divider Line Expansion
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Supporting Text Reveal
      if (supportingRef.current) {
        gsap.fromTo(
          supportingRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: supportingRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 4. Center Image Clip-Path Expansion
      if (centerFrameRef.current) {
        gsap.fromTo(
          centerFrameRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: centerFrameRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 5. Scroll-Driven Center Image Parallax
      if (parallaxImgRef.current && centerFrameRef.current) {
        gsap.to(parallaxImgRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: centerFrameRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // 6. Staggered Story Blocks Reveal
      const storyBlocks = gsap.utils.toArray<HTMLElement>(".bs-story-block");
      gsap.fromTo(
        storyBlocks,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: blocksRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className={styles.brandStorySection} id="about">
      {/* Cinematic Lighting Background */}
      <div className={styles.ambientAtmosphere} aria-hidden="true">
        <div className={styles.charcoalVignette} />
        <div className={styles.subtleRedGlow} />
      </div>

      <div className={styles.container}>
        {/* Header Block */}
        <header className={styles.headerBlock}>
          <div className={styles.kickerRow}>
            <span className={styles.kickerTag}>MANIFESTO // 001</span>
            <span className={styles.kickerLine} />
            <span className={styles.kickerTag}>THE AURA HOUSE</span>
          </div>

          <h2 ref={headlineRef} className={styles.headline} aria-label="WE DON'T FOLLOW. WE DEFINE.">
            <span className={styles.headlineLine}>
              <span className="bs-word">WE</span>{" "}
              <span className="bs-word">DON&apos;T</span>{" "}
              <span className="bs-word">FOLLOW.</span>
            </span>
            <span className={styles.headlineLine}>
              <span className="bs-word">WE</span>{" "}
              <span className="bs-word" style={{ color: "var(--accent-red)" }}>
                DEFINE.
              </span>
            </span>
          </h2>

          <div ref={dividerRef} className={styles.redDivider} />

          <p ref={supportingRef} className={styles.supportingText}>
            AURA is more than clothing.
            <span className={styles.supportingHighlight}>
              It is a statement of individuality, confidence, and modern street culture.
            </span>
          </p>
        </header>

        {/* Editorial 3-Column Magazine Spread */}
        <div ref={blocksRef} className={styles.editorialSpread}>
          {/* Column 1: Philosophy & Atelier Craft */}
          <div className={styles.column}>
            <article className={`${styles.storyBlock} bs-story-block`}>
              <div className={styles.blockHeader}>
                <span className={styles.blockNumber}>01</span>
                <h3 className={styles.blockTitle}>PHILOSOPHY</h3>
              </div>
              <p className={styles.blockParagraph}>
                We reject rapid disposable consumerism. Every silhouette is sculpted from first principles—measured in custom 520 GSM grammages, architectural seams, and tactile resistance against trends.
              </p>
            </article>

            {/* Atelier Image */}
            <div className={`${styles.detailImageFrame} bs-story-block`}>
              <Image
                src="/images/Hoodie rack.png"
                alt="AURA studio atelier garment collection rack"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className={styles.detailImage}
              />
            </div>

            <article className={`${styles.storyBlock} bs-story-block`}>
              <div className={styles.blockHeader}>
                <span className={styles.blockNumber}>02</span>
                <h3 className={styles.blockTitle}>THE ATELIER</h3>
              </div>
              <p className={styles.blockParagraph}>
                From Paris design sketches to Tokyo technical mills, our garments exist at the intersection of haute couture discipline and subterranean streetwear authenticity.
              </p>
            </article>
          </div>

          {/* Column 2: Centerpiece Vanguard Figure */}
          <div className={styles.centerImageCol}>
            <div ref={centerFrameRef} className={styles.centerImageFrame}>
              <span className={styles.imageFrameTag}>FIGURE // THE VANGUARD</span>
              <div ref={parallaxImgRef} className={styles.centerParallaxWrapper}>
                <Image
                  src="/images/Full-body masked model.png"
                  alt="AURA masked full body runway model"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className={styles.centerImage}
                />
              </div>
            </div>
            <span className={styles.imageCaption}>
              ARCHIVE 2026 // GENESIS SILHOUETTE
            </span>
          </div>

          {/* Column 3: Mission, Vision & Manifesto */}
          <div className={styles.column}>
            <article className={`${styles.storyBlock} bs-story-block`}>
              <div className={styles.blockHeader}>
                <span className={styles.blockNumber}>03</span>
                <h3 className={styles.blockTitle}>MISSION</h3>
              </div>
              <p className={styles.blockParagraph}>
                To engineer uncompromising armor for the nocturnal vanguard, bridging traditional luxury craftsmanship with raw, unfiltered street-level presence.
              </p>
            </article>

            <article className={`${styles.storyBlock} bs-story-block`}>
              <div className={styles.blockHeader}>
                <span className={styles.blockNumber}>04</span>
                <h3 className={styles.blockTitle}>VISION</h3>
              </div>
              <p className={styles.blockParagraph}>
                To pioneer a global movement where clothing conveys posture, permanence, and unspoken authority.
              </p>
            </article>

            {/* Editorial Manifesto Quote Box */}
            <div className={`${styles.manifestoBox} bs-story-block`}>
              <span className={styles.manifestoLabel}>THE MANIFESTO</span>
              <blockquote className={styles.manifestoQuote}>
                &ldquo;In an age of hyper-velocity and imitation, AURA stands as a permanent anchor. You do not wear the silhouette; the silhouette honors your aura.&rdquo;
              </blockquote>
              <span className={styles.manifestoAuthor}>
                — AURA DESIGN LAB, PARIS // TOKYO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

