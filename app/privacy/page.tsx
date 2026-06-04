import { LegalDocumentLayout } from "@/app/components/legal/legal-document-layout";
import { LegalSection } from "@/app/components/legal/legal-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How RefynAI collects, uses, and protects your information.",
  path: "/privacy",
});

const LAST_UPDATED = "May 16, 2026";

export default function PrivacyPage() {
  return (
    <LegalDocumentLayout
      title="Privacy Policy"
      description="This policy explains what we collect, why we collect it, and your choices."
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. Overview">
        <p>
          RefynAI is designed so most enhancement work happens on your
          device. This policy describes data handled by our website, account
          services, and optional cloud features.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>
          <strong className="font-medium text-on-surface">Account data:</strong>{" "}
          When you sign in (e.g. with Google), we may receive your name, email, and
          profile identifier to manage billing and your account.
        </p>
        <p>
          <strong className="font-medium text-on-surface">Usage and billing:</strong>{" "}
          Plan tier, payment status, daily usage limits, and transaction references
          from our payment processor (we do not store full card numbers).
        </p>
        <p>
          <strong className="font-medium text-on-surface">Technical data:</strong>{" "}
          Device/OS type, app version, and basic logs needed to operate APIs, prevent
          abuse, and fix errors.
        </p>
        <p>
          <strong className="font-medium text-on-surface">Local processing:</strong>{" "}
          Text you select for enhancement is processed to deliver the feature. By
          default we do not upload clipboard or screen contents to our servers for
          enhancement. Optional cloud or sync features, if enabled, are described in
          the app.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, maintain, and improve the service</li>
          <li>Authenticate you and enforce plan limits</li>
          <li>Process payments and send receipts</li>
          <li>Respond to support requests</li>
          <li>Comply with law and protect against fraud or abuse</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Legal bases (EEA/UK)">
        <p>
          Where GDPR applies, we rely on contract (providing the service), legitimate
          interests (security, improvement), and consent where required (e.g. optional
          analytics if offered).
        </p>
      </LegalSection>

      <LegalSection title="5. Sharing">
        <p>We may share data with:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Service providers (hosting, auth, payments, analytics) under contractual
            safeguards
          </li>
          <li>AI providers you configure via BYOK (under your account)</li>
          <li>Authorities when required by law or to protect rights and safety</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection title="6. Retention">
        <p>
          We keep account and billing records as long as needed for the service and
          legal obligations. Logs are retained for a limited period unless longer
          retention is required for security or disputes.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We use reasonable technical and organizational measures to protect data.
          No method of transmission or storage is 100% secure.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>
          Depending on your location, you may request access, correction, deletion,
          or portability of personal data, or object to certain processing. Contact us
          to exercise these rights. You may also lodge a complaint with your local
          data protection authority.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          The service is not directed to children under 13. We do not knowingly collect
          data from children under 13.
        </p>
      </LegalSection>

      <LegalSection title="10. International transfers">
        <p>
          Data may be processed in countries other than yours. We use appropriate
          safeguards where required for cross-border transfers.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes">
        <p>
          We may update this policy. The &quot;Last updated&quot; date will change
          when we do. Material changes may be communicated via the site or email
          where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Privacy questions: use the contact method on this website or in the
          app.
        </p>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
