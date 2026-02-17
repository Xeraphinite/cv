import { CV } from "@/components/sections/cv"
import { getCVData } from "@/lib/load-cv-data"
import type { Locale } from "@/lib/types/cv"

export default async function Home({ 
  params
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cvData = await getCVData(locale as Locale)

  return (
    <>
      {/* Preload critical images for better LCP */}
      <link
        rel="preload"
        as="image"
        href={cvData.hero.avatar}
        fetchPriority="high"
      />
      
      <main className="min-h-screen bg-background">
        <div className="flex justify-center p-0">
          <CV data={cvData} locale={locale} />
        </div>
      </main>
    </>
  )
}
