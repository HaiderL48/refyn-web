import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl, siteConfig } from "./site-config";

type PageSeoOptions = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: PageSeoOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle =
    path === "/" ? `${siteConfig.name} — ${title}` : `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function rootMetadata(): Metadata {
  const url = getSiteUrl();
  const title = `${siteConfig.name} — Refine AI prompts anywhere you type`;

  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [...siteConfig.keywords],
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    robots: { index: true, follow: true },
    alternates: { canonical: absoluteUrl("/") },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: absoluteUrl("/"),
      siteName: siteConfig.name,
      title,
      description: siteConfig.description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: siteConfig.description,
    },
  };
}
