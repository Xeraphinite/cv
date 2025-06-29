import {getRequestConfig} from 'next-intl/server';

// Define the supported locales
export const locales = ['en', 'zh', 'yue', 'ja', 'ko'] as const;
export const defaultLocale = 'zh' as const;

// Type for the supported locales
export type Locale = (typeof locales)[number];

// Locale labels for display
export const localeLabels: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  yue: '粵語',
  ja: '日本語',
  ko: '한국어'
};

// Locale config with Next-intl
export default getRequestConfig(async ({locale}) => {
  // Ensure locale is defined and valid
  const resolvedLocale = locale || defaultLocale;
  
  // Validate that the resolved locale is valid
  if (!locales.includes(resolvedLocale as Locale)) {
    throw new Error(`Invalid locale: ${resolvedLocale}`);
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
}); 