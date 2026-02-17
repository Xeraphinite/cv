import {getRequestConfig} from 'next-intl/server';
import { appConfig, type SupportedLocale } from '@/lib/config/app-config'

// Define the supported locales
export const locales = appConfig.intl.locales
export const defaultLocale = appConfig.intl.defaultLocale

// Type for the supported locales
export type Locale = SupportedLocale

// Locale labels for display
export const localeLabels: Record<Locale, string> = appConfig.intl.localeLabels

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
