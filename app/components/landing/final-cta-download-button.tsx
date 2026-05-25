"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaApple } from "react-icons/fa6";
import { OsLogo, type OsName } from "./os-logo";

const FILE_EXT: Record<OsName, string> = {
  Windows: ".exe",
  macOS: ".dmg",
  Linux: ".AppImage",
};

function detectOs(): OsName {
  if (typeof navigator === "undefined") return "Windows";
  const ua = navigator.userAgent;
  if (/Win/i.test(ua)) return "Windows";
  if (/Mac|iPhone|iPad|iPod/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Windows";
}

type FinalCtaDownloadButtonProps = {
  className?: string;
};

export function FinalCtaDownloadButton({ className = "" }: FinalCtaDownloadButtonProps) {
  const [os, setOs] = useState<OsName>("Windows");

  useEffect(() => {
    setOs(detectOs());
  }, []);

  const ext = FILE_EXT[os];

  return (
    <Link
      href="#download"
      aria-label={`Download for ${os}${ext}`}
      className={`inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-secondary px-8 py-3.5 text-label-md font-bold text-black transition-colors hover:bg-secondary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:w-auto ${className}`}
    >
      {os === "macOS" ? (
        <FaApple className="h-5 w-5 shrink-0" aria-hidden />
      ) : (
        <OsLogo os={os} className="h-5 w-5 shrink-0" />
      )}
      <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
        <span>Download for {os}</span>
        <span className="text-sm font-semibold text-black/50">{ext}</span>
      </span>
    </Link>
  );
}
