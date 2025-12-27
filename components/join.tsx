"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, Users } from "lucide-react";

export function Join() {
    return (
        <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden" id="join">
            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    {/* Heading */}
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Ready to <span className="text-orange-500">Join?</span>
                    </h2>
                    <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
                        Become part of DevForge, NST x SVYASA's thriving developer community.
                        Whether you're a beginner or an expert, there's a place for you here.
                    </p>

                    {/* CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glow-border p-8 md:p-12 max-w-2xl mx-auto"
                    >
                        <Users className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Join Our Community
                        </h3>
                        <p className="text-neutral-400 mb-8">
                            Connect with us on Discord or reach out via email to get started.
                        </p>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://discord.gg/devclub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={20} />
                                Join Discord
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a
                                href="mailto:devclub@nst.edu"
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium text-lg rounded-xl border border-white/10 transition-colors backdrop-blur-sm flex items-center justify-center gap-2"
                            >
                                <Mail size={20} />
                                Email Us
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
