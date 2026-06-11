export interface StudentProfile {
  slug: string;
  name: string;
  role: string;
  organizations: string[];
  photo: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  journey: string;
  learnings: string[];
  testimonials: { author: string; text: string }[];
  videos: { title: string; url: string; platform: 'youtube' | 'other' }[];
}

export const studentsData: StudentProfile[] = [
  {
    slug: "sahitya",
    name: "Sahitya Singh",
    role: "Google Summer of Code (GSoC) '24",
    organizations: ["Google", "GirlScript Foundation"],
    photo: "/sahitya-placeholder.jpg",
    githubUrl: "https://github.com/Sahitya0805",
    linkedinUrl: "https://www.linkedin.com/in/sahitya-singh-7012b137b/",
    journey: "My journey into open source began with small contributions, leading to my acceptance into the prestigious Google Summer of Code program. I spent the summer diving deep into complex codebases and collaborating with some of the best minds in the industry.",
    learnings: [
      "Communication is just as important as writing clean code.",
      "Don't be afraid to ask questions; the community is there to help.",
      "Read the documentation thoroughly before diving into the codebase.",
      "Break down complex problems into smaller, manageable tasks."
    ],
    testimonials: [
      { author: "Kaustav Sir", text: "Sahitya demonstrated exceptional dedication and technical prowess during his GSoC journey." }
    ],
    videos: [
      { title: "Journey to GSoC (Interview)", url: "https://youtube.com/embed/placeholder1", platform: "youtube" },
      { title: "Open Source Learnings", url: "https://youtube.com/embed/placeholder2", platform: "youtube" }
    ]
  },
  {
    slug: "nithyaraj",
    name: "Nithyaraj",
    role: "Zulip Core Contributor & GSSoC Top Achiever",
    organizations: ["Zulip", "GirlScript Foundation"],
    photo: "/nithyaraj-placeholder.jpg",
    githubUrl: "https://github.com/nithyarajmudhaliyar",
    linkedinUrl: "https://linkedin.com",
    journey: "I started contributing to Zulip to learn more about large-scale Python and TypeScript projects. My consistent contributions earned me a top spot in GSSoC and invaluable experience.",
    learnings: [
      "Understanding large codebases takes time and patience.",
      "Writing tests is crucial for open source contributions.",
      "Code reviews are the best way to learn."
    ],
    testimonials: [],
    videos: []
  },
  {
    slug: "ahristi",
    name: "Ahristi",
    role: "Open Source Advocate",
    organizations: ["CNCF", "GirlScript Foundation"],
    photo: "/ahristi-placeholder.jpg",
    githubUrl: "https://github.com/Ahristi",
    linkedinUrl: "https://linkedin.com",
    journey: "Navigating the Cloud Native landscape was daunting at first, but through structured programs like GSSoC, I was able to make meaningful contributions to CNCF projects.",
    learnings: [
      "Cloud native technologies are built on community collaboration.",
      "Documentation is often the best first contribution.",
      "Consistency beats intensity in open source."
    ],
    testimonials: [],
    videos: []
  },
  {
    slug: "dhiraj",
    name: "Dhiraj Rathod",
    role: "Frontend Specialist & GSSoC Mentor",
    organizations: ["Mozilla", "GirlScript Foundation"],
    photo: "/dhiraj-placeholder.jpg",
    githubUrl: "https://github.com/dhiraj-143r",
    linkedinUrl: "https://linkedin.com",
    journey: "Focusing on frontend technologies, I contributed significantly to user interfaces for various open source tools during GSSoC.",
    learnings: [
      "Accessibility is not an afterthought in open source.",
      "Reviewing PRs teaches you as much as submitting them.",
      "Community feedback shapes better products."
    ],
    testimonials: [],
    videos: []
  }
];
