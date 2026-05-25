import Link from "next/link";

export function FeatureStepCard({
  title,
  description,
  learnMoreHref,
  visual,
  visualAlign = "center",
}: {
  title: string;
  description: string;
  learnMoreHref?: string;
  visual?: React.ReactNode;
  /** Where the visual sits in the wallpaper frame. `end` keeps the bottom anchored so the visual grows upward. */
  visualAlign?: "center" | "end";
}) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border border-outline-variant/25 bg-surface-container-high/70 p-5 backdrop-blur-md md:p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold tracking-tight text-on-surface">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          {description}
        </p>
        {learnMoreHref ? (
          <Link
            href={learnMoreHref}
            className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-fixed"
          >
            Learn more
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>

      <div
        className={`wallpaper-bg relative mt-auto flex min-h-[220px] justify-center overflow-hidden rounded-xl p-5 md:min-h-[260px] ${
          visualAlign === "end" ? "items-end" : "items-center"
        }`}
      >
        {visual}
      </div>
    </article>
  );
}
