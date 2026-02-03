import { motion } from "framer-motion";

export const IntroSlide = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-8 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10"
            >
                <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm">
                    2025 Wrapped
                </h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 bg-gradient-to-r from-pink-500 to-indigo-500 mx-auto mt-2 rounded-full"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="max-w-[600px] space-y-4 z-10"
            >
                <p className="text-xl md:text-2xl font-light text-gray-200">
                    It's been quite a year...
                </p>
                <p className="text-lg text-gray-400">
                    Ready to see your highlights?
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 text-sm text-gray-400 animate-pulse"
            >
                Tap right to continue →
            </motion.div>

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]" />
            </div>
        </div>
    );
};
