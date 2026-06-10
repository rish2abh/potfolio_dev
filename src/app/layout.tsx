import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { EffectsProvider } from "@/contexts/EffectsContext";
import { LogProvider } from "@/contexts/LogContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rishabh.dev"),
  title: "Rishabh Shrivastava | Backend Developer & AI Systems Engineer",
  description:
    "Portfolio of Rishabh Shrivastava — Backend Developer and AI Systems Engineer with 3+ years building scalable Node.js systems and AI-driven platforms.",
  openGraph: {
    title: "Rishabh Shrivastava | Backend Developer & AI Systems Engineer",
    description:
      "Backend Developer and AI Systems Engineer with 3+ years building scalable Node.js systems and AI-driven platforms.",
    url: "https://rishabh.dev",
    images: ["/images/profile.webp"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishabh Shrivastava | Backend Developer & AI Systems Engineer",
    description:
      "Backend Developer and AI Systems Engineer with 3+ years building scalable Node.js systems and AI-driven platforms.",
    images: ["/images/profile.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-dark-base text-white font-sans antialiased min-h-screen">
        <EffectsProvider>
          <LogProvider>
            <main>{children}</main>
          </LogProvider>
        </EffectsProvider>
      </body>
    </html>
  );
}
