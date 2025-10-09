// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Coastal Beach Company",
  description: "Refined beach service on Florida’s Emerald Coast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-sky-50 text-sky-900 antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
