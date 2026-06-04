import { getApiRefynBase } from "./cloud-profile";

/**
 * Browser calls go through the Next.js proxy (`/api/refyn/*`) to avoid CORS
 * when refyn-web runs on localhost but api_refyn is on Cloudflare.
 * Server-side code uses the full API URL directly.
 */
export function getApiRefynClientBase(): string {
  if (typeof window !== "undefined") {
    return "/api/refyn";
  }
  return getApiRefynBase();
}

export function apiRefynUrl(path: string): string {
  const base = getApiRefynClientBase().replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
