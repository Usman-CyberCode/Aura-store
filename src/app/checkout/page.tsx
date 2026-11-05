import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Checkout from "@/components/checkout/Checkout";

export const metadata: Metadata = {
  title: "Secure Checkout | AURA STORE",
  description: "Complete your acquisition of Genesis contemporary streetwear pieces with complimentary nationwide shipping.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main>
        <Checkout />
      </main>
      <Footer />
    </>
  );
}

