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
    const resolvedSrc = src ?? (github ? `https://github.com/${github}.png` : FALLBACK);

    return (
        <img
            src={resolvedSrc}
            alt={alt}
            width={size}
            height={size}
            loading="lazy"
            className={`rounded-full object-cover flex-shrink-0 ${className}`}
            style={{ width: size, height: size }}
            onError={(e) => {
                if (!e.currentTarget.src.endsWith(FALLBACK)) {
                    e.currentTarget.src = FALLBACK;
                }
            }}
        />
    );
}
