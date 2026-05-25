function MacKeyCap({
  children,
  pressDelayMs = 0,
}: {
  children: React.ReactNode;
  pressDelayMs?: number;
}) {
  return (
    <kbd
      className="key-press-pulse inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-outline-variant/40 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-2 text-[11px] font-medium leading-none text-on-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(0,0,0,0.45)]"
      style={{ animationDelay: `${pressDelayMs}ms` }}
    >
      {children}
    </kbd>
  );
}

const PRESS_STAGGER_MS = 350;

export function KeyboardShortcut({ keys }: { keys: readonly string[] }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
      {keys.map((key, i) => (
        <span key={key} className="inline-flex items-center gap-1.5">
          {i > 0 ? <span className="opacity-60">+</span> : null}
          <MacKeyCap pressDelayMs={i * PRESS_STAGGER_MS}>{key}</MacKeyCap>
        </span>
      ))}
    </div>
  );
}
