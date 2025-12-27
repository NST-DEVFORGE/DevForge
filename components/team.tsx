"use client";

import { motion } from "framer-motion";

export function Team() {
    return (
        <section className="py-24 bg-gradient-to-b from-black via-neutral-950 to-black" id="team">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Meet the <span className="text-orange-500">Team</span>
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        The passionate individuals driving our community forward.
                    </p>
                </motion.div>

                {/* Team grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Team Member 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ y: -10 }}
                        className="group"
                    >
                        <div className="relative bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 overflow-hidden hover:border-orange-500/50 transition-all duration-300">
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative">
                                {/* Profile Image */}
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500/20 group-hover:border-orange-500/50 transition-all duration-300">
                                    <img
                                        src="/geetansh.jpg"
                                        alt="Geetansh Goyal"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name */}
                                <h3 className="text-2xl font-bold text-white text-center mb-2">
                                    Geetansh Goyal
                                </h3>

                                {/* Role */}
                                <p className="text-orange-500 font-semibold text-center mb-4">
                                    Club President
                                </p>

                                {/* Social Links */}
                                <div className="flex justify-center gap-4">
                                    <a
                                        href="https://github.com/geetxnshgoyal"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-400 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/geetanshgoyal"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-400 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Team Member 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        whileHover={{ y: -10 }}
                        className="group"
                    >
                        <div className="relative bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 overflow-hidden hover:border-orange-500/50 transition-all duration-300">
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative">
                                {/* Profile Image */}
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500/20 group-hover:border-orange-500/50 transition-all duration-300">
                                    <img
                                        src="/lay.png"
                                        alt="Lay Shah"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name */}
                                <h3 className="text-2xl font-bold text-white text-center mb-2">
                                    Lay Shah
                                </h3>

                                {/* Role */}
                                <p className="text-orange-500 font-semibold text-center mb-4">
                                    Event Coordinator
                                </p>

                                {/* Social Links */}
                                <div className="flex justify-center gap-4">
                                    <a
                                        href="https://github.com/Layyzyy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-400 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/lay-shah-0a777a380/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-400 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Team Member 3 - Vikas Sharma */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ y: -10 }}
                        className="group"
                    >
                        <div className="relative bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 overflow-hidden hover:border-orange-500/50 transition-all duration-300">
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative">
                                {/* Profile Image */}
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500/20 group-hover:border-orange-500/50 transition-all duration-300">
                                    <img
                                        src="/vikas.jpg"
                                        alt="Vikas Sharma"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name */}
                                <h3 className="text-2xl font-bold text-white text-center mb-2">
                                    Vikas Sharma
                                </h3>

                                {/* Role */}
                                <p className="text-orange-500 font-semibold text-center mb-4">
                                    Tech Lead
                                </p>

                                {/* Social Links */}
                                <div className="flex justify-center gap-4">
                                    <a
                                        href="https://github.com/sharmavikas18"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-400 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/vikassharma2007/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-400 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
