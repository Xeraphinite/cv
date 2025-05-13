import { MapPin, CalendarRange, Briefcase } from "lucide-react"

interface Experience {
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string
  summary: string
  highlights: string[]
}

interface ExperienceSectionProps {
  data: Experience[]
}

export function ExperienceSection({ data }: ExperienceSectionProps) {
  if (!data || data.length === 0) return null

  return (
    <section className="print:break-inside-avoid-page">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Briefcase className="h-5 w-5" />
        研究经历
      </h2>

      <div className="space-y-3">
        {data.map((experience) => (
          <div
            key={`${experience.company}-${experience.position}-${experience.startDate}`}
            className="print:break-inside-avoid"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{experience.position}</h3>
                  <span>{experience.company}</span>
                  {experience.location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{experience.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 whitespace-nowrap">
                <CalendarRange className="h-4 w-4 mr-1" />
                <span>
                  {experience.startDate} - {experience.endDate || "Present"}
                </span>
              </div>
            </div>

            {experience.summary && <p className="mt-1 font-semibold text-gray-700">{experience.summary}</p>}

            {experience.highlights && experience.highlights.length > 0 && (
              <ul className="mt-1 list-[circle] pl-5 text-sm text-gray-600">
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
