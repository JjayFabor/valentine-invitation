import { useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast, Toaster } from "sonner";
import { useSmartEvasion } from "../../hooks/useSmartEvasion";

export const ProposalSlide = () => {
    const noBtnRef = useRef<HTMLButtonElement>(null);
    const [accepted, setAccepted] = useState(false);
    const [noBtnScale, setNoBtnScale] = useState(1);

    // Evasion logic
    const { position, evade } = useSmartEvasion(noBtnRef, !accepted);

    const handleYes = () => {
        setAccepted(true);
        // Fire confetti
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-12 relative z-50">
            {!accepted ? (
                <>
                    <h1 className="text-4xl font-black text-center leading-tight drop-shadow-xl">
                        Will you be my<br />
                        <span className="text-pink-500 text-6xl">Valentine?</span>
                    </h1>

                    <div className="flex gap-4 items-center justify-center w-full relative h-[100px]">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-xl z-20 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent slide navigation
                                handleYes();
                            }}
                        >
                            YES!
                        </motion.button>

                        {noBtnScale > 0 && (
                            <motion.button
                                ref={noBtnRef}
                                initial={{ scale: 1 }}
                                animate={{
                                    x: position.x,
                                    y: position.y,
                                    scale: noBtnScale
                                }}
                                transition={{
                                    default: { type: "spring", stiffness: 400, damping: 20 },
                                    scale: { duration: 0.2, type: "tween", ease: "easeInOut" }
                                }}
                                className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 px-8 rounded-full shadow-lg text-xl absolute"
                                style={{
                                    position: 'absolute',
                                    right: '20%' // Initial position
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setNoBtnScale(prev => Math.max(0, prev - 0.2));

                                    if (noBtnScale > 0.2) {
                                        toast.error(
                                            noBtnScale <= 0.4 ? "Almost gone! 👻" : "Nice try! 😉 You have to say YES!",
                                            {
                                                style: {
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    backdropFilter: 'blur(10px)',
                                                    color: 'white',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                                }
                                            }
                                        );
                                    }
                                }}
                                onTouchStart={() => {
                                    // On mobile, "hover" doesn't exist. We dodge when they try to tap.
                                    evade();
                                }}
                            >
                                No
                            </motion.button>
                        )}
                        <Toaster position="top-center" />
                    </div>
                </>
            ) : (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-4"
                >
                    <h2 className="text-6xl">💖💖💖</h2>
                    <h3 className="text-3xl font-bold">See you on the 14th!</h3>
                </motion.div>
            )}
        </div>
    );
};
