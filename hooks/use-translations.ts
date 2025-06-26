import { useTranslations as useNextIntlTranslations } from 'next-intl'

/**
 * Type-safe translations hook for different namespaces
 */
export function useTypedTranslations(namespace: string) {
  return useNextIntlTranslations(namespace)
}

/**
 * Convenience hooks for specific namespaces
 */
export const useCommonTranslations = () => useTypedTranslations('common')
export const useNavigationTranslations = () => useTypedTranslations('navigation')
export const useSectionTranslations = () => useTypedTranslations('sections')
export const useLabelTranslations = () => useTypedTranslations('labels')
export const useActionTranslations = () => useTypedTranslations('actions')
export const useContentTranslations = () => useTypedTranslations('content')

/**
 * General translations hook (fallback to next-intl)
 */
export const useTranslations = useNextIntlTranslations 