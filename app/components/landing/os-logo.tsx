import { FaWindows } from "react-icons/fa";
import { SiLinux } from "react-icons/si";

const iconClass = "h-6 w-6 shrink-0";

export type OsName = "Windows" | "macOS" | "Linux";

/** Brand marks for download CTA. macOS is intentionally omitted — `SiMacos` renders as illegible micro-text at small sizes. */
export function OsLogo({
  os,
  className = iconClass,
}: {
  os: OsName;
  className?: string;
}) {
  switch (os) {
    case "Windows":
      return <FaWindows className={className} aria-hidden />;
    case "macOS":
      return null;
    case "Linux":
      return <SiLinux className={className} aria-hidden />;
  }
}
