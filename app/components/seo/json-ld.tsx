import { absoluteUrl, siteConfig } from "@/lib/site-config";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function HomePageJsonLd() {
  const url = absoluteUrl("/");

  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url,
          description: siteConfig.description,
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.name,
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Windows, macOS, Linux",
          description: siteConfig.description,
          url,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free tier and paid cloud plans available",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url,
        },
      ]}
    />
  );
}

export function FaqPageJsonLd({
  items,
}: {
  items: ReadonlyArray<{ question: string; answer: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}
