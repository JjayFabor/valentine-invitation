import { useMemo, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Stars, Sparkles, RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const FONT_URL = "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";
const MOBILE_BREAKPOINT = 768;
const SMALL_MOBILE_BREAKPOINT = 480;

const WhyYouTitle = ({ isMobile }: { isMobile: boolean }) => {
    const [hovered, setHovered] = useState(false);
    const cardSize: [number, number, number] = isMobile ? [4.5, 2.5, 0.2] : [8, 4, 0.2];
    const fontSize = isMobile ? 1.5 : 3;

    return (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
            <group position={[0, 2, -5]}>
                <RoundedBox args={cardSize} radius={0.08} smoothness={4}>
                    <meshStandardMaterial
                        color="#0d0510"
                        transparent
                        opacity={0.85}
                        roughness={0.2}
                        metalness={0.65}
                        emissive="#ff69b4"
                        emissiveIntensity={hovered ? 0.12 : 0.06}
                    />
                </RoundedBox>
                <group
                    position={[0, 0, cardSize[2] / 2 + 0.02]}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <Text
                        font={FONT_URL}
                        fontSize={fontSize}
                        color="#ff69b4"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, 0, 0]}
                    >
                        Why You?
                        <meshStandardMaterial
                            color="#ff69b4"
                            emissive="#ff0080"
                            emissiveIntensity={hovered ? 0.6 : 0.4}
                            roughness={0.1}
                            metalness={0.85}
                        />
                    </Text>
                </group>
            </group>
        </Float>
    );
};

const GlowOrb = ({
    position,
    color,
    scale,
}: {
    position: [number, number, number];
    color: string;
    scale: number;
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
            meshRef.current.rotation.y += 0.004;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.3} />
        </mesh>
    );
};

const FloatingHearts = () => {
    const hearts = useMemo(
        () =>
            new Array(15).fill(0).map(() => ({
                position: [
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 10 - 8,
                ] as [number, number, number],
                scale: Math.random() * 0.4 + 0.2,
                color: Math.random() > 0.5 ? "#ff0080" : "#ff69b4",
            })),
        []
    );

    return (
        <>
            {hearts.map((data, i) => (
                <Float key={i} speed={0.8} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={data.position} scale={data.scale}>
                        <sphereGeometry args={[0.5, 16, 16]} />
                        <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.2} />
                    </mesh>
                </Float>
            ))}
        </>
    );
};

const WhyScene = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[8, 8, 8]} intensity={1.6} color="#ff1493" />
            <pointLight position={[-6, -6, 6]} intensity={0.85} color="#ff69b4" />
            <pointLight position={[0, 10, 5]} intensity={1.1} color="#ffb6c1" />

            <Stars radius={80} depth={50} count={3000} factor={3.5} saturation={0} fade speed={0.5} />
            <Sparkles count={70} scale={12} size={2.5} speed={0.3} opacity={0.5} color="#fff" />

            <GlowOrb position={[-4, 1, -8]} color="#ff0080" scale={1.1} />
            <GlowOrb position={[5, -1, -9]} color="#ff69b4" scale={0.9} />
            <GlowOrb position={[0, 4, -10]} color="#ff1493" scale={0.75} />

            <FloatingHearts />
            <WhyYouTitle isMobile={isMobile} />
        </>
    );
};

export const WhySlide = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isSmallMobile, setIsSmallMobile] = useState(false);

    useEffect(() => {
        const check = () => {
            const w = window.innerWidth;
            setIsMobile(w < MOBILE_BREAKPOINT);
            setIsSmallMobile(w < SMALL_MOBILE_BREAKPOINT);
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const cameraZ = isSmallMobile ? 14 : isMobile ? 11 : 8;
    const cameraFov = isSmallMobile ? 44 : 50;

    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-black via-[#0d0510] to-black min-h-[320px]">
            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
                    dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
                    gl={{ antialias: true, alpha: false }}
                >
                    <WhyScene isMobile={isMobile} />
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-6 md:p-8 pointer-events-none">
                <motion.div
                    className={`max-w-2xl text-center space-y-6 md:space-y-8 ${isMobile ? 'mt-32' : 'mt-20'}`}
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.25 } } }}
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
                        You're my favorite notification, my best teammate, and the only person I'd
                        share my fries with.
                    </motion.p>

                    <motion.div
                        variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
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
