"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X } from "lucide-react";
import { RepoPicker } from "./repo-picker";
import { AuthError } from "@/components/auth/auth-field";
import type { Project } from "@/lib/projects";

interface ProjectFormProps {
    /** Absent when creating. */
    project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
    const router = useRouter();
    const editing = Boolean(project);

    const [repoUrl, setRepoUrl] = useState(project?.repoUrl ?? "");
    const [demoUrl, setDemoUrl] = useState(project?.demoUrl ?? "");
    const [tech, setTech] = useState<string[]>(project?.tech ?? []);
    const [techDraft, setTechDraft] = useState("");
    const [collabLimit, setCollabLimit] = useState(
        project?.collaboratorLimit == null ? "" : String(project.collaboratorLimit),
    );
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    function addTech() {
        const value = techDraft.trim();
        if (!value || tech.includes(value) || tech.length >= 12) {
            setTechDraft("");
            return;
        }
        setTech([...tech, value]);
        setTechDraft("");
    }

    async function submit(event: React.FormEvent<HTMLFormElement>, status: "draft" | "published") {
        event.preventDefault();
        setPending(true);
        setError(null);

        const form = new FormData(event.currentTarget);
        const payload = {
            title: form.get("title"),
            tagline: form.get("tagline"),
            description: form.get("description"),
            tech,
            repoUrl: repoUrl || undefined,
            demoUrl: demoUrl || undefined,
            status,
            collaboratorLimit: collabLimit.trim() === "" ? null : Number(collabLimit),
        };

        try {
            const response = await fetch(
                editing ? `/api/projects/${project!.id}` : "/api/projects",
                {
                    method: editing ? "PATCH" : "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                },
            );
            const body = await response.json();
            if (!response.ok) {
                setError(body.message ?? "Couldn't save the project.");
                return;
            }
            router.push("/dashboard/projects");
            router.refresh();
        } catch {
            setError("Couldn't reach the server. Check your connection.");
        } finally {
            setPending(false);
        }
    }

    async function remove() {
        if (!confirm(`Delete "${project!.title}"? This can't be undone.`)) return;
        setPending(true);
        try {
            await fetch(`/api/projects/${project!.id}`, { method: "DELETE" });
            router.push("/dashboard/projects");
            router.refresh();
        } finally {
            setPending(false);
        }
    }

    return (
        <form
            onSubmit={(e) => submit(e, (e.nativeEvent as SubmitEvent).submitter?.dataset.status === "published" ? "published" : "draft")}
            className="glass-strong rounded-3xl p-8 space-y-6"
        >
            <Field label="Title" name="title" defaultValue={project?.title} required placeholder="What's it called?" />
            <Field
                label="Tagline"
                name="tagline"
                defaultValue={project?.tagline}
                required
                placeholder="One line on what it does"
                hint="Shown on the project card. Keep it short."
            />

            <div>
                <label htmlFor="description" className={FIELD_LABEL}>
                    Description
                </label>
                <div className={FIELD_SURFACE}>
                    <textarea
                        id="description"
                        name="description"
                        rows={5}
                        defaultValue={project?.description}
                        placeholder="What problem does it solve? What did you learn building it?"
                        className={`${FIELD_INPUT} resize-y`}
                    />
                </div>
            </div>

            <RepoPicker value={repoUrl} onChange={setRepoUrl} onDemoUrl={(url) => !demoUrl && setDemoUrl(url)} />

            <Field
                label="Live demo"
                name="demoUrl"
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://your-project.vercel.app"
                hint="Optional. Filled in automatically if your repo has a homepage set."
            />

            <Field
                label="Collaborators wanted"
                name="collaboratorLimit"
                type="number"
                min={0}
                max={50}
                value={collabLimit}
                onChange={(e) => setCollabLimit(e.target.value)}
                placeholder="Open — no limit"
                hint="How many teammates you'll take. Blank = open, 0 = not looking. Members request to join once it's published."
            />

            <div>
                <label htmlFor="tech" className={FIELD_LABEL}>
                    Tech used
                </label>
                <div className={FIELD_SURFACE}>
                    <input
                        id="tech"
                        value={techDraft}
                        onChange={(e) => setTechDraft(e.target.value)}
                        onKeyDown={(e) => {
                            // Enter would otherwise submit the whole form.
                            if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTech();
                            }
                        }}
                        onBlur={addTech}
                        placeholder={tech.length >= 12 ? "That's plenty" : "Next.js, Firestore… press Enter"}
                        disabled={tech.length >= 12}
                        className={FIELD_INPUT}
                    />
                </div>
                {tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {tech.map((item) => (
                            <span
                                key={item}
                                className="inline-flex items-center gap-1.5 text-xs bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 rounded-full px-2.5 py-1"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => setTech(tech.filter((t) => t !== item))}
                                    aria-label={`Remove ${item}`}
                                    className="hover:text-white transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <AuthError message={error} />

            <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                    type="submit"
                    data-status="published"
                    disabled={pending}
                    className="bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold text-sm rounded-xl px-6 py-3 transition-colors"
                >
                    {pending ? "Saving…" : "Publish"}
                </button>
                <button
                    type="submit"
                    data-status="draft"
                    disabled={pending}
                    className="glass-subtle hover:border-cyan-400/40 disabled:opacity-50 text-neutral-300 hover:text-white text-sm rounded-xl px-5 py-3 transition-colors"
                >
                    Save as draft
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={remove}
                        disabled={pending}
                        className="ml-auto inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={15} />
                        Delete
                    </button>
                )}
            </div>
        </form>
    );
}

/**
 * Shares AuthField's surface treatment: glass-subtle with an outline focus
 * ring, and neutral-400 text. Anything dimmer fails AA against this card —
 * neutral-500 measures 3.5:1 where 4.5:1 is needed.
 */
const FIELD_SURFACE =
    "flex items-center gap-2 glass-subtle !rounded-xl focus-within:outline focus-within:outline-2 focus-within:outline-cyan-400/50 px-4 py-3 transition-colors";
const FIELD_LABEL = "block text-xs uppercase tracking-wider text-neutral-400 mb-2";
const FIELD_INPUT =
    "bg-transparent outline-none w-full text-sm text-white placeholder:text-neutral-400";
const FIELD_HINT = "text-xs text-neutral-400 mt-2";

function Field({
    label,
    hint,
    ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
    return (
        <div>
            <label htmlFor={input.name} className={FIELD_LABEL}>
                {label}
            </label>
            <div className={FIELD_SURFACE}>
                <input {...input} id={input.name} className={FIELD_INPUT} />
            </div>
            {hint && <p className={FIELD_HINT}>{hint}</p>}
        </div>
    );
}
