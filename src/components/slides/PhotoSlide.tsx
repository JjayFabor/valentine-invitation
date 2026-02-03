import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop",
        caption: "Remember our first date? 🌹"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1522673607200-1645062cd95ed?q=80&w=2070&auto=format&fit=crop",
        caption: "That time we got lost... 🗺️"
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1516589178581-a70d6efd42a6?q=80&w=1972&auto=format&fit=crop",
        caption: "Best vacation ever! 🏖️"
    }
];

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
        rotate: direction > 0 ? 10 : -10
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        rotate: 0
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
        rotate: direction < 0 ? 10 : -10
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

export const PhotoSlide = () => {
    const [[page, direction], setPage] = useState([0, 0]);

    // We only have 3 photos, so we wrap around
    const imageIndex = Math.abs(page % PHOTOS.length);

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6 overflow-hidden">
            <h2 className="text-2xl font-bold text-pink-400 drop-shadow-md">Memory Lane</h2>

            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            rotate: { duration: 0.4 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(_, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute w-full h-full bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 cursor-grab active:cursor-grabbing"
                    >
                        <img
                            src={PHOTOS[imageIndex].url}
                            alt="Memory"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-4">
                            <p className="text-white font-medium text-lg italic">
                                "{PHOTOS[imageIndex].caption}"
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                    className="absolute left-2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full text-white transition-colors"
                    onClick={() => paginate(-1)}
                >
                    ◀
                </button>
                <button
                    className="absolute right-2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full text-white transition-colors"
                    onClick={() => paginate(1)}
                >
                    ▶
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex gap-2 justify-center">
                {PHOTOS.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${idx === imageIndex ? "bg-pink-500" : "bg-gray-600"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
