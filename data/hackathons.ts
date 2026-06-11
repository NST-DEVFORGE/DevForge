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
    teamName: "Solo",
    projectTitle: "Ideathon Winning Project",
    description: "Innovative solution presented at the Ideathon.",
    technologies: ["Next.js", "Tailwind CSS"],
    githubUrl: "https://github.com/dhiraj-143r",
    photoUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    members: [
      { name: "Dhiraj Rathod", github: "dhiraj-143r" }
    ]
  }
];
