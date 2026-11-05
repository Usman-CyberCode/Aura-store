import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Minimal scroll container to test navbar backdrop blur & parallax scroll */}
        <section
          id="shop"
          style={{
            minHeight: "80vh",
            backgroundColor: "var(--bg-primary)",
            position: "relative",
            zIndex: 10,
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            letterSpacing: "0.25em",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>[ AURA STORE // UPCOMING RELEASES ]</span>
        </section>
      </main>
    </>
  );
}
