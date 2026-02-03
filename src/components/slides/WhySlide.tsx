import { motion } from "framer-motion";

export const WhySlide = () => {
    return (
        <div className="flex flex-col justify-center h-full p-8 space-y-6 text-left relative overflow-hidden">
            <motion.h2
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-pink-500 drop-shadow-md"
            >
                Why You?
            </motion.h2>

            <motion.div
                className="prose prose-invert text-gray-200 text-lg leading-relaxed space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.3 } }
                }}
            >
                <motion.p
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                >
                    Because you make even the boring days feel like an adventure.
                    <span className="text-gray-400 text-sm block mt-1">(And you let me pick the music in the car... usually.)</span>
                </motion.p>

                <motion.p
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                >
                    You're my favorite notification, my best teammate, and the only person I'd share my fries with.
                </motion.p>

                <motion.p
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="font-bold text-xl text-white bg-white/5 p-4 rounded-lg border-l-4 border-pink-500 backdrop-blur-sm"
                >
                    "Life is just better when you're around."
                </motion.p>
            </motion.div>
        </div>
    );
};
