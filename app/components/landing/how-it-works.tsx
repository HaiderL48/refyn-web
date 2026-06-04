import { FakePromptBox } from "./fake-prompt-box";
import { FeatureStepCard } from "./feature-step-card";
import { KeyboardShortcut } from "./keyboard-shortcut";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="h-screen scroll-mt-24">
      <div className="mx-auto flex h-full max-w-container-max flex-col items-center justify-center gap-12 overflow-y-auto border-t border-outline-variant/50 px-margin-mobile py-8 md:gap-16 md:px-margin-desktop md:py-10">
      <div className="text-center">
        <h2 className="text-display-lg font-bold uppercase tracking-tight text-on-surface">
          How it works
        </h2>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        <FeatureStepCard
          title="Copy Anything"
          description="Copy any prompt, error, code snippet, or text directly from your workflow."
          learnMoreHref="#download"
          visual={<FakePromptBox />}
        />
        <FeatureStepCard
          title="Press the shortcut"
          description="Hit Ctrl + Alt + C to instantly enhance the copied text without leaving your current app."
          learnMoreHref="#download"
          visual={
            <>
              <FakePromptBox variant="selected" />
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
                <KeyboardShortcut keys={["Ctrl", "Alt", "C"]} />
              </div>
            </>
          }
        />
        <FeatureStepCard
          title="Get a Smarter Prompt"
          description="RefynAI rewrites your text into a cleaner, clearer, and more AI-optimized prompt in seconds."
          learnMoreHref="#download"
          visual={
            <div className="absolute inset-x-5 bottom-[62px] flex justify-center md:bottom-[82px]">
              <FakePromptBox variant="refining" />
            </div>
          }
        />
      </div>
      </div>
    </section>
  );
}
