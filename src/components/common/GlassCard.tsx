import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className={`
        relative overflow-hidden
        bg-white/10 backdrop-blur-xl 
        border border-white/20 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        rounded-2xl
        p-6 md:p-8
        text-white
        w-full h-full md:h-auto md:aspect-[9/16] md:max-h-[85vh] md:max-w-md
        flex flex-col
        ${className}
      `}
        >
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};
