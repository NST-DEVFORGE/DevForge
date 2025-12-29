"use client";

import { Github, Linkedin, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="py-12 bg-black border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Branding */}
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Dev<span className="text-orange-500">Forge</span>
                        </h3>
                        <p className="text-neutral-500 text-sm">
                            © 2025 DevForge. Built by NST x SVYASA.
                        </p>
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/NST-DEVFORGE"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-orange-500/20 flex items-center justify-center transition-colors group"
                        >
                            <Github size={20} className="text-neutral-400 group-hover:text-orange-400 transition-colors" />
                        </a>

                        <a
                            href="https://linkedin.com/company/nstdevforge"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-orange-500/20 flex items-center justify-center transition-colors group"
                        >
                            <Linkedin size={20} className="text-neutral-400 group-hover:text-orange-400 transition-colors" />
                        </a>
                        <a
                            href="https://instagram.com/devforgeclub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-orange-500/20 flex items-center justify-center transition-colors group"
                        >
                            <Instagram size={20} className="text-neutral-400 group-hover:text-orange-400 transition-colors" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
