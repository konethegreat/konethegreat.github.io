import { links } from "./profile"

export const education = [
  {
    title: "Diploma in Information Technology (NQF 6)",
    org: "Damelin",
    period: "February 2022 – December 2024",
    icon: "GraduationCap",
  },
  {
    title: "National Senior Certificate (Bachelor's Pass)",
    org: "Noorderland High School",
    period: "2020",
    icon: "School",
  },
] as const

export const ibmCertificate = {
  title: "IBM Full Stack Software Developer Professional Certificate",
  issuer: "IBM · Coursera",
  detail: "12 courses, completed",
  verify: links.ibmCert,
  capstone: "Full Stack Application Development Capstone Project",
  courses: [
    "Django Application Development with SQL and Databases",
    "Developing AI Applications with Python and Flask",
    "Python for Data Science, AI & Development",
    "Developing Back-End Apps with Node.js and Express",
    "Developing Front-End Apps with React",
    "Introduction to Software Engineering",
    "Introduction to Cloud Web Development",
    "Introduction to Cloud Computing",
    "Getting Started with Git and GitHub",
  ],
}

export const gaoCertificates = [
  "Certificate of Training in Tech Support",
  "Certificate of Training in Digital Marketing",
  "Certificate of Completion (Operational Excellence)",
]

export const leadership = [
  {
    title: "Assistant Squad Leader & Assistant Platoon Leader",
    org: "WILL Programme, GAO Tek",
    detail: "Led technical squads and mentored interns during the remote internship programme.",
  },
  {
    title: "Head Boy · Chess & Astronomy Captain",
    org: "Laerskool Soutpansberg",
    detail: "Fostered teamwork and event coordination across the school.",
  },
  {
    title: "Representative Council of Learners (RCL)",
    org: "Noorderland High School",
    detail: "Led the council and drove student initiatives.",
  },
]
