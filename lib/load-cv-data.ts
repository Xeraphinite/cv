import fs from "node:fs/promises"
import path from "node:path"
import yaml from "js-yaml"

export async function getCVData(locale = "zh") {
  try {
    const filePath = path.join(process.cwd(), "data", `cv.${locale}.yaml`);
    const fileContents = await fs.readFile(filePath, "utf8")
    const data = yaml.load(fileContents)
    return data
  } catch (error) {
    console.error("Error loading CV data:", error)
    // Return sample data if file doesn't exist or has errors
    return getSampleData()
  }
}

function getSampleData() {
  return {
    hero: {
      name: "王德凯",
      avatar: "/placeholder.svg?height=128&width=128",
      location: "San Francisco, CA",
      age: 32,
      bio: "Experienced software engineer with a passion for building scalable web applications and machine learning systems.",
      social: {
        github: "https://github.com/johndoe",
        email: "john.doe@example.com",
        linkedin: "https://linkedin.com/in/johndoe",
        website: "https://johndoe.com",
      },
    },
    experience: [
      {
        company: "Tech Solutions Inc.",
        position: "Senior Software Engineer",
        location: "San Francisco, CA",
        startDate: "Jan 2020",
        endDate: "Present",
        summary: "Leading the development of cloud-based solutions for enterprise clients.",
        highlights: [
          "Architected and implemented a microservices-based platform that improved system reliability by 40%",
          "Led a team of 5 engineers in delivering critical features on time and under budget",
          "Introduced automated testing practices that reduced bug reports by 30%",
        ],
      },
      {
        company: "Innovative Startup",
        position: "Full Stack Developer",
        location: "Austin, TX",
        startDate: "Mar 2017",
        endDate: "Dec 2019",
        summary: "Developed and maintained web applications for the healthcare industry.",
        highlights: [
          "Built a patient management system used by over 50 clinics nationwide",
          "Implemented secure data handling practices compliant with HIPAA regulations",
          "Optimized database queries resulting in 60% faster page load times",
        ],
      },
    ],
    education: [
      {
        institution: "Stanford University",
        area: "Computer Science",
        degree: "Master of Science",
        startDate: "Sep 2015",
        endDate: "Jun 2017",
        summary: "Focused on machine learning and distributed systems.",
        highlights: [
          "GPA: 3.9/4.0",
          "Teaching Assistant for Introduction to Machine Learning",
          "Recipient of the Outstanding Graduate Student Award",
        ],
      },
      {
        institution: "University of California, Berkeley",
        area: "Computer Engineering",
        degree: "Bachelor of Science",
        startDate: "Sep 2011",
        endDate: "May 2015",
        summary: "Graduated with honors.",
        highlights: [
          "GPA: 3.8/4.0",
          "President of the Computer Science Club",
          "Completed senior thesis on efficient algorithms for graph processing",
        ],
      },
    ],
    publications: [
      {
        title: "Efficient Deep Learning for Mobile Applications",
        authors: ["John Doe", "Jane Smith", "Robert Johnson"],
        type: "Conference Paper",
        status: "Published",
        highlight: true,
        involved: true,
        journal: "International Conference on Mobile Computing 2022",
        doi: "10.1145/1234567.8901234",
        url: "https://example.com/paper1",
      },
      {
        title: "A Survey of Distributed Systems for Big Data Processing",
        authors: ["Jane Smith", "John Doe", "Michael Brown"],
        type: "Journal Article",
        status: "Published",
        highlight: false,
        involved: true,
        journal: "Journal of Distributed Computing, Vol. 45",
        doi: "10.1109/JDC.2021.1234567",
        url: "https://example.com/paper2",
      },
    ],
    awards: [
      {
        name: "Outstanding Research Award",
        institute: "Tech Solutions Inc.",
        date: "Dec 2022",
        description: "Recognized for exceptional contributions to the field of distributed systems.",
      },
      {
        name: "Best Paper Award",
        institute: "International Conference on Mobile Computing",
        date: "Oct 2022",
        description: "Awarded for the paper 'Efficient Deep Learning for Mobile Applications'.",
      },
      {
        name: "Innovation Excellence Award",
        institute: "Innovative Startup",
        date: "Nov 2019",
        description: "Recognized for developing novel healthcare solutions.",
      },
    ],
    skills: {
      categories: ["Programming", "Research", "Communication"],
      skills: [
        {
          name: "JavaScript/TypeScript",
          category: "Programming",
          description: "Expert level with 7+ years of experience",
        },
        {
          name: "Python",
          category: "Programming",
          description: "Advanced level with 5+ years of experience",
        },
        {
          name: "React",
          category: "Programming",
          description: "Built multiple production applications",
        },
        {
          name: "Node.js",
          category: "Programming",
          description: "Developed scalable backend services",
        },
        {
          name: "PostgreSQL",
          category: "Programming",
          description: "Designed efficient database schemas",
        },
        {
          name: "MongoDB",
          category: "Programming",
          description: "Experience with document-based data modeling",
        },
        {
          name: "TensorFlow",
          category: "Research",
          description: "Built and deployed ML models",
        },
        {
          name: "Team Leadership",
          category: "Communication",
          description: "Led teams of up to 8 engineers",
        },
      ],
    },
  }
}
