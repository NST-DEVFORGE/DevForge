import { WifiOff } from "lucide-react";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-transparent text-white pt-32 pb-16">
            <div className="max-w-md mx-auto px-4 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                    <WifiOff size={28} />
                </div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">
                    You&rsquo;re <span className="text-cyan-400">offline</span>
                </h1>
                <p className="text-neutral-400">
                    DevForge needs a connection to load your dashboard. This page will work again
                    the moment you&rsquo;re back.
                </p>
            </div>
        </div>
    );
}
