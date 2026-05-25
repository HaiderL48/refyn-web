import type { Metadata } from "next";
import { LegalDocumentLayout } from "@/app/components/legal/legal-document-layout";
import { LegalSection } from "@/app/components/legal/legal-section";

export const metadata: Metadata = {
  title: "Terms of Service — PromptRefine",
  description: "Terms governing use of PromptRefine and Refyn desktop software.",
};

const LAST_UPDATED = "May 16, 2026";

export default function TermsPage() {
  return (
    <LegalDocumentLayout
      title="Terms of Service"
      description="Please read these terms carefully before using PromptRefine or Refyn."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. Agreement">
        <p>
          By accessing our website, downloading Refyn, or creating an account, you
          agree to these Terms of Service (&quot;Terms&quot;). If you do not agree,
          do not use the service.
        </p>
        <p>
          &quot;PromptRefine,&quot; &quot;Refyn,&quot; &quot;we,&quot; and
          &quot;us&quot; refer to the operator of this product. &quot;You&quot;
          means the individual or entity using the service.
        </p>
      </LegalSection>

      <LegalSection title="2. The service">
        <p>
          Refyn is desktop software that helps refine text and prompts using AI,
          triggered by a global shortcut in apps you already use. Features vary by
          plan (free, Pro, BYOK). We may update, suspend, or discontinue features
          with reasonable notice when practicable.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts and eligibility">
        <p>
          You must provide accurate information when signing in (e.g. via Google).
          You are responsible for activity under your account and for keeping
          credentials secure. You must be at least 13 years old (or the minimum age
          in your jurisdiction) to use the service.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Violate laws or third-party rights</li>
          <li>Reverse engineer, scrape, or abuse the service or APIs</li>
          <li>Upload malware or attempt unauthorized access</li>
          <li>Use the service to generate unlawful, harmful, or deceptive content</li>
          <li>Resell or sublicense the service without written permission</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Subscriptions and payment">
        <p>
          Paid plans are billed according to the pricing shown at checkout (e.g.
          via Razorpay). Fees are non-refundable except as stated in our Refund
          Policy or required by law. Subscriptions renew until cancelled in your
          account or with support. Price changes apply to new billing periods with
          notice.
        </p>
      </LegalSection>

      <LegalSection title="6. BYOK and third-party providers">
        <p>
          If you connect your own API keys, you are responsible for compliance with
          your provider&apos;s terms, usage limits, and charges. We are not liable
          for outages, rate limits, or actions of third-party AI providers.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          We own the software, branding, and site content. You retain rights to text
          you input. You grant us a limited license to process that text solely to
          provide the service you request.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimers">
        <p>
          The service is provided &quot;as is&quot; without warranties of any kind,
          express or implied, including merchantability, fitness for a particular
          purpose, and non-infringement. AI output may be inaccurate; you are
          responsible for reviewing results before use.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          To the maximum extent permitted by law, we are not liable for indirect,
          incidental, special, consequential, or punitive damages, or loss of
          profits, data, or goodwill. Our total liability for any claim relating to
          the service is limited to the amount you paid us in the twelve months
          before the claim, or USD $50 if you have not paid fees.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          You may stop using the service at any time. We may suspend or terminate
          access for breach of these Terms or to protect the service. Sections that
          by nature should survive (e.g. disclaimers, liability limits) survive
          termination.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes">
        <p>
          We may update these Terms. We will post the revised version with a new
          &quot;Last updated&quot; date. Continued use after changes constitutes
          acceptance where permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about these Terms: contact us through the support channel listed
          on promptrefine.com or in the app.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
