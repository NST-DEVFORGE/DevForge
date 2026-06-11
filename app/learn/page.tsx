"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, Users, Lightbulb, CheckCircle2, ChevronRight } from "lucide-react";

export default function EducationalHub() {
    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-orange-500 selection:text-black pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4">
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 text-blue-500 rounded-full mb-8 border border-blue-500/20">
                        <BookOpen size={32} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Hub</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Your ultimate guide to understanding open source, major programs, and how to make your very first contribution.
                    </p>
                </motion.div>

                <div className="space-y-32">
                    {/* What is Open Source */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-8 flex items-center gap-4">
                            <Lightbulb className="text-yellow-500" />
                            What is Open Source?
                        </h2>
                        <div className="bg-neutral-900/50 p-8 rounded-3xl border border-neutral-800 text-lg text-neutral-300 leading-relaxed mb-8">
                            Open source software is code that is designed to be publicly accessible—anyone can see, modify, and distribute the code as they see fit. It is built by decentralized, collaborative communities.
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: "Transparency", desc: "Anyone can inspect the code to ensure it's secure and does exactly what it claims." },
                                { title: "Collaboration", desc: "Global communities work together to solve problems and add features." },
                                { title: "Free & Accessible", desc: "It lowers the barrier to entry, allowing anyone to learn and build." }
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-neutral-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* GSoC vs GSSoC */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -z-10 group-hover:bg-blue-500/20 transition-colors" />
                            <h2 className="text-3xl font-bold mb-6 text-white">Google Summer of Code (GSoC)</h2>
                            <p className="text-neutral-400 mb-6">
                                A global program focused on bringing new contributors into open source software development. Contributors spend their summer writing code under the guidance of mentors.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="text-blue-500" size={20} /> Stipend provided</li>
                                <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="text-blue-500" size={20} /> Highly competitive</li>
                                <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="text-blue-500" size={20} /> 12+ weeks duration</li>
                            </ul>
                            <a href="https://summerofcode.withgoogle.com/" target="_blank" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300">
                                Official Website <ChevronRight size={16} />
                            </a>
                        </div>

                        <div className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 p-8 rounded-3xl relative overflow-hidden group hover:border-orange-500/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-[100px] -z-10 group-hover:bg-orange-500/20 transition-colors" />
                            <h2 className="text-3xl font-bold mb-6 text-white">GirlScript Summer of Code (GSSoC)</h2>
                            <p className="text-neutral-400 mb-6">
                                A 3-month long open source program conducted every summer by GirlScript Foundation. It is extremely beginner-friendly and helps thousands start their journey.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="text-orange-500" size={20} /> Beginner Friendly</li>
                                <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="text-orange-500" size={20} /> Leaderboard system</li>
                                <li className="flex items-center gap-3 text-neutral-300"><CheckCircle2 className="text-orange-500" size={20} /> Massive community</li>
                            </ul>
                            <a href="https://gssoc.girlscript.tech/" target="_blank" className="inline-flex items-center gap-2 text-orange-400 font-bold hover:text-orange-300">
                                Official Website <ChevronRight size={16} />
                            </a>
                        </div>
                    </motion.section>

                    {/* Roadmap */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-12 flex items-center gap-4 text-center justify-center">
                            <Map className="text-green-500" />
                            Contribution Roadmap
                        </h2>
                        
                        <div className="relative border-l-2 border-neutral-800 ml-4 md:ml-0 md:border-none space-y-12 md:space-y-0">
                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-neutral-800 hidden md:block" />
                            
                            {[
                                { step: 1, title: "Learn Git & GitHub", desc: "Understand commits, branches, forks, and pull requests." },
                                { step: 2, title: "Find a Project", desc: "Look for 'good first issue' or 'help wanted' labels on GitHub." },
                                { step: 3, title: "Communicate", desc: "Always ask to be assigned before working on an issue." },
                                { step: 4, title: "Code & Review", desc: "Write clean code, submit your PR, and be open to feedback." },
                            ].map((item, i) => (
                                <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group w-full ${i !== 0 ? 'md:mt-12' : ''}`}>
                                    <div className="hidden md:flex w-5/12" />
                                    
                                    <div className="absolute left-[-29px] md:static w-14 h-14 bg-black border-4 border-neutral-800 rounded-full flex items-center justify-center text-xl font-bold z-10 group-hover:border-green-500 group-hover:text-green-500 transition-colors md:mx-auto">
                                        {item.step}
                                    </div>
                                    
                                    <div className="w-[calc(100%-3rem)] md:w-5/12 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl group-hover:border-green-500/50 transition-colors ml-4 md:ml-0">
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-neutral-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                </div>
            </div>
        </div>
    );
}
