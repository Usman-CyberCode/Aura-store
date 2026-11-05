import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";
import Products from "@/components/shop/Products";
import Lookbook from "@/components/home/Lookbook";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollStory />
        <Products />
        <Lookbook />
      </main>
    </>
  );
}
