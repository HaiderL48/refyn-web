import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desktop sign-in",
  robots: { index: false, follow: false },
};

export default function DesktopLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
