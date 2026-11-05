"use client";

import { useState, useRef, FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);

  // Email validation regex
  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter an email address.");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Frontend-only confirmation (ready for future backend hook)
    setStatus("success");
    setErrorMessage("");
    setEmail("");
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!containerRef.current || prefersReducedMotion) return;

      // 1. Heading and text scroll reveal
      gsap.fromTo(
        [`.${styles.kicker}`, `.${styles.headline}`, `.${styles.supportingText}`, `.${styles.form}`],
        {
          y: 35,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Subtle background parallax
      if (atmosphereRef.current) {
        gsap.to(atmosphereRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.newsletterSection} id="newsletter">
      <div ref={atmosphereRef} className={styles.atmosphere} aria-hidden="true">
        <div className={styles.charcoalGlow} />
        <div className={styles.subtleRedWash} />
      </div>

      <div ref={containerRef} className={styles.container}>
        <div className={styles.kicker}>
          <span className={styles.kickerDot} />
          <span>EXCLUSIVE ACCESS // THE PRIVATE LIST</span>
        </div>

        <h2 className={styles.headline}>GET IN THE KNOW.</h2>

        <p className={styles.supportingText}>
          Access exclusive drops, private releases, and the latest from AURA.
        </p>

        {status === "success" ? (
          <div className={styles.successCard} role="status" aria-live="polite">
            <span className={styles.successDot} />
            <span>ACCESS CONFIRMED. YOU ARE ON THE PRIVATE LIST.</span>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div
              className={`${styles.inputRow} ${
                status === "error" ? styles.inputRowError : ""
              }`}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="ENTER YOUR EMAIL FOR PRIVATE ACCESS"
                className={styles.inputField}
                aria-label="Email address for private access newsletter"
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "newsletter-error" : undefined}
                required
              />

              <button
                type="submit"
                className={styles.submitBtn}
                aria-label="Subscribe to exclusive drops"
              >
                <span>REQUEST ACCESS</span>
                <ArrowRight size={14} className={styles.btnIcon} />
              </button>
            </div>

            {/* Error Message */}
            <div className={styles.feedbackMessage} aria-live="polite">
              {status === "error" && (
                <span id="newsletter-error" className={styles.errorMessage} role="alert">
                  <AlertCircle size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                  {errorMessage}
                </span>
              )}
            </div>
          </form>
        )}

        <p className={styles.disclaimer}>
          BY SUBSCRIBING, YOU AGREE TO RECEIVE PRIVATE DROP NOTIFICATIONS. OPT-OUT AT ANY TIME.
        </p>
      </div>
    </section>
  );
}

