import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Coastal Beach Company",
  description: "Premium beach service on the Florida Panhandle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-sky-50/40 text-slate-900">
        <SiteHeader />
        <main>{children}</main>
        <footer className="mt-16 border-t border-sky-100">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-sky-700">
            © {new Date().getFullYear()} Coastal Beach Company · Public Beaches
            (30A) · PCB · Destin
          </div>
        </footer>
      </body>
    </html>
  );
}
