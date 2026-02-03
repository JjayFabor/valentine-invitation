import { motion } from "framer-motion";

const stats = [
    { label: "Days Together", value: "730+", delay: 0 },
    { label: "Coffees Shared", value: "∞", delay: 0.1 },
    { label: "Arguments Won by You", value: "100%", delay: 0.2 },
    { label: "Happiness Level", value: "Over 9000", delay: 0.3 },
];

export const StatsSlide = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-6 space-y-8">
            <motion.h2
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm"
            >
                The Data 📊
            </motion.h2>

            <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1), type: "spring", stiffness: 100 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex justify-between items-center p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
                    >
                        <span className="text-lg text-blue-100 font-medium">{stat.label}</span>
                        <span className="text-2xl font-black text-white drop-shadow-md">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xs text-gray-500 font-mono"
            >
                (Source: My Heart, 2025 • Margin of error: 0%)
            </motion.p>
        </div>
    );
};
