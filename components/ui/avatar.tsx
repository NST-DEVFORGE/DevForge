"use client";

interface AvatarProps {
    github?: string;
    src?: string;
    alt: string;
    size?: number;
    className?: string;
}

const FALLBACK = "/placeholder-avatar.jpg";

export function Avatar({ github, src, alt, size = 48, className = "" }: AvatarProps) {
    // Ordered candidates. Members carry a portal photo, which is preferred, but
    // it 404s for anyone not in the student roster — so GitHub still gets a turn
    // before the placeholder rather than being skipped on first error.
    const chain = [src, github ? `https://github.com/${github}.png` : undefined, FALLBACK].filter(
        Boolean,
    ) as string[];

    return (
        <img
            src={chain[0]}
            alt={alt}
            width={size}
            height={size}
            loading="lazy"
            className={`rounded-full object-cover flex-shrink-0 bg-white/5 ${className}`}
            style={{ width: size, height: size }}
            onError={(e) => {
                const next = chain[chain.indexOf(e.currentTarget.getAttribute("src") ?? "") + 1];
                if (next) e.currentTarget.src = next;
            }}
        />
    );
}
