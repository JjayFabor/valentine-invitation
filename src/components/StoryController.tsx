import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Import slides (placeholders for now) (We will create these next)
import { IntroSlide } from "./slides/IntroSlide";
import { PhotoSlide } from "./slides/PhotoSlide";
import { StatsSlide } from "./slides/StatsSlide";
import { WhySlide } from "./slides/WhySlide";
import { ProposalSlide } from "./slides/ProposalSlide";

const SLIDES = [
    IntroSlide,
    PhotoSlide,
    StatsSlide,
    WhySlide,
    ProposalSlide,
];

export const StoryController = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for back, 1 for next
    const [selectedMovie, setSelectedMovie] = useState<any>(null);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            setDirection(1);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const CurrentSlide = SLIDES[currentIndex];

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <div
            className="w-full h-full flex flex-col relative overflow-hidden bg-black/20 text-white"
        >
            {/* Subtle gradient overlay for depth over the whole screen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0" />

            <div className="relative z-10 w-full h-full flex flex-col pt-safe-top pb-safe-bottom">
                <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col justify-center">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                const swipe = info.offset.x;
                                const threshold = 50;
                                if (swipe < -threshold) {
                                    handleNext();
                                } else if (swipe > threshold) {
                                    handleBack();
                                }
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="w-full h-full absolute inset-0 flex flex-col"
                        >
                            <CurrentSlide
                                selectedMovie={selectedMovie}
                                setSelectedMovie={setSelectedMovie}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
