import { Camera, Mail } from "lucide-react";
import { memories, uncaptionedPhotoCount } from "@/data/memories";

export const metadata = {
    title: "Memory Lane | DevForge",
    description: "The club's history, chronologically, in real photos.",
};

export default function MemoryLanePage() {
    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <Camera size={32} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        Memory <span className="text-cyan-400">Lane</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Real moments, with the story behind them — not just a photo dump.
                    </p>
                </div>

                <div className="space-y-6 mb-12">
                    {memories.map((memory) => (
                        <div key={memory.photo} className="bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-hidden md:flex">
                            <img src={memory.photo} alt={memory.title} className="w-full md:w-72 h-56 md:h-auto object-cover" />
                            <div className="p-6 flex flex-col justify-center">
                                <span className="text-xs text-cyan-300 font-semibold uppercase tracking-wider mb-2">{memory.date}</span>
                                <h3 className="text-xl font-bold text-white mb-2">{memory.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">{memory.story}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center bg-neutral-900/30 border border-dashed border-neutral-800 rounded-3xl p-10">
                    <p className="text-neutral-300 mb-2">
                        There are {uncaptionedPhotoCount} more real photos sitting in the project already, waiting on a caption.
                    </p>
                    <p className="text-neutral-500 text-sm mb-6">
                        If you were there and know the event and date, help us caption them instead of us guessing.
                    </p>
                    <a
                        href="mailto:devclub@nst.edu?subject=Memory%20Lane%20caption"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-xl transition-colors"
                    >
                        <Mail size={18} /> Caption a photo
                    </a>
                </div>
            </div>
        </div>
    );
}
