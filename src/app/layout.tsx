import type { Metadata } from "next";
import "@/styles/globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "AURA STORE | Haute Couture & High-Street",
  description: "A luxury contemporary streetwear & haute couture fashion house.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
