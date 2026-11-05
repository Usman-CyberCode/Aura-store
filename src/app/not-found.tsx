import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "var(--space-4xl) var(--space-xl)",
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            letterSpacing: "0.25em",
            color: "var(--accent-red)",
            marginBottom: "var(--space-md)",
            textTransform: "uppercase",
          }}
        >
          404 ERROR // ARCHIVE VOID
        </span>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "var(--space-md)",
          }}
        >
          PIECE NOT FOUND.
        </h1>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--text-secondary)",
            maxWidth: "460px",
            lineHeight: "1.6",
            marginBottom: "var(--space-2xl)",
            fontSize: "0.9375rem",
          }}
        >
          The requested garment or collection route does not exist in the current AURA archive.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "14px 32px",
            borderRadius: "9999px",
            backgroundColor: "#ffffff",
            color: "#050505",
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          RETURN TO COLLECTION
        </Link>
      </main>
      <Footer />
    </>
  );
}

