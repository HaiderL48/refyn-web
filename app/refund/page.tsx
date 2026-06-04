import { LegalDocumentLayout } from "@/app/components/legal/legal-document-layout";
import { LegalSection } from "@/app/components/legal/legal-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Refund Policy",
  description: "Refund eligibility and process for RefynAI paid plans.",
  path: "/refund",
});

const LAST_UPDATED = "May 16, 2026";

export default function RefundPage() {
  return (
    <LegalDocumentLayout
      title="Refund Policy"
      description="How refunds work for RefynAI subscriptions and one-time purchases."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. Overview">
        <p>
          We want you to be satisfied with RefynAI. This policy explains when
          refunds may be available for paid plans processed through our website or
          payment partners (e.g. Razorpay).
        </p>
      </LegalSection>

      <LegalSection title="2. Free tier">
        <p>
          The free plan does not involve charges and is not eligible for refunds.
        </p>
      </LegalSection>

      <LegalSection title="3. Subscription refunds">
        <p>
          <strong className="font-medium text-on-surface">7-day window:</strong> If
          you are unhappy with a new Pro subscription, contact us within 7 days of
          your first charge for that subscription. We may issue a full refund at our
          discretion if you have not extensively used paid quota beyond reasonable
          trial use.
        </p>
        <p>
          <strong className="font-medium text-on-surface">Renewals:</strong>{" "}
          Subscription renewals are generally non-refundable. Cancel before the next
          billing date to avoid future charges. Access continues until the end of the
          paid period.
        </p>
        <p>
          <strong className="font-medium text-on-surface">Partial periods:</strong>{" "}
          We do not typically provide prorated refunds for unused time after the
          refund window unless required by law.
        </p>
      </LegalSection>

      <LegalSection title="4. BYOK plan">
        <p>
          BYOK plans bill for software access and integration; API usage is billed by
          your provider. Refunds follow the same subscription rules above and do not
          include charges from third-party AI providers.
        </p>
      </LegalSection>

      <LegalSection title="5. How to request a refund">
        <p>
          Email or contact support with your account email, payment date, and reason
          for the request. We will respond within a reasonable time (typically within
          5–10 business days).
        </p>
      </LegalSection>

      <LegalSection title="6. Chargebacks">
        <p>
          Please contact us before initiating a chargeback so we can resolve the issue.
          Chargebacks may result in account suspension pending investigation.
        </p>
      </LegalSection>

      <LegalSection title="7. Payment processor">
        <p>
          Refunds are issued to the original payment method when possible. Timing
          depends on your bank or card issuer after we approve the refund.
        </p>
      </LegalSection>

      <LegalSection title="8. Exceptions">
        <p>
          Nothing in this policy limits mandatory refund rights under applicable
          consumer protection laws in your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes">
        <p>
          We may update this policy. The current version is always available on this
          page with the latest &quot;Last updated&quot; date.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Refund requests: use the support contact on this website or in the app.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
