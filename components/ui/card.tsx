import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hover?: boolean;
}

export function Card({ children, hover = true, className = "", ...rest }: CardProps) {
    return (
        <div
            className={`relative bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl overflow-hidden ${
                hover ? "transition-all duration-300 hover:border-cyan-400/50" : ""
            } ${className}`}
            {...rest}
        >
            {hover && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
            <div className="relative">{children}</div>
        </div>
    );
}
