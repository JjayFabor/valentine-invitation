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

const MOVIES = [
    {
        id: "about-time",
        title: "About Time",
        year: "2013",
        synopsis: "At the age of 21, Tim discovers he can travel in time and change what happens and has happened in his own life. His decision to make his world a better place by getting a girlfriend turns out not to be as easy as you might think.",
        trailerUrl: "https://www.youtube.com/embed/7OIFdWk83no?si=SfA3twRktyGN5THY",
        color: "#ff0080",
        emoji: "⏳"
    },
    {
        id: "troll-2",
        title: "Troll 2",
        year: "1990",
        synopsis: "A family visiting a small town is haunted by evil forest-dwellers who plan to turn them into plants so they can eat them. A cult classic masterpiece of accidental comedy!",
        trailerUrl: "https://www.youtube.com/embed/Hzk4ovnGOyw?si=AMKI7SfhqZdUDUMH",
        color: "#50c878",
        emoji: "👹"
    },
    {
        id: "la-la-land",
        title: "La La Land",
        year: "2016",
        synopsis: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
        trailerUrl: "https://www.youtube.com/embed/0pdqf4P9MB8",
        color: "#6495ed",
        emoji: "💃"
    }
];

const MovieDetailModal = ({ movie, onClose, setSelectedMovie }: { movie: typeof MOVIES[0], onClose: () => void, setSelectedMovie: (movie: any) => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gray-900/90 border border-white/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative h-48 sm:h-64 bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                    <iframe
                        className="w-full h-full"
                        src={`${movie.trailerUrl}?autoplay=0&controls=1&rel=0`}
                        title={movie.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <span style={{ color: movie.color }}>{movie.emoji}</span>
                                {movie.title}
                            </h2>
                            <p className="text-gray-400 font-mono text-sm mt-1">{movie.year}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-6">
                        {movie.synopsis}
                    </p>

                    <button
                        onClick={() => {
                            setSelectedMovie(movie);
                            onClose();
                        }}
                        className="w-full py-3 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                        style={{ backgroundColor: `${movie.color}dd` }}
                    >
                        Choose this Movie! 💕
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const steps = [
    {
        id: "movie",
        timePHT: "2:00 PM",
        timeUAE: "5:00 PM",
        title: "Movie Time 🍿",
        description: "Teleparty session! Pick our movie below (or you can suggest one). Don't forget the popcorn."
    },
    {
        id: "dinner",
        timePHT: "5:00 PM",
        timeUAE: "1:00 PM",
        title: "Lunch & Dinner Date 🍕",
        description: "Ordering our favorites! You get your favorite, I'll get mine. We eat 'together' on video call."
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
    selectedMovie: any;
    setSelectedMovie: (movie: any) => void;
}

export const DatePlanContent = ({ compact = false, selectedMovie, setSelectedMovie }: DatePlanContentProps) => {
    const timePHT = useRealTimeClock('Asia/Manila');
    const timeUAE = useRealTimeClock('Asia/Dubai');
    const [previewMovie, setPreviewMovie] = useState<typeof MOVIES[0] | null>(null);

    return (
        <>
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
                                {step.id === 'movie' ? '🎬' : '💌'}
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
                                <p className={`${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} text-gray-300 leading-relaxed mb-4`}>
                                    {step.description}
                                </p>

                                {step.id === 'movie' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                        {MOVIES.map(movie => {
                                            const isSelected = selectedMovie?.id === movie.id;
                                            return (
                                                <button
                                                    key={movie.id}
                                                    onClick={() => setPreviewMovie(movie)}
                                                    className={`group relative bg-white/5 hover:bg-white/10 border ${isSelected ? 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-white/10'} hover:border-pink-500/50 p-2 rounded-lg transition-all text-left overflow-hidden`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">{movie.emoji}</span>
                                                            <span className="text-[10px] sm:text-xs text-white font-medium truncate">{movie.title}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <span className="text-[8px] uppercase tracking-wider font-bold text-pink-400 bg-pink-500/20 px-1.5 py-0.5 rounded border border-pink-500/30">
                                                                Selected
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000"></div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
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

            {previewMovie && (
                <MovieDetailModal
                    movie={previewMovie}
                    onClose={() => setPreviewMovie(null)}
                    setSelectedMovie={setSelectedMovie}
                />
            )}
        </>
    );
};

export const DatePlanSlide = ({ selectedMovie, setSelectedMovie }: { selectedMovie: any, setSelectedMovie: (movie: any) => void }) => {
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
                <DatePlanContent selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} />
            </div>
        </div>
    );
};
