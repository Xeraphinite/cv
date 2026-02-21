import { CV } from "@/components/sections/cv"
import { getCVData, getCVLastUpdated } from "@/lib/load-cv-data"
import type { Locale } from "@/lib/types/cv"

export default async function Home({ 
  params
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeTyped = locale as Locale
  const cvData = await getCVData(localeTyped)
  const lastUpdated = await getCVLastUpdated(localeTyped)

  return (
    <main className="min-h-screen bg-background">
      <div className="flex justify-center p-0">
        <CV data={cvData} locale={locale} lastUpdated={lastUpdated} />
      </div>
    </main>
  )
}
