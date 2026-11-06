import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ScrollStory from '@/components/home/ScrollStory';
import Products from "@/components/shop/Products";
import Lookbook from "@/components/home/Lookbook";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScrollStory />
        <Products />
        <Lookbook />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
