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
  /** Projects and milestones the student is most proud of, in their own words. */
  milestones?: string[];
  /** Their advice to juniors who are just starting, in their own words. */
  advice?: string;
  testimonials: { author: string; text: string }[];
  videos: { title: string; url: string; platform: 'youtube' | 'other' }[];
}

export const studentsData: StudentProfile[] = [
  {
    slug: "sahitya",
    name: "Sahitya Singh",
    role: "Google Summer of Code (GSoC)",
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
  },
  {
    slug: "abhijit",
    name: "Abhijit Saha",
    role: "Frontend Builder · Early Open Source",
    organizations: [],
    photo: "https://github.com/AbhijitSaha-coder.png",
    githubUrl: "https://github.com/AbhijitSaha-coder",
    linkedinUrl: "https://www.linkedin.com/in/abhijit-saha-211621379",
    journey: "My development journey started after joining Newton School of Technology. Before college, I had very limited exposure to programming, but once I started learning Python and web development, I became curious about how real applications are built. Joining the Dev Club and interacting with seniors inspired me to explore open source, build projects, and continuously improve my skills. What motivates me the most is the idea of creating things that people can actually use while constantly learning something new.",
    learnings: [
      "Failure is simply feedback — not every pull request gets merged, and each setback highlights what to improve.",
      "Consistency matters more than perfection.",
      "Asking questions or seeking guidance is much better than staying stuck.",
      "Master the fundamentals instead of trying to learn too many technologies at once.",
      "Focus on your own progress instead of comparing yourself with others."
    ],
    milestones: [
      "Built multiple frontend projects, including a Netflix clone and RedMart, an Instamart-inspired website.",
      "Developed an Automatic Pill Dispenser prototype as part of a robotics project.",
      "Made my first open-source contributions and raised pull requests on public GitHub repositories.",
      "Became an active member of the Dev Club and started contributing to club initiatives.",
      "Progressed from having little development experience to confidently working with Git, GitHub, HTML, CSS, JavaScript, and Python."
    ],
    advice: "Don't compare your beginning with someone else's years of experience. Focus on building strong fundamentals, create projects instead of only watching tutorials, and don't hesitate to ask for help. Join communities like the Dev Club, participate in open source early, and stay consistent. Progress may seem slow at first, but every small project, bug fix, and contribution adds up over time. The most important thing is to keep learning and never stop building. 🚀",
    testimonials: [],
    videos: []
  }
];
