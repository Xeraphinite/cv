import "../globals.css"

import Head from "next/head"
import Link from "next/link"
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getDirection } from '@/lib/i18n-utils'
import { type Locale, locales } from '@/i18n'
import { appConfig } from '@/lib/config/app-config'
import { CVHeader } from '@/components/layout/cv-header'
import { CVFooter } from '@/components/layout/cv-footer'
import { ThemeProvider } from "@/components/theme-provider"
import { LocaleDetector } from '@/components/layout/locale-detector'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const localeTyped = locale as Locale
  
  const currentTitle = appConfig.site.namesByLocale[localeTyped]
  const currentDescription = appConfig.site.namesByLocale[localeTyped]
  
  return {
    metadataBase: new URL(appConfig.site.metadataBase),
    title: currentTitle,
    description: currentDescription,
    keywords: [
      "Keyou Zheng", "郑恪悠", "CV", "Resume", "研究生", "Graduate Student"
    ],
    authors: [{ name: "Keyou Zheng" }],
    creator: "Keyou Zheng",
    publisher: "Keyou Zheng",
    generator: 'Next.js',
    robots: "index, follow",
    alternates: {
      canonical: `/${localeTyped}`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `/${loc}`])
      ),
    },
    openGraph: {
      title: currentTitle,
      description: currentDescription,
      type: "profile",
      locale: localeTyped,
      alternateLocale: locales.filter((loc) => loc !== localeTyped),
      siteName: "Keyou Zheng - Professional CV",
      images: [
        {
          url: "/icon.png",
          width: 400,
          height: 400,
          alt: "Keyou Zheng",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: currentTitle,
      description: currentDescription,
      images: ["/icon.png"],
    },
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeTyped = locale as Locale
  
  if (!locales.includes(localeTyped)) {
    notFound()
  }

  const messages = await getMessages({ locale: localeTyped })
  const direction = getDirection(localeTyped)

  return (
    <html lang={localeTyped} dir={direction}>
      <Head>
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
          >
            <CVHeader />
            <LocaleDetector />
            {children}
            <CVFooter />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
} 
