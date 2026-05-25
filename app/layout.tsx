import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { FirebaseAnalytics } from "./components/firebase-analytics";
import { SmoothScrollProvider } from "./components/smooth-scroll/smooth-scroll-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptRefine — Instant precision anywhere you type",
  description:
    "Transform vague thoughts into powerful AI commands instantly. PromptRefine upgrades your text across any application with a single keystroke.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} font-sans bg-surface text-on-surface min-h-screen flex flex-col antialiased selection:bg-secondary/30 selection:text-secondary`}
      >
        <FirebaseAnalytics />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
