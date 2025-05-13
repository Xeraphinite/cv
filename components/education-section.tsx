import { CalendarRange, GraduationCap } from "lucide-react"

interface Education {
  institution: string
  area: string
  degree: string
  startDate: string
  endDate: string
  summary?: string
  highlights: string[]
  supervisor?: string
}

interface EducationSectionProps {
  data: Education[]
}

export function EducationSection({ data }: EducationSectionProps) {
  if (!data || data.length === 0) return null

  return (
    <section className="print:break-inside-avoid-page">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <GraduationCap className="h-5 w-5" />
        教育经历
      </h2>

      <div className="space-y-3">
        {data.map((education, index) => (
          <div key={`${education.institution}-${education.degree}-${index}`} className="print:break-inside-avoid">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div className="flex flex-row gap-x-2">
                <span className="font-semibold text-gray-900">{education.institution}</span>
                <span className="text-gray-700">{education.degree} {education.area} </span>
                {education.supervisor && (
                  <span className="text-gray-600">• <span className="font-semibold">指导老师: </span>{education.supervisor}</span>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                <CalendarRange className="h-4 w-4 mr-1" />
                <span>
                  {education.startDate} - {education.endDate || "Present"}
                </span>
              </div>
            </div>

            {education.summary && <p className="mt-1 text-gray-700">{education.summary}</p>}

            {education.highlights && education.highlights.length > 0 && (
              <ul className="mt-1 list-[circle] pl-5 text-sm p-1 text-gray-700">
                {education.highlights.map((highlight, idx) => (
                  <li key={`${education.institution}-highlight-${idx}`}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
