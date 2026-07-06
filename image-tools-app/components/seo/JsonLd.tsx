import {
  absoluteUrl,
  allSeoRoutes,
  homeSeo,
  siteDescription,
  siteName,
  toolSeo,
} from "@/lib/seo";

export default function JsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${absoluteUrl()}#organization`,
      name: siteName,
      url: absoluteUrl(),
    },
    {
      "@type": "WebSite",
      "@id": `${absoluteUrl()}#website`,
      name: siteName,
      url: absoluteUrl(),
      description: siteDescription,
      publisher: {
        "@id": `${absoluteUrl()}#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/tools")}?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${absoluteUrl()}#webapp`,
      name: siteName,
      url: absoluteUrl(),
      description: homeSeo.description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl("/tools")}#tool-list`,
      name: "Image Tools Hub tools",
      itemListElement: toolSeo.map((route, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: route.title.replace(" | Image Tools Hub", ""),
        url: absoluteUrl(route.path),
      })),
    },
    ...toolSeo.map((route) => ({
      "@type": "SoftwareApplication",
      "@id": `${absoluteUrl(route.path)}#tool`,
      name: route.title.replace(" | Image Tools Hub", ""),
      url: absoluteUrl(route.path),
      description: route.description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@id": `${absoluteUrl()}#organization`,
      },
    })),
    ...allSeoRoutes.map((route) => ({
      "@type": "WebPage",
      "@id": `${absoluteUrl(route.path)}#webpage`,
      name: route.title,
      url: absoluteUrl(route.path),
      description: route.description,
      isPartOf: {
        "@id": `${absoluteUrl()}#website`,
      },
    })),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}
