"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavGroup } from "@/components/ui/nav-group";
import { ThemeSwitcher } from "@/components/theme-switcher";

const programLinks = [
    { name: "GSoC", href: "/gsoc" },
    { name: "GSSoC Hall of Fame", href: "/gssoc" },
    { name: "ESoC", href: "/esoc" },
];

const communityLinks = [
    { name: "Journey", href: "/journey" },
    { name: "Members", href: "/members" },
    { name: "Rewards", href: "/rewards" },
    { name: "Alumni", href: "/alumni" },
    { name: "Memory Lane", href: "/memory-lane" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Open Source", href: "/opensource" },
        { name: "Projects", href: "/projects" },
        { name: "Hackathons", href: "/hackathons" },
        { name: "Conferences", href: "/conferences" },
        { name: "Dev Club", href: "/club" },
        { name: "Learn", href: "/learn" },
        { name: "Blog", href: "/blog" },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <img
                        src="/logo.png"
                        alt="DevForge Logo"
                        className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-200 [filter:hue-rotate(160deg)_saturate(1.2)]"
                    />
                    <span className="text-xl font-bold tracking-tight text-white">Dev<span className="text-cyan-400">Forge</span></span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
                    {navLinks.slice(0, 1).map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    isActive
                                    ? 'bg-cyan-400/10 text-cyan-400'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                    <NavGroup label="Community" items={communityLinks} />
                    <NavGroup label="Programs" items={programLinks} />
                    {navLinks.slice(1).map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    isActive
                                    ? 'bg-cyan-400/10 text-cyan-400'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-3">
                    <ThemeSwitcher />
                    <Link href="https://forms.gle/M8rDS4wG1jyuGiSC6" target="_blank" className="hidden md:inline-flex px-5 py-2 bg-white text-black font-bold text-sm rounded-full hover:bg-neutral-200 transition-colors">
                        Join Us
                    </Link>
                    
                    <button
                        className="lg:hidden text-white p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-nav"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        id="mobile-nav"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-6 flex flex-col gap-4">
                            {navLinks.slice(0, 1).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-lg font-medium px-4 py-3 rounded-xl ${
                                        pathname === link.href
                                        ? 'bg-cyan-400/10 text-cyan-400'
                                        : 'text-neutral-400'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">Community</div>
                            {communityLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-lg font-medium px-4 py-3 rounded-xl ${
                                        pathname === link.href
                                        ? 'bg-cyan-400/10 text-cyan-400'
                                        : 'text-neutral-400'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">Programs</div>
                            {programLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-lg font-medium px-4 py-3 rounded-xl ${
                                        pathname === link.href
                                        ? 'bg-cyan-400/10 text-cyan-400'
                                        : 'text-neutral-400'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {navLinks.slice(1).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-lg font-medium px-4 py-3 rounded-xl ${
                                        pathname === link.href
                                        ? 'bg-cyan-400/10 text-cyan-400'
                                        : 'text-neutral-400'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
