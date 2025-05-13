import { Award } from "lucide-react"

interface AwardItem {
  name: string
  institute: string
  date: string
  description?: string
}

interface AwardsSectionProps {
  data: AwardItem[]
}

export function AwardsSection({ data }: AwardsSectionProps) {
  if (!data || data.length === 0) return null

  return (
    <section className="print:break-inside-avoid-page">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Award className="h-5 w-5" />
        奖项
      </h2>

      <div className="space-y-2">
        {data.map((award, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{award.name}</span>
              <span className="text-gray-700">•</span>
              <span className="text-gray-700">{award.institute}</span>
            </div>
            <span className="text-sm text-gray-600">{award.date}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
