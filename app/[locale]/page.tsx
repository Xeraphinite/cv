import { CV } from "@/components/cv"
import { getCVData } from "@/lib/load-cv-data"

export default async function Home({ 
  params
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cvData = await getCVData(locale)

  return (
    <main className="min-h-screen bg-background print:bg-white">
      <div className="flex justify-center p-6 print:p-0">
        <CV data={cvData} />
      </div>
    </main>
  )
} 