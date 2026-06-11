export interface HackathonWinner {
  id: string;
  hackathonName: string;
  year: string;
  position: "1st Place" | "2nd Place" | "3rd Place" | "Finalist" | "Special Mention";
  teamName: string;
  projectTitle: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl: string;
  photoUrl: string;
  members: { name: string; github: string }[];
}

export const hackathonWinners: HackathonWinner[] = [
  {
    id: "hack-3",
    hackathonName: "AI for a Drug-Free India",
    year: "2026",
    position: "1st Place",
    teamName: "Drug Free Nation",
    projectTitle: "AI Companion System",
    description: "Secured 1st Prize overall! Also won 1st Rank in TalkBot Arena, 1st Rank in Hack4Change, and 2nd Rank in Think Smart Say No (Short Film Making). Features include an AI Chat Support Agent, Live Audio Calling Assistance, and Live Video Interaction Support.",
    technologies: ["AI", "WebRTC", "React", "Node.js"],
    githubUrl: "https://github.com/dhiraj-143r",
    photoUrl: "/hackathon-new.jpg",
    members: [
      { name: "Dhiraj Rathod", github: "dhiraj-143r" },
      { name: "Shrishti Nagpure", github: "shrishti-nagpure" }
    ]
  },
  {
    id: "hack-4",
    hackathonName: "Ideathon",
    year: "2025",
    position: "1st Place",
    teamName: "Team",
    projectTitle: "Ideathon Winning Project",
    description: "Innovative solution presented at the Ideathon.",
    technologies: ["Next.js", "Tailwind CSS"],
    githubUrl: "https://github.com/dhiraj-143r",
    photoUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    members: [
      { name: "Dhiraj Rathod", github: "dhiraj-143r" },
      { name: "Lay Shah", github: "layshah" }
    ]
  },
  {
    id: "hack-5",
    hackathonName: "Ideathon",
    year: "2025",
    position: "2nd Place",
    teamName: "Innovators",
    projectTitle: "Ideathon Runner Up",
    description: "Excellent execution and creative solution.",
    technologies: ["React", "Firebase"],
    githubUrl: "https://github.com",
    photoUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    members: [
      { name: "Ananaya Chavan", github: "ananayachavan" },
      { name: "Sai Srijja", github: "saisrijja" }
    ]
  },
  {
    id: "hack-6",
    hackathonName: "Campfire Bengaluru",
    year: "2026",
    position: "1st Place",
    teamName: "Solo",
    projectTitle: "Campfire Winner",
    description: "First prize winning project at Campfire Bengaluru.",
    technologies: ["TypeScript", "Next.js"],
    githubUrl: "https://github.com/geetxnshgoyal",
    photoUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    members: [
      { name: "Geetansh Goyal", github: "geetxnshgoyal" }
    ]
  },
  {
    id: "hack-7",
    hackathonName: "Campfire Bengaluru",
    year: "2026",
    position: "3rd Place",
    teamName: "Solo",
    projectTitle: "Campfire Bronze",
    description: "Third prize winning project at Campfire Bengaluru.",
    technologies: ["Python", "Django"],
    githubUrl: "https://github.com/nishtha-agarwal-211",
    photoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    members: [
      { name: "Nishtha Agarwal", github: "nishtha-agarwal-211" }
    ]
  },
  {
    id: "hack-8",
    hackathonName: "CodeDay",
    year: "2026",
    position: "1st Place",
    teamName: "Team Alpha",
    projectTitle: "CodeDay Winner",
    description: "First prize winning team at CodeDay.",
    technologies: ["React", "Node.js"],
    githubUrl: "https://github.com/sharmavikas18",
    photoUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    members: [
      { name: "Vikas", github: "sharmavikas18" },
      { name: "Ashmita", github: "ashmita" },
      { name: "Abhay", github: "abhay" },
      { name: "Shristi", github: "shristi" }
    ]
  },
  {
    id: "hack-9",
    hackathonName: "CodeDay",
    year: "2026",
    position: "1st Place",
    teamName: "Team Beta",
    projectTitle: "CodeDay Co-Winner",
    description: "First prize winning team at CodeDay.",
    technologies: ["Python", "FastAPI"],
    githubUrl: "https://github.com/luvya",
    photoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    members: [
      { name: "Luvya", github: "luvya" },
      { name: "Dhruv", github: "dhruv" }
    ]
  },
  {
    id: "hack-10",
    hackathonName: "CodeDay",
    year: "2026",
    position: "1st Place",
    teamName: "Solo",
    projectTitle: "CodeDay Solo Winner",
    description: "First prize winning solo project at CodeDay.",
    technologies: ["Vue.js", "Firebase"],
    githubUrl: "https://github.com/dhiraj-143r",
    photoUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    members: [
      { name: "Dhiraj", github: "dhiraj-143r" }
    ]
  },
  {
    id: "hack-11",
    hackathonName: "CodeDay",
    year: "2026",
    position: "1st Place",
    teamName: "Team Gamma",
    projectTitle: "CodeDay Outstanding Project",
    description: "First prize winning team at CodeDay.",
    technologies: ["Next.js", "Tailwind CSS"],
    githubUrl: "https://github.com/geetxnshgoyal",
    photoUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    members: [
      { name: "Geetansh", github: "geetxnshgoyal" },
      { name: "Ravi", github: "ravi" },
      { name: "Prateek", github: "prateek" },
      { name: "Jothin", github: "jothin" }
    ]
  },
  {
    id: "hack-12",
    hackathonName: "CodeDay",
    year: "2026",
    position: "1st Place",
    teamName: "Team Delta",
    projectTitle: "CodeDay Innovation",
    description: "First prize winning team at CodeDay.",
    technologies: ["Angular", "Express"],
    githubUrl: "https://github.com/shaaz",
    photoUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    members: [
      { name: "Shaaz", github: "shaaz" },
      { name: "Archita", github: "archita" },
      { name: "Aryan", github: "aryan" }
    ]
  },
  {
    id: "hack-13",
    hackathonName: "DevForge",
    year: "2025",
    position: "1st Place",
    teamName: "Team DevForge",
    projectTitle: "DevForge Hackathon Winner",
    description: "Outstanding performance at DevForge Hackathon.",
    technologies: ["TypeScript", "React"],
    githubUrl: "https://github.com/archita",
    photoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    members: [
      { name: "Archita", github: "archita" },
      { name: "Aryan", github: "aryan" }
    ]
  }
];
