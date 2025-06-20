import Image from "next/image"
import { MapPin, Cake, Mail, Globe, Github, Linkedin, Phone } from "lucide-react"

interface HeroSectionProps {
  data: {
    name: string
    enName: string
    avatar: string
    location: string
    age: number
    bio?: string
    social: {
      github?: string
      email?: string
      linkedin?: string
      website?: string
      phone?: string
    }
  }
}

export function HeroSection({ data }: HeroSectionProps) {
  // Extract usernames/IDs from social links
  const getGithubUsername = (url: string) => {
    return url.split("/").pop() || url
  }

  const getLinkedinUsername = (url: string) => {
    return url.split("/in/").pop() || url
  }

  return (
    <div className="relative bg-background print:bg-white border-b border-border print:border-b print:border-gray-300">
      <div className={`relative px-8 py-8 print:py-6 print:px-6 print:break-after-avoid ${!data.bio ? 'sm:py-6' : ''}`}>
        <div className="flex flex-row gap-8 sm:gap-10 items-center">
          <div className="shrink-0">
            <div className="relative">
              {/* Avatar with improved styling and error handling */}
              <div className="relative w-28 h-28 print:w-24 print:h-24 rounded-2xl overflow-hidden border-2 border-border print:border-gray-400 aspect-square bg-muted print:bg-gray-100">
                <Image
                  src={data.avatar || "/placeholder-user.jpg"}
                  alt={`${data.name} - ${data.enName}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 112px, 112px"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
              <h1 className={`text-3xl sm:text-4xl font-bold text-foreground print:text-black font-noto-serif-sc break-words ${!data.bio ? 'sm:text-3xl' : ''}`}>
                {data.name}
              </h1>
              <h2 className="text-muted-foreground print:text-gray-600 text-xl font-medium font-noto-serif-sc break-words">
                {data.enName}
              </h2>
            </div>

            {data.bio && (
              <p className="mt-3 text-foreground print:text-black max-w-2xl leading-relaxed text-base break-words">
                {data.bio}
              </p>
            )}

            <div className={`flex flex-wrap gap-x-6 gap-y-3 justify-start text-sm text-muted-foreground print:text-gray-600 ${data.bio ? 'mt-4' : 'mt-3'}`}>
              {data.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium break-words">{data.location}</span>
                </div>
              )}

              {data.age && (
                <div className="flex items-center gap-2">
                  <Cake className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{data.age}</span>
                </div>
              )}

              {/* Contact Information with improved styling */}
              {data.social.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium break-all">{data.social.phone}</span>
                </div>
              )}

              {data.social.email && (
                <a
                  href={`mailto:${data.social.email}`}
                  className="flex items-center gap-2 text-muted-foreground print:text-gray-600 hover:text-foreground print:hover:text-black transition-colors"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium break-all">{data.social.email}</span>
                </a>
              )}

              {data.social.github && (
                <a
                  href={data.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground print:text-gray-600 hover:text-foreground print:hover:text-black transition-colors"
                >
                  <Github className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium break-all">{getGithubUsername(data.social.github)}</span>
                </a>
              )}

              {data.social.linkedin && (
                <a
                  href={data.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground print:text-gray-600 hover:text-foreground print:hover:text-black transition-colors"
                >
                  <Linkedin className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium break-all">{getLinkedinUsername(data.social.linkedin)}</span>
                </a>
              )}

              {data.social.website && (
                <a
                  href={data.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground print:text-gray-600 hover:text-foreground print:hover:text-black transition-colors"
                >
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium break-all">{data.social.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
