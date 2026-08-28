import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsappWidget } from "@/components/layout/whatsapp-widget";
import { JsonLd } from "@/components/seo/json-ld";
import { firm } from "@/lib/firm";
import { localeAlternates, openGraphFor, twitterFor } from "@/lib/seo";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  const siteName = messages.meta.siteName;
  const description = messages.meta.description;

  return {
    title: {
      default: `${siteName} | ${messages.meta.titleDefault}`,
      // Localized so Chinese pages are suffixed with the Chinese firm name.
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL(firm.siteUrl),
    alternates: localeAlternates(locale),
    openGraph: {
      title: `${siteName} | ${messages.meta.titleDefault}`,
      description,
      ...openGraphFor(locale),
    },
    twitter: twitterFor(),
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.png", sizes: "48x48", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "zh")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale === "zh" ? "zh-MY" : "en-MY"}>
      <body className="min-h-screen font-sans">
        <NextIntlClientProvider messages={messages}>
          <JsonLd locale={locale} />
          <Header />
          <main>{children}</main>
          <Footer locale={locale} />
          <WhatsappWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
