import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Heart shape for 3D background
const HeartShape3D = ({ color, ...props }: any) => {
    const shape = useMemo(() => {
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo(x + 0.5, y + 0.5);
        heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
        heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
        heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
        heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
        heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
        return heartShape;
    }, []);

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <mesh ref={meshRef} {...props}>
            <extrudeGeometry args={[shape, { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 }]} />
            <meshStandardMaterial color={color || "#ff0080"} roughness={0.2} metalness={0.8} emissive={color || "#ff0080"} emissiveIntensity={0.2} />
        </mesh>
    );
};

const FloatingHearts3D = () => {
    const hearts = useMemo(() => {
        return new Array(15).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10 - 5
            ],
            scale: Math.random() * 0.4 + 0.2,
            color: Math.random() > 0.5 ? "#ff0080" : "#ff69b4"
        }));
    }, []);

    return (
        <>
            {hearts.map((data, i) => (
                <Float key={i} speed={0.5 + Math.random() * 0.5} rotationIntensity={0.3} floatIntensity={1}>
                    <HeartShape3D
                        position={data.position as [number, number, number]}
                        scale={data.scale}
                        color={data.color}
                    />
                </Float>
            ))}
        </>
    );
};

const DatePlan3DScene = () => {
    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff1493" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff69b4" />

            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.3} />
            <Sparkles count={50} scale={10} size={2} speed={0.2} opacity={0.4} color="#fff" />

            <FloatingHearts3D />
        </>
    );
};

// Real-time clock component
const useRealTimeClock = (timezone: string) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return formatter.format(time);
};

const steps = [
    {
        timePHT: "7:00 PM",
        timeUAE: "3:00 PM",
        title: "Dinner Date 🍕",
        description: "Ordering our favorites! You get your favorite Pizza, I'll get mine. We eat 'together' on video call."
    },
    {
        timePHT: "8:30 PM",
        timeUAE: "4:30 PM",
        title: "Movie Night 🍿",
        description: "Teleparty session! We're watching 'About Time' (or your pick!). Don't forget the popcorn."
    },
    {
        timePHT: "10:30 PM",
        timeUAE: "6:30 PM",
        title: "Co-op Games 🎮",
        description: "It Takes Two / Overcooked / Stardew Valley. Let's see if we can survive a level without chaos!"
    },
    {
        timePHT: "11:30 PM",
        timeUAE: "7:30 PM",
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
    const timePHT = useRealTimeClock('Asia/Manila');
    const timeUAE = useRealTimeClock('Asia/Dubai');

    return (
        <motion.div
            className={`${compact ? 'space-y-4' : 'max-w-2xl mx-auto space-y-6 sm:space-y-8 pb-6 sm:pb-10'}`}
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="text-center mb-4">
                <h2 className={`${compact ? 'text-lg sm:text-xl md:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-bold text-pink-400 mb-2`}>
                    Our Virtual Date Plan 💖
                </h2>
                <p className={`${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg md:text-xl'} text-gray-300 mb-3`}>
                    February 14th, 2026
                </p>

                {/* Real-time clocks */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2">
                    <div className="bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 rounded-lg px-2 py-1.5 sm:px-4 sm:py-2">
                        <div className="text-[10px] sm:text-xs text-pink-300 mb-1">🇵🇭 Philippines</div>
                        <div className="text-sm sm:text-base md:text-lg font-mono font-bold text-pink-400">{timePHT}</div>
                    </div>
                    <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg px-2 py-1.5 sm:px-4 sm:py-2">
                        <div className="text-[10px] sm:text-xs text-purple-300 mb-1">🇦🇪 UAE</div>
                        <div className="text-sm sm:text-base md:text-lg font-mono font-bold text-purple-400">{timeUAE}</div>
                    </div>
                </div>

                <p className={`${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'} text-gray-400 italic`}>
                    4 hours time difference
                </p>
            </motion.div>

            <div className={`relative border-l-4 border-pink-500/30 ${compact ? 'ml-3 space-y-6 pl-4' : 'ml-4 md:ml-6 space-y-10 pl-6 md:pl-8'}`}>
                {steps.map((step, index) => (
                    <motion.div key={index} variants={item} className="relative">
                        <span className={`absolute ${compact ? '-left-[26px] h-6 w-6' : '-left-[42px] md:-left-[50px] h-8 w-8 md:h-10 md:w-10'} top-1 rounded-full bg-pink-600 border-4 border-gray-900 flex items-center justify-center text-xs`}>
                            💌
                        </span>
                        <div className="bg-white/5 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10 hover:border-pink-500/50 transition-colors">
                            <div className={`flex ${compact ? 'flex-col gap-1' : 'flex-row gap-3'} items-start mb-2`}>
                                <div className="flex items-center gap-2">
                                    <span className={`text-pink-400 font-mono ${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'} tracking-wider font-bold`}>
                                        {step.timePHT}
                                    </span>
                                    <span className={`text-pink-300/60 ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'} font-semibold`}>
                                        PHT 🇵🇭
                                    </span>
                                </div>
                                <span className={`text-gray-400 ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'}`}>|</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-purple-400 font-mono ${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'} tracking-wider font-bold`}>
                                        {step.timeUAE}
                                    </span>
                                    <span className={`text-purple-300/60 ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'} font-semibold`}>
                                        GST 🇦🇪
                                    </span>
                                </div>
                            </div>
                            <h3 className={`${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl md:text-2xl'} font-bold text-white mt-1 mb-2`}>
                                {step.title}
                            </h3>
                            <p className={`${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} text-gray-300 leading-relaxed`}>
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!compact && (
                <motion.div variants={item} className="text-center pt-6 sm:pt-8">
                    <p className="text-base sm:text-lg italic text-pink-200 px-2">
                        "Distance implies so little when someone means so much."
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export const DatePlanSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-black">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <DatePlan3DScene />
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar p-4 sm:p-5 md:p-6">
                <DatePlanContent />
            </div>
        </div>
    );
};
