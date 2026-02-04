import { motion } from "framer-motion";

const steps = [
    {
        time: "7:00 PM",
        title: "Dinner Date 🍕",
        description: "Ordering our favorites! You get your favorite Pizza, I'll get mine. We eat 'together' on video call."
    },
    {
        time: "8:30 PM",
        title: "Movie Night 🍿",
        description: "Teleparty session! We're watching 'About Time' (or your pick!). Don't forget the popcorn."
    },
    {
        time: "10:30 PM",
        title: "Co-op Games 🎮",
        description: "It Takes Two / Overcooked / Stardew Valley. Let's see if we can survive a level without chaos!"
    },
    {
        time: "11:30 PM",
        title: "Gift Exchange 🎁",
        description: "Open the digital surprise I sent to your email (and maybe a real package if it arrived!)."
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface DatePlanContentProps {
    compact?: boolean;
}

export const DatePlanContent = ({ compact = false }: DatePlanContentProps) => {
    return (
        <motion.div
            className={`${compact ? 'space-y-4' : 'max-w-2xl mx-auto space-y-8 pb-10'}`}
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="text-center mb-4">
                <h2 className={`${compact ? 'text-2xl' : 'text-4xl'} font-bold text-pink-400 mb-2`}>
                    Our Virtual Date Plan 💖
                </h2>
                <p className={`${compact ? 'text-base' : 'text-xl'} text-gray-300`}>
                    February 14th, 2026
                </p>
            </motion.div>

            <div className={`relative border-l-4 border-pink-500/30 ${compact ? 'ml-3 space-y-6 pl-4' : 'ml-4 md:ml-6 space-y-10 pl-6 md:pl-8'}`}>
                {steps.map((step, index) => (
                    <motion.div key={index} variants={item} className="relative">
                        <span className={`absolute ${compact ? '-left-[26px] h-6 w-6' : '-left-[42px] md:-left-[50px] h-8 w-8 md:h-10 md:w-10'} top-1 rounded-full bg-pink-600 border-4 border-gray-900 flex items-center justify-center text-xs`}>
                            💌
                        </span>
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-pink-500/50 transition-colors">
                            <span className={`text-pink-400 font-mono ${compact ? 'text-xs' : 'text-sm'} tracking-wider`}>
                                {step.time}
                            </span>
                            <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white mt-1 mb-2`}>
                                {step.title}
                            </h3>
                            <p className={`${compact ? 'text-sm' : 'text-base'} text-gray-300 leading-relaxed`}>
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!compact && (
                <motion.div variants={item} className="text-center pt-8">
                    <p className="text-lg italic text-pink-200">
                        "Distance implies so little when someone means so much."
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export const DatePlanSlide = () => {
    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar p-6">
            <DatePlanContent />
        </div>
    );
};
