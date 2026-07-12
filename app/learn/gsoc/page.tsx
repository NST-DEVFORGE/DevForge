import Link from "next/link";
import { Sun, ArrowLeft, ExternalLink, AlertTriangle, Wrench, MessageSquareCode, ListChecks, BookOpen } from "lucide-react";

export const metadata = {
    title: "GSoC Playbook | DevForge",
    description: "Tools, prompts, and strategies that actually worked for students who got selected — no generic advice.",
};

const TIMELINE = [
    { date: "Feb 19, 2026", event: "Orgs announced", move: "Start contributing NOW" },
    { date: "Mar 16, 2026", event: "Proposal window opens", move: "Draft based on your contributions" },
    { date: "Mar 31, 2026", event: "DEADLINE", move: "Submit early for mentor feedback" },
    { date: "Apr 30, 2026", event: "Results", move: "Check your email" },
    { date: "Jun 2, 2026", event: "Coding starts", move: "Main work begins" },
];

const PROMPTS = [
    {
        title: "1 · Analyze accepted proposals",
        body: `Break down this accepted GSoC proposal into weekly contribution milestones and actionable tasks. Include:
- Pre-proposal contribution tasks (what to do before applying)
- Week-by-week coding milestones during the 12-week program
- Testing and documentation phases
- Stretch goals if ahead of schedule

[Paste accepted proposal from GitHub here]`,
    },
    {
        title: "2 · Understand any codebase fast",
        body: `Explore the code repository for [Organization Name] from three perspectives:
1. Software Architect: system design, architecture patterns, tech stack, data flow
2. Software Developer: code structure, key algorithms, dependencies, coding standards
3. Product Manager: core features, usability, alignment with project goals

After analysis, create a structured summary with:
- High-level architecture overview
- Key files and their purposes
- Contribution opportunities for a beginner
- Questions I should ask mentors`,
    },
    {
        title: "3 · Create your 12-week timeline",
        body: `Create a detailed 12-week GSoC timeline for this project goal: [Your Project Idea]

Break it down into:
- Community Bonding (Weeks 1-2): environment setup, codebase deep-dive, plan refinement
- Coding Phase 1 (Weeks 3-6): key features and milestones
- Mid-term Evaluation (Week 7): clear deliverable
- Coding Phase 2 (Weeks 8-11): remaining features, integration, testing
- Final Week (Week 12): code cleanup, documentation, final submission

For each week, specify: concrete deliverables, potential blockers, mentor check-in points`,
    },
    {
        title: "4 · Learn a new tech stack in 2 weeks",
        body: `Act as a personalized learning coach. I want to learn [Technology/Framework] for my GSoC project.

Current knowledge: [e.g., "Beginner with basic Python knowledge"]
Time available: [e.g., "10 hours per week"]
Learning style: [e.g., "Hands-on, project-based"]
Goal: [e.g., "Build a REST API and contribute to a GSoC project using Django"]

Create a learning plan with:
1. Skill tree breakdown (prerequisites and core concepts)
2. Week-by-week roadmap with milestones
3. Curated resources matching my learning style
4. Practice exercises for each topic
5. A real-world mini-project to solidify learning`,
    },
    {
        title: "5 · Write better documentation",
        body: `Generate a comprehensive README.md for this code:

[Paste your code]

Include:
1. Project title and description
2. Installation instructions
3. Usage examples with code blocks
4. API documentation (if applicable)
5. Potential security vulnerabilities
6. Contributing guidelines`,
    },
    {
        title: "6 · Code-review yourself",
        body: `Conduct a thorough code review of this [Language] code. Focus on:
- Code quality and readability
- Performance optimizations
- Security vulnerabilities (SQL injection, XSS, etc.)
- Best practices for [Language/Framework]
- Maintainability and SOLID/DRY principles

For each issue found, provide:
1. Problem explanation
2. Why it matters
3. Specific fix with code example

Code:
[Paste your code]`,
    },
];

