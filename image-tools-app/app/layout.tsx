import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { I18nProvider } from "@/lib/i18n";
import { createSeoMetadata, homeSeo } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata(homeSeo),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function() {
      try {
        var savedTheme = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#EEF2FF] text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd />
        <I18nProvider>
          <div className="flex min-h-screen flex-col bg-[#EEF2FF] transition-colors dark:bg-slate-950">
            <Navbar />
            <main className="flex-1 pt-32 md:pt-20 lg:pl-72">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
