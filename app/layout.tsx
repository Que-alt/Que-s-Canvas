import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Providers from "@/components/Providers";
import { site } from "@/data/site";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const lufga = localFont({
  variable: "--font-lufga",
  display: "swap",
  src: [
    { path: "./fonts/Lufga-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Lufga-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Lufga-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Lufga-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Lufga-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title,
    description: site.positioning,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title, description: site.positioning },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${lufga.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <Navigation />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
