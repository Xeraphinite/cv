import { CV } from "@/components/sections/cv"
import { getCVData } from "@/lib/load-cv-data"
import type { Locale } from "@/lib/types/cv"
import Link from "next/link"

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
      <Link
        rel="preload"
        as="image"
        href={cvData.hero.avatar}
        priority
      />
      
      <main className="min-h-screen bg-background print:bg-white">
        <div className="flex justify-center p-6 print:p-0">
          <CV data={cvData} />
        </div>
      </main>
    </>
  )
} 