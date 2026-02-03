import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressBar } from "./common/ProgressBar";
import { GlassCard } from "./common/GlassCard";

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

    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        // Basic screen division logic: Left 20% = Back, Right 80% = Next
        // We need to access the clientX. For simplicity, we use the target's bounding rect or window width if full screen.
        // However, since we are inside a centered container on desktop, we should use the container's coordinates or just full screen logic?
        // User requested "Story Interface", which implies the whole screen is the tap target usually. 
        // But since desktop is centered, maybe the clicks should register on the card or the whole background?
        // Let's attach the click handler to the main container.

        // Using window width for simplicity in this version, as user might tap outside the card on mobile?
        // Actually, "Story Interface" usually implies the content is the interactive part.
        // Let's use the event coordinates.

        const clientX = 'touches' in e
            ? (e as React.TouchEvent).touches[0].clientX
            : (e as React.MouseEvent).clientX;

        const width = window.innerWidth;
        if (clientX < width * 0.25) {
            handleBack();
        } else {
            handleNext();
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
            className="w-full h-full flex justify-center items-center relative"
            onClick={handleTap}
        // Add touch handlers if needed, though onClick covers most mobile taps too. 
        // React's onClick handles touch taps reasonably well.
        >
            <GlassCard className="relative">
                <ProgressBar totalSlides={SLIDES.length} currentSlide={currentIndex} />

                <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col justify-center">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="w-full h-full absolute inset-0 flex flex-col"
                        >
                            <CurrentSlide />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </GlassCard>
        </div>
    );
};
