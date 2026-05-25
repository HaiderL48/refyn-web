const FAQ_ITEMS = [
  {
    id: "data-stored",
    question: "Is my data stored?",
    answer:
      "Refyn runs locally on your machine. We do not upload your clipboard or screen contents to our servers for enhancement. Account sign-in may store basic profile info (e.g. email) for billing and sync—see your plan and privacy settings.",
  },
  {
    id: "byok",
    question: "Does Refyn support BYOK?",
    answer:
      "Yes. Bring Your Own Key (BYOK) lets you connect your own API keys so requests go to your provider account. You stay in control of usage and billing with that provider.",
  },
  {
    id: "chatgpt-cursor",
    question: "Does it work with ChatGPT and Cursor?",
    answer:
      "Yes. Refyn works in any app where you can type or paste text—ChatGPT, Cursor, Claude, browser tabs, Slack, email, and more. Select your prompt, use the global shortcut, and paste the refined result back.",
  },
  {
    id: "platforms",
    question: "Does it support macOS and Linux?",
    answer:
      "Yes. Refyn is available on Windows, macOS, and Linux. Download the build for your OS from the site; the same global shortcut workflow applies on each platform.",
  },
  {
    id: "macos-permissions",
    question: "Why does macOS ask for permissions?",
    answer:
      "macOS requires Accessibility and Input Monitoring (and sometimes Automation) so Refyn can read selected text, listen for your global shortcut, and write back to the clipboard. These permissions stay on your device—we use them only to run the enhancement flow you trigger.",
  },
  {
    id: "store-prompts",
    question: "Does Refyn store prompts?",
    answer:
      "Enhancements are processed to improve your text; we do not build a searchable history of your prompts on our servers by default. What stays on disk depends on your OS and app settings (e.g. clipboard history). Pro features may add optional sync—check in-app settings.",
  },
  {
    id: "models",
    question: "Which AI models are supported?",
    answer:
      "Refyn works with major providers you configure—including OpenAI-compatible APIs and other models supported in the app. With BYOK, you choose the model and key; without BYOK, available models follow your plan and in-app options.",
  },
] as const;

function ChevronDown() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqContent() {
  return (
    <>
      <p className="text-label-sm uppercase tracking-widest text-secondary">FAQ</p>
      <h1 className="mt-4 text-balance text-headline-lg font-semibold text-on-surface md:text-display-lg">
        Questions about privacy, apps, and setup
      </h1>
      <p className="mt-5 text-body-md leading-relaxed text-on-surface-variant md:text-body-lg">
        Short answers on clipboard access, shortcuts, permissions, and models.
      </p>

      <div className="mt-12 flex flex-col gap-3 md:mt-14">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.id}
            className="group rounded-xl bg-surface-container-low/50 px-5 py-1 open:bg-surface-container-low/70 sm:px-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-body-md font-medium text-on-surface transition-colors marker:content-none hover:text-primary [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown />
            </summary>
            <div className="border-t border-outline-variant/50 pb-5 pt-1">
              <p className="text-body-sm leading-relaxed text-on-surface-variant md:text-body-md">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
