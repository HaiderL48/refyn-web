import { MaterialIcon } from "@/app/components/material-icon";
import { FakePromptBox } from "./fake-prompt-box";

const BEFORE_TEXT = "fix navbar issue";
const AFTER_TEXT =
  "Fix the navbar alignment and spacing issues while maintaining responsiveness and ensuring a consistent, accessible layout across different screen sizes.";

function PanelHeader({
  badge,
  badgeTone,
  label,
}: {
  badge: string;
  badgeTone: "before" | "after";
  label: string;
}) {
  const badgeClass =
    badgeTone === "before"
      ? "border border-rose-500/30 bg-rose-500/10 text-rose-400"
      : "border border-secondary/30 bg-secondary/10 text-secondary";

  return (
    <div className="flex items-center gap-3 px-1">
      <span
        className={`rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${badgeClass}`}
      >
        {badge}
      </span>
      <span className="text-sm font-medium text-on-surface">{label}</span>
    </div>
  );
}

function PanelStatus({
  tone,
  icon,
  children,
}: {
  tone: "before" | "after";
  icon: string;
  children: React.ReactNode;
}) {
  const iconColor = tone === "before" ? "text-rose-400" : "text-secondary";
  const borderColor =
    tone === "before" ? "border-outline-variant/25" : "border-secondary/20";

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border ${borderColor} bg-surface-container-high/50 px-3.5 py-2.5`}
    >
      <MaterialIcon name={icon} size={16} className={iconColor} />
      <span className="text-xs text-on-surface-variant">{children}</span>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section id="before-after" className="h-screen scroll-mt-24">
      <div className="mx-auto flex h-full w-full max-w-container-max flex-col items-center justify-center gap-8 overflow-y-auto border-t border-outline-variant/50 px-margin-mobile py-8 md:gap-10 md:px-margin-desktop md:py-10">
      <div className="flex max-w-2xl shrink-0 flex-col items-center gap-4 text-center">
        <p className="text-label-sm uppercase tracking-widest text-secondary">
          Before / After
        </p>
        <h2 className="text-display-lg font-bold uppercase tracking-tight text-on-surface">
          Sharper in one shortcut
        </h2>
        <p className="text-body-lg leading-relaxed text-on-surface-variant">
          See how RefynAI turns a vague request into a clear, specific,
          AI-optimized prompt.
        </p>
      </div>

      {/* Wallpaper container — holds headers, prompts, arrow, and statuses */}
      <div className="wallpaper-bg relative flex min-h-[50vh] w-full flex-col justify-center overflow-hidden rounded-2xl border border-outline-variant/25 px-6 py-10 md:px-10 md:py-14">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          {/* BEFORE column */}
          <div className="flex flex-col gap-4">
            <PanelHeader
              badge="Before"
              badgeTone="before"
              label="Your input"
            />
            <FakePromptBox
              variant="static"
              text={BEFORE_TEXT}
              size="md"
              className="h-[180px]"
            />
            <PanelStatus tone="before" icon="cancel">
              Too short, unclear, lacks context
            </PanelStatus>
          </div>

          {/* Arrow (centers naturally on the prompt row because the column
              is symmetric: header above ~ status below). */}
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary/30 bg-secondary/10">
              <MaterialIcon
                name="arrow_forward"
                size={20}
                className="text-secondary"
              />
            </div>
          </div>

          {/* AFTER column */}
          <div className="flex flex-col gap-4">
            <PanelHeader
              badge="After"
              badgeTone="after"
              label="Refined prompt"
            />
            <FakePromptBox
              variant="static"
              text={AFTER_TEXT}
              size="md"
              className="h-[180px]"
            />
            <PanelStatus tone="after" icon="check_circle">
              Clear, specific, and AI-optimized
            </PanelStatus>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
