import type React from "react"
import "../globals.css"
import { Inter } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ThemeProvider } from "@/components/theme-provider"
import { locales, localeLabels, type Locale } from '@/i18n'
import { getDirection } from '@/lib/i18n-utils'
import { CVHeader } from '@/components/cv-header'

const inter = Inter({ subsets: ["latin"] })

export function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  
  const titles = {
    en: "Keyou Zheng - CV | Graduate Student & Researcher",
    zh: "郑恪悠 - 简历 | 研究生 & 研究员", 
    ja: "郑恪悠 - 履歴書 | 大学院生 & 研究者"
  }
  
  const descriptions = {
    en: "Graduate student at Guangdong University of Technology specializing in Large Language Models, 3D Reconstruction, and Human-Computer Interaction. Researcher in AI-powered Smart Manufacturing.",
    zh: "广东工业大学硕士研究生，专注于大语言模型、3D重建和人机交互。AI驱动智能制造研究员。",
    ja: "広東工業大学大学院生。大規模言語モデル、3D再構成、ヒューマンコンピュータインタラクションを専門とし、AI駆動のスマート製造研究に従事。"
  }
  
  const currentTitle = titles[locale as keyof typeof titles] || titles.en
  const currentDescription = descriptions[locale as keyof typeof descriptions] || descriptions.en
  
  return {
    title: currentTitle,
    description: currentDescription,
    keywords: [
      "Keyou Zheng", "郑恪悠", "CV", "Resume", "研究生", "Graduate Student", 
      "Large Language Models", "大语言模型", "3D Reconstruction", "Smart Manufacturing",
      "Guangdong University of Technology", "广东工业大学", "AI Research"
    ],
    authors: [{ name: "Keyou Zheng" }],
    creator: "Keyou Zheng",
    publisher: "Keyou Zheng",
    generator: 'Next.js',
    robots: "index, follow",
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `/${loc}`])
      ),
    },
    openGraph: {
      title: currentTitle,
      description: currentDescription,
      type: "profile",
      locale: locale,
      alternateLocale: locales.filter((loc) => loc !== locale),
      siteName: "Keyou Zheng - Professional CV",
      images: [
        {
          url: "/avatar.png",
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
      images: ["/avatar.png"],
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
  params: { locale: string }
}) {
  const { locale } = params
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Get messages for the current locale
  const messages = await getMessages({ locale })
  
  // Get text direction for the locale
  const direction = getDirection(locale as Locale)

  return (
    <html lang={locale} dir={direction}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-noto-sans-sc">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <CVHeader />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
} 