const MISTAKES = [
    ["Apply last minute", "Start 3 months early"],
    ["Do no homework", "Read ALL the docs first"],
    ["ChatGPT your proposal", "Write in YOUR voice"],
    ["Zero contributions", "Submit 2-3 PRs minimum"],
    ["Be inflexible", "Accept feedback gracefully"],
    ["Apply and disappear", "Stay active even if rejected"],
    ["Don't try again", "Many succeed on attempt #2"],
    ["Argue with mentors", "Respect their experience"],
];

export default function GsocPlaybookPage() {
    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/learn" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-cyan-300 transition-colors mb-8">
                    <ArrowLeft size={14} /> Learning Tracks
                </Link>

                <div className="mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <Sun size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        The GSoC <span className="text-cyan-400">Playbook</span>
                    </h1>
                    <p className="text-lg text-neutral-400">
                        Tools, prompts, and strategies that actually worked for students who got selected. No generic advice.
                    </p>
                </div>

                {/* Reality check */}
                <section className="mb-12">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-red-400 font-bold">
                            <AlertTriangle size={18} /> The reality check (2025 numbers)
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-3xl font-black font-mono tabular-nums text-white">15,240</div>
                                <div className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Applicants</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black font-mono tabular-nums text-white">1,272</div>
                                <div className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Selected</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black font-mono tabular-nums text-red-400">8.3%</div>
                                <div className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Acceptance</div>
                            </div>
                        </div>
                        <p className="text-sm text-neutral-400 mt-4">This isn&apos;t a participation-trophy program. You need a strategy.</p>
                    </div>
                </section>

                {/* Timeline */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">GSoC 2026 timeline</h2>
                    <div className="overflow-x-auto border border-neutral-800 rounded-2xl">
                        <table className="w-full text-sm min-w-[480px]">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">What happens</th>
                                    <th className="px-4 py-3">Your move</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TIMELINE.map((row) => (
                                    <tr key={row.date} className="border-b border-neutral-800/60 last:border-b-0">
                                        <td className="px-4 py-3 font-mono text-cyan-300 whitespace-nowrap">{row.date}</td>
                                        <td className="px-4 py-3 text-white font-medium">{row.event}</td>
                                        <td className="px-4 py-3 text-neutral-400">{row.move}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Toolkit */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Wrench size={20} className="text-cyan-400" /> The actual toolkit</h2>
                    <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                            <h3 className="font-bold text-white mb-2">Code & development</h3>
                            <p><b className="text-white">VS Code / Cursor</b> with GitLens, Prettier, ESLint, Live Share, and the GitHub Pull Requests extension. <b className="text-white">GitHub Copilot is free for students</b> (normally $10/month). <b className="text-white">GitHub CLI</b>: <code className="bg-white/5 px-1.5 py-0.5 rounded text-cyan-200 font-mono text-xs">gh pr create --fill</code> and <code className="bg-white/5 px-1.5 py-0.5 rounded text-cyan-200 font-mono text-xs">gh issue list --label &quot;good first issue&quot;</code>. GitKraken is free for open source.</p>
                        </div>
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                            <h3 className="font-bold text-white mb-2">Notes & proposal writing</h3>
                            <p><b className="text-white">Notion</b> (free for students) for a contribution tracker with checkboxes. <b className="text-white">Obsidian</b> for research notes. <b className="text-white">Overleaf</b> for the proposal itself — a polished LaTeX proposal stands out from generic Google Docs; use Docs only for quick mentor-feedback drafts.</p>
                        </div>
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                            <h3 className="font-bold text-white mb-2">Communication</h3>
                            <p>Discord/Slack for modern projects; IRC (HexChat or IRCCloud) for older ones like Mozilla and Apache. Use a professional email address for official communication.</p>
                        </div>
                    </div>
                </section>

                {/* Prompts */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><MessageSquareCode size={20} className="text-cyan-400" /> Power prompts</h2>
                    <p className="text-sm text-neutral-500 mb-4">Copy-paste ready. Find accepted proposals to feed prompt 1 at the archives linked in Resources below.</p>
                    <div className="space-y-3">
                        {PROMPTS.map((prompt) => (
                            <details key={prompt.title} className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden group">
                                <summary className="px-5 py-4 cursor-pointer font-semibold text-white hover:text-cyan-300 transition-colors list-none flex items-center justify-between">
                                    {prompt.title}
                                    <span className="text-neutral-600 text-xs group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <pre className="px-5 pb-5 text-xs text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">{prompt.body}</pre>
                            </details>
                        ))}
                    </div>
                </section>

                {/* 5-step formula */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ListChecks size={20} className="text-cyan-400" /> The 5-step formula</h2>
                    <ol className="space-y-4">
                        {[
                            ["Choose your organization (Nov–Dec)", "Filter gsocorganizations.dev by YOUR tech stack. Pick 2-3 orgs max, check they participated in past years, and prefer orgs whose software you already use — genuine interest shows."],
                            ["Study winning proposals (Dec–Jan)", "Read the GitHub proposal archives. Look at timeline structure, technical depth, and how they showed prior contributions."],
                            ["Start contributing (Jan–Feb)", "The ladder: week 1, set the project up locally (many quit here). Week 2, fix a docs typo. Week 3, take a good-first-issue. Week 4+, land 2-3 meaningful PRs. Track everything."],
                            ["Write your proposal (Mar 1–15)", "Title & synopsis → benefits to community → week-by-week timeline → technical design → related work → about you. Submit a draft to a mentor by Mar 10 for feedback."],
                            ["The waiting game (Apr)", "Keep contributing, keep building relationships, prepare for the coding phase. Activity during the wait gets noticed."],
                        ].map(([title, body], i) => (
                            <li key={title} className="flex gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                                <span className="text-2xl font-black font-mono text-cyan-400 flex-shrink-0">{i + 1}</span>
                                <div>
                                    <h3 className="font-bold text-white mb-1">{title}</h3>
                                    <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-4 bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-5 text-sm text-neutral-300">
                        <b className="text-cyan-300">Late start?</b> One selected student began just 2 months before the deadline: picked a less-crowded org (OWASP/Django), learned the stack fast, and kept constant mentor communication. Less competition beats more polish.
                    </div>
                </section>

                {/* Mistakes */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Top 8 mistakes (from actual mentors)</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {MISTAKES.map(([mistake, fix]) => (
                            <div key={mistake} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-sm">
                                <div className="text-red-400 font-semibold mb-1">✗ {mistake}</div>
                                <div className="text-green-400">→ {fix}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Resources */}
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BookOpen size={20} className="text-cyan-400" /> Essential resources</h2>
                    <ul className="space-y-2 text-sm">
                        {[
                            ["SVYASA GSoC tracker (club spreadsheet)", "https://docs.google.com/spreadsheets/d/1TmjLl1CwRliVcsFDIwUlvKB5aw5UxMBI5FHwEneMWcU/edit?usp=sharing"],
                            ["Official: GSoC 2026", "https://summerofcode.withgoogle.com/programs/2026"],
                            ["Official student guide", "https://google.github.io/gsocguides/student"],
                            ["Org finder: gsocorganizations.dev", "https://gsocorganizations.dev"],
                            ["Accepted proposals archive (2025, 42 proposals)", "https://github.com/SammanSarkar/GSoC_archive_2025"],
                            ["Accepted proposals archive (COPS IIT-BHU, 100+)", "https://github.com/COPS-IITBHU/GSoC-Accepted-Proposals"],
                            ["Community: r/gsoc", "https://www.reddit.com/r/gsoc/"],
                        ].map(([label, url]) => (
                            <li key={url}>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-neutral-300 hover:text-cyan-300 transition-colors">
                                    <ExternalLink size={14} className="text-neutral-600 flex-shrink-0" /> {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
