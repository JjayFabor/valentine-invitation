import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Toaster } from "sonner";
import { ProposalScene } from "../scene/ProposalScene";
import { DatePlanSlide } from "./DatePlanSlide";

export const ProposalSlide = () => {
    const [accepted, setAccepted] = useState(false);
    const [showPlan, setShowPlan] = useState(false);

    const handleYes = () => {
        setAccepted(true);
        // Fire confetti
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        // Show plan after a delay
        setTimeout(() => {
            setShowPlan(true);
        }, 3000);
    };

    if (showPlan) {
        return <DatePlanSlide />;
    }

    return (
        <div className="w-full h-full relative overflow-hidden">
            <ProposalScene />

            <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 space-y-12 pointer-events-none">
                {!accepted ? (
                    <>
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-center space-y-4"
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-center leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-white">
                                Will you be my<br />
                                <span className="text-pink-500 text-6xl md:text-8xl filter drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">Valentine?</span>
                            </h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm md:text-base text-gray-300 italic"
                            >
                                (Psst... there's no "No" button. You have no choice but to say yes! 😉)
                            </motion.p>
                        </motion.div>

                        <div className="flex gap-6 items-center justify-center w-full relative h-[100px] pointer-events-auto">
                            <motion.button
                                whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(236, 72, 153, 0.6)" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-4 px-10 rounded-full shadow-lg text-2xl z-20 transition-all border border-pink-400/30 backdrop-blur-md"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent slide navigation
                                    handleYes();
                                }}
                            >
                                YES! 💕
                            </motion.button>
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-6"
                    >
                        <h2 className="text-8xl animate-bounce">💖</h2>
                        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-lg">
                            YAY! I knew it!
                        </h3>
                        <p className="text-xl text-white/80">Loading our date plan...</p>
                    </motion.div>
                )}
            </div>
            <Toaster position="top-center" />
        </div>
    );
};
