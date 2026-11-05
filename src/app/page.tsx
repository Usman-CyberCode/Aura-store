import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollStory />
        {/* Placeholder anchor for navigation until Stage 4 */}
        <section
          id="shop"
          style={{
            minHeight: "60vh",
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
          <span>[ AURA STORE // FW26 CAMPAIGN ]</span>
        </section>
      </main>
    </>
  );
}
