export const appConfig = {
  site: {
    metadataBase: "https://keyzh.pages.dev",
    namesByLocale: {
      en: "Keyou Zheng - CV",
      zh: "郑恪悠 - 简历",
      yue: "鄭恪悠 - 履歷",
      ja: "郑恪悠 - 履歴書",
      ko: "정커유 - 이력서",
    } as const,
  },
  intl: {
    locales: ["en", "zh", "yue", "ja", "ko"] as const,
    defaultLocale: "zh" as const,
    localeLabels: {
      en: "English",
      zh: "中文",
      yue: "粵語",
      ja: "日本語",
      ko: "한국어",
    } as const,
  },
  cvData: {
    source: "toml" as const,
    tomlFilePath: "data/cv.toml",
    fallbackYamlDir: "data",
    fallbackYamlTemplate: "cv.{locale}.yaml",
    fallbackLocale: "zh" as const,
  },
}

export type SupportedLocale = (typeof appConfig.intl.locales)[number]
