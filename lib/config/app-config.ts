export const appConfig = {
  site: {
    metadataBase: "https://keyzh.pages.dev",
    namesByLocale: {
      en: "Keyou Zheng - CV",
      zh: "郑恪悠 - 简历",
      ja: "郑恪悠 - 履歴書",
    } as const,
  },
  intl: {
    locales: ["en", "zh", "ja"] as const,
    defaultLocale: "zh" as const,
    localeLabels: {
      en: "English",
      zh: "中文",
      ja: "日本語",
    } as const,
  },
  cvData: {
    defaultTomlFilePath: "data/cv.toml",
    defaultSourceLocale: "en" as const,
    localizedTomlDir: "data",
    localizedTomlTemplate: "cv.{locale}.toml",
    fallbackLocale: "zh" as const,
  },
}

export type SupportedLocale = (typeof appConfig.intl.locales)[number]
