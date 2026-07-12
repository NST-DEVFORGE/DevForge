import { GraduationCap, Mail } from "lucide-react";
import { alumniEntries } from "@/data/alumni";

export const metadata = {
    title: "Alumni | DevForge",
    description: "Where DevForge alumni ended up.",
};

export default function AlumniPage() {
    const companies = Array.from(new Set(alumniEntries.map((a) => a.currentCompany))).sort();

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <GraduationCap size={32} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        <span className="text-cyan-400">Alumni</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Where former members ended up.
                    </p>
                </div>

                {alumniEntries.length === 0 ? (
                    <div className="text-center bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 max-w-xl mx-auto">
                        <p className="text-neutral-300 text-lg mb-3">
                            Nothing here yet — on purpose.
                        </p>
                        <p className="text-neutral-500 mb-8">
                            We don't have a real graduate record to show, and we'd rather leave this
                            page empty than fill it with placeholder names. If you're a DevForge alum,
                            tell us where you landed and we'll add you.
                        </p>
                        <a
                            href="mailto:devclub@nst.edu?subject=Alumni%20entry"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-xl transition-colors"
                        >
                            <Mail size={18} /> Add yourself
                        </a>
                    </div>
                ) : (
                    <>
                        {companies.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mb-12">
                                {companies.map((c) => (
                                    <span key={c} className="text-sm px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {alumniEntries.map((alum) => (
                                <div key={alum.name} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center">
                                    <img src={alum.photo} alt={alum.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border border-neutral-700" />
                                    <h3 className="font-bold text-white">{alum.name}</h3>
                                    <p className="text-sm text-cyan-300">{alum.currentRole} · {alum.currentCompany}</p>
                                    <p className="text-xs text-neutral-500 mt-1">Class of {alum.gradYear}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
