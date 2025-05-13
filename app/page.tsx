import { CV } from "@/components/cv"
import { getCVData } from "@/lib/load-cv-data"

export default async function Home() {
  const cvData = await getCVData()

  return (
    <main className="flex min-h-screen justify-center bg-gray-100 p-4 print:bg-white print:p-0">
      <CV data={cvData} />
    </main>
  )
}
