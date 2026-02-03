import { motion } from "framer-motion";

interface ProgressBarProps {
    totalSlides: number;
    currentSlide: number;
}

export const ProgressBar = ({ totalSlides, currentSlide }: ProgressBarProps) => {
    return (
        <div className="absolute top-4 left-0 right-0 z-50 flex gap-2 px-4 w-full h-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                    key={index}
                    className="flex-1 bg-white/30 rounded-full h-full overflow-hidden"
                >
                    <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: index < currentSlide ? "100%" : "0%" }}
                        animate={{ width: index <= currentSlide ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            ))}
        </div>
    );
};
