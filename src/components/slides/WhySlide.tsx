import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Stars, Sparkles, RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const FONT_URL =
    "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

const SMALL_MOBILE_BREAKPOINT = 480;
const MOBILE_BREAKPOINT = 768;

// ——— Heart shape ———
const HeartShape = ({ color, ...props }: { color?: string } & Record<string, unknown>) => {
    const shape = useMemo(() => {
        const x = 0,
            y = 0;
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
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.008;
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.08;
        }
    });

    return (
        <mesh ref={meshRef} {...props}>
            <extrudeGeometry
                args={[
                    shape,
                    {
                        depth: 0.2,
                        bevelEnabled: true,
                        bevelSegments: 2,
                        steps: 2,
                        bevelSize: 0.08,
                        bevelThickness: 0.08,
                    },
                ]}
            />
            <meshStandardMaterial
                color={color || "#ff0080"}
                roughness={0.25}
                metalness={0.7}
                emissive={color || "#ff0080"}
                emissiveIntensity={0.28}
            />
        </mesh>
    );
};

const FloatingHearts = () => {
    const hearts = useMemo(
        () =>
            new Array(14).fill(0).map(() => ({
                position: [
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 16,
                    (Math.random() - 0.5) * 10 - 5,
                ] as [number, number, number],
                scale: Math.random() * 0.45 + 0.18,
                color: Math.random() > 0.5 ? "#ff0080" : "#ff69b4",
            })),
        []
    );

    return (
        <>
            {hearts.map((data, i) => (
                <Float
                    key={i}
                    speed={0.7 + Math.random() * 0.4}
                    rotationIntensity={0.35}
                    floatIntensity={0.6}
                >
                    <HeartShape position={data.position} scale={data.scale} color={data.color} />
                </Float>
            ))}
        </>
    );
};

// ——— Soft background orbs ———
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
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.35}
                roughness={0.3}
                metalness={0.6}
                transparent
                opacity={0.5}
            />
        </mesh>
    );
};

// ——— 3D "Why You?" title with glass card and ring ———
const WhyYouTitle = ({
    isMobile,
    isSmallMobile,
}: {
    isMobile: boolean;
    isSmallMobile: boolean;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current && !isMobile) {
            const tx = (state.mouse.x * Math.PI) / 14;
            const ty = (state.mouse.y * Math.PI) / 14;
            groupRef.current.rotation.x += (ty - groupRef.current.rotation.x) * 0.04;
            groupRef.current.rotation.y += (tx - groupRef.current.rotation.y) * 0.04;
        }
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.06;
        }
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.006;
        }
    });

    const titleY = isSmallMobile ? 2.4 : isMobile ? 2.6 : 2.2;
    const fontSize = isSmallMobile ? 0.55 : isMobile ? 0.75 : 1.2;
    const cardSize: [number, number, number] = isSmallMobile
        ? [3.2, 1.0, 0.2]
        : isMobile
          ? [3.8, 1.2, 0.25]
          : [4.8, 1.4, 0.3];
    const ringRadius = isSmallMobile ? 1.8 : isMobile ? 2.1 : 2.6;

    return (
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3} position={[0, titleY, -2]}>
            <group ref={groupRef}>
                <mesh ref={ringRef}>
                    <torusGeometry args={[ringRadius, 0.05, 16, 64]} />
                    <meshStandardMaterial
                        color="#ff69b4"
                        emissive="#ff0080"
                        emissiveIntensity={0.5}
                        roughness={0.2}
                        metalness={0.85}
                        transparent
                        opacity={0.85}
                    />
                </mesh>
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

// ——— 3D scene ———
const WhyScene = ({
    isMobile,
    isSmallMobile,
}: {
    isMobile: boolean;
    isSmallMobile: boolean;
}) => {
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
            <WhyYouTitle isMobile={isMobile} isSmallMobile={isSmallMobile} />
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

    const cameraZ = isSmallMobile ? 12 : isMobile ? 10 : 8;
    const cameraFov = isSmallMobile ? 46 : 50;

    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-black via-[#0d0510] to-black min-h-[320px]">
            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
                    dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
                    gl={{ antialias: true, alpha: false }}
                >
                    <WhyScene isMobile={isMobile} isSmallMobile={isSmallMobile} />
                </Canvas>
            </div>

            {/* Content overlay: reasons + quote */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 pointer-events-none">
                <motion.div
                    className="max-w-2xl text-center space-y-5 sm:space-y-6 md:space-y-8 mt-16 sm:mt-20 md:mt-24 px-3"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.25 } } }}
                >
                    <motion.p
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                        className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-200 font-light leading-relaxed"
                    >
                        Because you make even the boring days feel like an adventure.
                        <span className="text-gray-400 text-xs sm:text-sm block mt-2">
                            (And you let me pick the music in the car... usually.)
                        </span>
                    </motion.p>

                    <motion.p
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                        className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-200 font-light leading-relaxed"
                    >
                        You're my favorite notification, my best teammate, and the only person I'd
                        share my fries with.
                    </motion.p>

                    <motion.div
                        variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
                        className="pointer-events-auto"
                    >
                        <p className="font-bold text-base sm:text-lg md:text-2xl lg:text-3xl text-white bg-white/10 backdrop-blur-md rounded-xl border-l-4 border-pink-500 shadow-xl inline-block p-4 sm:p-5 md:p-6">
                            "Life is just better when you're around."
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
