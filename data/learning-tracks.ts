export interface LearnNode {
    title: string;
    type: "concept" | "lecture" | "resource" | "milestone";
    description?: string;
    url?: string;
    presenter?: string;
}

export interface LearnModule {
    title: string;
    nodes: LearnNode[];
}

export interface LearnTrack {
    slug: string;
    title: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    description: string;
    modules: LearnModule[];
}

export const learningTracks: LearnTrack[] = [
    {
        slug: "fundamentals",
        title: "Computer Fundamentals",
        level: "Beginner",
        description: "The must-know questions. If you can answer all of these, you actually understand the machine you code on.",
        modules: [
            {
                title: "The Machine",
                nodes: [
                    { title: "What is this machine?", type: "concept", description: "CPU, RAM, storage — what each one does and why you run out of them." },
                    { title: "How do I talk to it without clicking?", type: "concept", description: "The shell: pwd, ls, cd." },
                    { title: "Where does my stuff live?", type: "concept", description: "Files, paths, hidden files, extensions." },
                    { title: "What is a file, really?", type: "concept", description: "Plain text, nano, VS Code." },
                    { title: "What is my machine doing right now?", type: "concept", description: "The OS, processes, force quit." },
                    { title: "Why does \"command not found\" happen?", type: "concept", description: "Permissions, PATH, environment variables." },
                    { title: "How do I become faster on this machine?", type: "concept", description: "Piping, grep, shortcuts, man pages." },
                    { title: "How do I make my machine do work for me?", type: "concept", description: "Scripts, Homebrew, automation, runtimes." },
                ],
            },
            {
                title: "Working With AI",
                nodes: [
                    { title: "How do I have a useful conversation with AI?", type: "concept", description: "Probing, follow-ups." },
                    { title: "How do I know when AI is lying?", type: "concept", description: "Hallucinations, doubt, checking the docs." },
                    { title: "What is AI actually doing when it responds?", type: "concept", description: "Tokens, context window, models." },
                    { title: "How do I think through AI, not just ask it?", type: "concept", description: "Prompting, system prompts, API calls." },
                    { title: "Language exploration with AI", type: "concept", description: "Use AI to learn an unfamiliar programming language hands-on." },
                    { title: "Technology exploration with AI", type: "concept", description: "Use AI to map an unfamiliar technology before diving in." },
                    { title: "Repo exploration with AI", type: "concept", description: "Use AI to navigate an unfamiliar codebase — see also the blog post on reading codebases." },
                ],
            },
            {
                title: "How Computers Think",
                nodes: [
                    { title: "How does a computer count?", type: "concept", description: "Binary, encoding, ASCII, UTF-8." },
                    { title: "How does a computer decide?", type: "concept", description: "Boolean logic, conditions, comparisons." },
                ],
            },
            {
                title: "Networks & The Web",
                nodes: [
                    { title: "How does my machine find another machine?", type: "concept", description: "IP, ports, DNS." },
                    { title: "What happens when I type a URL?", type: "concept", description: "HTTP, status codes, HTTPS, curl." },
                    { title: "What's on the other side?", type: "concept", description: "Servers, clients, request-response, localhost." },
                    { title: "How do machines talk without humans?", type: "concept", description: "APIs, JSON, packages, frameworks." },
                    { title: "What does a website look like underneath?", type: "concept", description: "View source, HTML, DevTools." },
                ],
            },
            {
                title: "Code, Breakage & Sharing",
                nodes: [
                    { title: "What is software and what happens when it breaks?", type: "concept", description: "Source code, interpreted languages, errors, stack traces." },
                    { title: "How do I undo a mistake?", type: "concept", description: "git, commits, history, diff, branches." },
                    { title: "How do I share my work?", type: "concept", description: "GitHub, push/pull, README, Markdown." },
                    { title: "You can answer every question above", type: "milestone" },
                ],
            },
        ],
    },
    {
        slug: "open-source",
        title: "Open Source",
        level: "Beginner",
        description: "How the club actually gets people from zero to a merged PR — the same content that used to live alone on this page.",
        modules: [
            {
                title: "Foundations",
                nodes: [
                    {
                        title: "What is Open Source?",
                        type: "concept",
                        description:
                            "Open source software is code designed to be publicly accessible — anyone can see, modify, and distribute it. It's built by decentralized, collaborative communities: transparent, collaborative, and free to learn from.",
                    },
                    {
                        title: "Getting Started with Open Source",
                        type: "lecture",
                        presenter: "Sahitya Singh",
                        description: "A DevForge session covering GSoC, GSSoC, and the open-source ecosystem.",
                    },
                    {
                        title: "GSoC vs GSSoC",
                        type: "concept",
                        description:
                            "GSoC: Google's global program, stipend-based, highly competitive, 12+ weeks. GSSoC: GirlScript's 3-month program, beginner-friendly, leaderboard-driven, massive community.",
                        url: "/learn",
                    },
                ],
            },
            {
                title: "First Contribution",
                nodes: [
                    { title: "Learn Git & GitHub", type: "resource", url: "https://docs.github.com/en/get-started", description: "Commits, branches, forks, pull requests." },
                    { title: "Find a Project", type: "concept", description: "Look for 'good first issue' or 'help wanted' labels." },
                    { title: "Communicate", type: "concept", description: "Ask to be assigned before working on an issue." },
                    { title: "Code & Review", type: "concept", description: "Write clean code, submit your PR, be open to feedback." },
                    { title: "Your first merged PR", type: "milestone" },
                ],
            },
        ],
    },
    {
        slug: "web-development",
        title: "Web Development",
        level: "Beginner",
        description: "From HTML basics to a shipped project.",
        modules: [
            {
                title: "Foundations",
                nodes: [
                    {
                        title: "Web Development Bootcamp",
                        type: "lecture",
                        presenter: "Unnati Jaiswal",
                        description: "A DevForge session on building full-stack applications from scratch.",
                    },
                    { title: "The Odin Project — Foundations", type: "resource", url: "https://www.theodinproject.com/paths/foundations" },
                    { title: "MDN Web Docs", type: "resource", url: "https://developer.mozilla.org/en-US/docs/Learn" },
                ],
            },
            {
                title: "Build",
                nodes: [
                    { title: "freeCodeCamp — Responsive Web Design", type: "resource", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
                    { title: "Ship your first project", type: "milestone" },
                ],
            },
        ],
    },
    {
        slug: "ai-ml",
        title: "AI / ML",
        level: "Intermediate",
        description: "Models, data, and the math underneath, without skipping the fundamentals.",
        modules: [
            {
                title: "Foundations",
                nodes: [
                    {
                        title: "AI & Machine Learning 101",
                        type: "lecture",
                        presenter: "Sujan YD",
                        description: "A DevForge introduction to ML models and data science.",
                    },
                    { title: "CS50's Introduction to AI with Python", type: "resource", url: "https://cs50.harvard.edu/ai/" },
                    { title: "Kaggle Learn — Intro to Machine Learning", type: "resource", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
                ],
            },
        ],
    },
    {
        slug: "dsa",
        title: "DSA",
        level: "Intermediate",
        description: "Data structures and algorithms, for interviews and for actually writing better code.",
        modules: [
            {
                title: "Practice",
                nodes: [
                    { title: "NeetCode 150", type: "resource", url: "https://neetcode.io/practice" },
                    { title: "LeetCode", type: "resource", url: "https://leetcode.com/" },
                ],
            },
        ],
    },
    {
        slug: "system-design",
        title: "System Design",
        level: "Advanced",
        description: "How large systems are actually put together.",
        modules: [
            {
                title: "Fundamentals",
                nodes: [
                    { title: "System Design Primer", type: "resource", url: "https://github.com/donnemartin/system-design-primer" },
                    { title: "ByteByteGo", type: "resource", url: "https://bytebytego.com/" },
                ],
            },
        ],
    },
    {
        slug: "devops",
        title: "DevOps",
        level: "Intermediate",
        description: "Containers, orchestration, and shipping code reliably.",
        modules: [
            {
                title: "Fundamentals",
                nodes: [
                    { title: "Docker — Get Started", type: "resource", url: "https://docs.docker.com/get-started/" },
                    { title: "Kubernetes Basics", type: "resource", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
                    { title: "roadmap.sh — DevOps", type: "resource", url: "https://roadmap.sh/devops" },
                ],
            },
        ],
    },
];
