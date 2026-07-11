import { ReactNode } from "react";
import { GitMerge, GitPullRequest, XCircle } from "lucide-react";

type PRState = "merged" | "open" | "closed";

const STATE_STYLES: Record<PRState, string> = {
    merged: "bg-green-500/20 text-green-400",
    open: "bg-yellow-500/20 text-yellow-400",
    closed: "bg-red-500/20 text-red-400",
};

const STATE_ICON: Record<PRState, ReactNode> = {
    merged: <GitMerge className="w-3.5 h-3.5" />,
    open: <GitPullRequest className="w-3.5 h-3.5" />,
    closed: <XCircle className="w-3.5 h-3.5" />,
};

export function PRStateBadge({ state }: { state: PRState }) {
    return (
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-medium ${STATE_STYLES[state]}`}>
            {STATE_ICON[state]}
            {state.charAt(0).toUpperCase() + state.slice(1)}
        </span>
    );
}

interface BadgeProps {
    children: ReactNode;
    variant?: "ember" | "steel" | "neutral";
}

const VARIANT_STYLES = {
    ember: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    steel: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    neutral: "bg-white/5 text-neutral-300 border-white/10",
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${VARIANT_STYLES[variant]}`}>
            {children}
        </span>
    );
}
