import { Canvas } from "@react-three/fiber";
import { Text, Float, Stars, Cloud, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";

const WhyScene = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ff0080" />

            <Stars radius={100} depth={50} count={isMobile ? 2000 : 5000} factor={4} saturation={0} fade speed={1} />
            <Cloud position={[0, -5, -10]} speed={0.2} opacity={0.5} color="#ffc0cb" />
            <Cloud position={[5, 5, -15]} speed={0.2} opacity={0.3} color="#ff00ff" />
            <Sparkles count={isMobile ? 30 : 50} scale={10} size={5} speed={0.4} opacity={0.5} color="#fff" />

            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                <Text
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                    fontSize={isMobile ? 1.5 : 3}
                    color="#ff69b4"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 2, -5]}
                    maxWidth={isMobile ? 6 : 10}
                    textAlign="center"
                >
                    Why You?
                    <meshStandardMaterial
                        color="#ff69b4"
                        emissive="#ff0080"
                        emissiveIntensity={0.4}
                        roughness={0.1}
                        metalness={0.8}
                    />
                </Text>
            </Float>
        </>
    );
};

export const WhySlide = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="w-full h-full relative overflow-hidden bg-black/90">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                    <WhyScene />
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-6 md:p-8 pointer-events-none">
                <motion.div
                    className={`max-w-2xl text-center space-y-6 md:space-y-8 ${isMobile ? 'mt-32' : 'mt-20'}`}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.3 } }
                    }}
                >
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="text-lg md:text-2xl text-gray-200 font-light leading-relaxed px-2"
                    >
                        Because you make even the boring days feel like an adventure.
                        <span className="text-gray-400 text-xs md:text-sm block mt-2">(And you let me pick the music in the car... usually.)</span>
                    </motion.p>

                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="text-lg md:text-2xl text-gray-200 font-light leading-relaxed px-2"
                    >
                        You're my favorite notification, my best teammate, and the only person I'd share my fries with.
                    </motion.p>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: { opacity: 1, scale: 1 }
                        }}
                        className="pointer-events-auto"
                    >
                        <p className="font-bold text-xl md:text-3xl text-white bg-white/10 p-5 md:p-6 rounded-xl border-l-4 border-pink-500 backdrop-blur-md shadow-xl inline-block">
                            "Life is just better when you're around."
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
