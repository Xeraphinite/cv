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
export const useSectionTranslations = () => useTypedTranslations('section')
export const useLabelTranslations = () => useTypedTranslations('label')
export const useActionTranslations = () => useTypedTranslations('action')

/**
 * General translations hook (fallback to next-intl)
 */
export const useTranslations = useNextIntlTranslations 