import type { MetadataRoute } from "next";
import { getSiteUrl, publicRoutes } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${base}${route.path === "/" ? "" : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
