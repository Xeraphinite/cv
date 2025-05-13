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
    <div className={`bg-gray-100 px-6 py-6 print:py-4 mb-6 print:break-after-avoid ${!data.bio ? 'sm:py-5' : ''}`}>
      <div className="flex flex-row gap-5 sm:gap-6 items-center">
        <div className="shrink-0">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-[3px] border-white shadow-md aspect-square">
            <Image
              src={data.avatar || "/placeholder.svg?height=128&width=128"}
              alt={data.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex-1 text-left">
          <div className="flex flex-row gap-3 items-baseline">
            <h1 className={`text-2xl font-black text-gray-800 font-noto-serif-sc ${!data.bio ? 'sm:text-2xl' : ''}`}>
              {data.name}
            </h1>
            <h2 className="text-gray-600 text-lg font-bold font-noto-serif-sc mt-0.5 sm:mt-0">
              {data.enName}
            </h2>
          </div>

          {data.bio && (
            <p className="mt-2.5 text-gray-700 max-w-2xl leading-relaxed">
              {data.bio}
            </p>
          )}

          <div className={`flex flex-wrap gap-x-4 gap-y-1.5 justify-start text-sm text-gray-600 ${data.bio ? 'mt-3.5' : 'mt-2.5'}`}>
            {data.location && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{data.location}</span>
              </div>
            )}

            {data.age && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <Cake className="h-4 w-4 text-gray-500" />
                <span>{data.age}</span>
              </div>
            )}

            {/* Contact Information */}
            {data.social.phone && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{data.social.phone}</span>
              </div>
            )}

            {data.social.email && (
              <a
                href={`mailto:${data.social.email}`}
                className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{data.social.email}</span>
              </a>
            )}

            {data.social.github && (
              <a
                href={data.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Github className="h-4 w-4 text-gray-500" />
                <span>{getGithubUsername(data.social.github)}</span>
              </a>
            )}

            {data.social.linkedin && (
              <a
                href={data.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="h-4 w-4 text-gray-500" />
                <span>{getLinkedinUsername(data.social.linkedin)}</span>
              </a>
            )}

            {data.social.website && (
              <a
                href={data.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Globe className="h-4 w-4 text-gray-500" />
                <span>{data.social.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
