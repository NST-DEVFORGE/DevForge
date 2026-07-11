import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatTileProps {
    icon?: ReactNode;
    value: ReactNode;
    label: string;
    sublabel?: string;
    delay?: number;
    emphasized?: boolean;
}

export function StatTile({ icon, value, label, sublabel, delay = 0, emphasized = false }: StatTileProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className={`text-center p-5 rounded-2xl border backdrop-blur-sm ${
                emphasized
                    ? "bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-orange-500/50"
                    : "bg-neutral-900/50 border-neutral-800 hover:border-orange-500/30 transition-colors"
            }`}
        >
            {icon && <div className="flex justify-center mb-2">{icon}</div>}
            <div className="text-3xl font-black text-white mb-1 font-mono tabular-nums">{value}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">{label}</div>
            {sublabel && <div className="text-xs text-neutral-600 mt-1">{sublabel}</div>}
        </motion.div>
    );
}
