"use client";

import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="AURA STORE Footer">
      <div className={styles.container}>
        {/* Main Content Row */}
        <div className={styles.topRow}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoText} aria-label="AURA STORE Home">
              <span>AURA STORE</span>
              <span className={styles.logoDot} />
            </Link>

            <h3 className={styles.slogan}>
              OWN YOUR AURA<span className={styles.sloganPeriod}>.</span>
            </h3>

            <p className={styles.brandDescription}>
              Independent contemporary streetwear house. Engineering architectural garments that bridge high-fashion discipline with nocturnal urban culture.
            </p>
          </div>

          {/* Navigation Column */}
          <div className={styles.navCol}>
            <h4 className={styles.colHeading}>NAVIGATION</h4>
            <nav className={styles.linkList} aria-label="Footer Navigation">
              <Link href="#shop" className={styles.footerLink}>
                SHOP COLLECTION
              </Link>
              <Link href="#story" className={styles.footerLink}>
                THE STORY
              </Link>
              <Link href="#lookbook" className={styles.footerLink}>
                LOOKBOOK
              </Link>
              <Link href="#about" className={styles.footerLink}>
                ABOUT US
              </Link>
            </nav>
          </div>

          {/* Socials / External Links Column */}
          <div className={styles.navCol}>
            <h4 className={styles.colHeading}>DIGITAL ARCHIVE</h4>
            <div className={styles.linkList}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
                aria-label="Visit AURA on Instagram (opens in a new tab)"
              >
                <span>INSTAGRAM</span>
                <span className={styles.externalTag}>[EXT]</span>
                <ArrowUpRight size={12} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
                aria-label="Visit AURA on X / Twitter (opens in a new tab)"
              >
                <span>TWITTER / X</span>
                <span className={styles.externalTag}>[EXT]</span>
                <ArrowUpRight size={12} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
                aria-label="Visit AURA on TikTok (opens in a new tab)"
              >
                <span>TIKTOK</span>
                <span className={styles.externalTag}>[EXT]</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          {/* Back To Top Action */}
          <div className={styles.backToTopCol}>
            <button
              type="button"
              className={styles.backToTopButton}
              onClick={scrollToTop}
              aria-label="Scroll back to top of page"
            >
              <span>BACK TO TOP</span>
              <ArrowUp size={14} className={styles.topIcon} />
            </button>
          </div>
        </div>

        {/* Minimal Crimson Divider Line */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Bottom Legal & Coordinates */}
        <div className={styles.bottomRow}>
          <p className={styles.legalStatement}>
            © {currentYear} AURA STORE. HAUTE COUTURE STREETWEAR HOUSE. ALL RIGHTS RESERVED.
          </p>

          <div className={styles.locationCoords} aria-hidden="true">
            <span className={styles.coordItem}>PARIS</span>
            <span>•</span>
            <span className={styles.coordItem}>TOKYO</span>
            <span>•</span>
            <span className={styles.coordItem}>NYC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

