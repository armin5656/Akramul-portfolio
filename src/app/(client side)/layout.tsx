import type { Metadata } from "next";
import "../globals.css";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Akramul Islam | Cyber Security Expert & Digital Security Consultant",
    template: "%s | Akramul Islam",
  },
  description:
    "Akramul Islam is a Dhaka-based Cyber Security Expert and Digital Security Consultant, specialising in social media security, SEO security, OSINT, digital forensics and incident response.",
  alternates: { canonical: siteUrl },
  keywords: [
    "Akramul Islam",
    "cybersecurity consultant Bangladesh",
    "social media security",
    "digital security consultant Dhaka",
    "DigitX",
  ],
  authors: [{ name: "Akramul Islam" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Akramul Islam — Cyber Security Portfolio",
    title: "Akramul Islam | Cyber Security Expert & Digital Security Consultant",
    description:
      "Cybersecurity and digital protection expertise for Bangladesh: social media security, digital forensics, OSINT and incident response.",
    images: [{ url: `${siteUrl}/Hero.png`, width: 1355, height: 1858, alt: "Akramul Islam" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akramul Islam | Cyber Security Expert & Digital Security Consultant",
    description: "Cybersecurity and digital protection expertise based in Dhaka, Bangladesh.",
    images: [`${siteUrl}/Hero.png`],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.png" },
};

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
