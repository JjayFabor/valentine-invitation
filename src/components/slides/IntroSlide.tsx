import { Canvas, useFrame } from "@react-three/fiber";
import {
    Text,
    Float,
    Stars,
    Sparkles,
    RoundedBox,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const FONT_URL =
    "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

const SMALL_MOBILE_BREAKPOINT = 480;
const MOBILE_BREAKPOINT = 768;

// ——— Heart shape (extruded bezier) ———
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
            new Array(20).fill(0).map(() => ({
                position: [
                    (Math.random() - 0.5) * 22,
                    (Math.random() - 0.5) * 18,
                    (Math.random() - 0.5) * 12 - 5,
                ] as [number, number, number],
                scale: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? "#ff0080" : "#ff69b4",
            })),
        []
    );

    return (
        <>
            {hearts.map((data, i) => (
                <Float
                    key={i}
                    speed={0.6 + Math.random() * 0.5}
                    rotationIntensity={0.4}
                    floatIntensity={0.7}
                >
                    <HeartShape position={data.position} scale={data.scale} color={data.color} />
                </Float>
            ))}
        </>
    );
};

// ——— Soft glowing orbs (no distortion for performance) ———
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

// ——— Hero title card: glass panel + "2025 Wrapped" + subtitle ———
const HeroTitleCard = ({
    isMobile,
    isSmallMobile,
}: {
    isMobile: boolean;
    isSmallMobile: boolean;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current && !isMobile) {
            const tx = (state.mouse.x * Math.PI) / 12;
            const ty = (state.mouse.y * Math.PI) / 12;
            groupRef.current.rotation.x += (ty - groupRef.current.rotation.x) * 0.04;
            groupRef.current.rotation.y += (tx - groupRef.current.rotation.y) * 0.04;
        }
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
        }
    });

    const cardSize: [number, number, number] = isSmallMobile
        ? [5.5, 2.2, 0.25]
        : isMobile
          ? [6.5, 2.6, 0.3]
          : [8, 3.2, 0.35];

    const titleSize = isSmallMobile ? 0.5 : isMobile ? 0.7 : 1.1;
    const subtitleSize = isSmallMobile ? 0.14 : isMobile ? 0.18 : 0.28;

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
            <group ref={groupRef}>
                <RoundedBox args={cardSize} radius={0.12} smoothness={4}>
                    <meshStandardMaterial
                        color="#0d0510"
                        transparent
                        opacity={0.82}
                        roughness={0.2}
                        metalness={0.65}
                        emissive="#ff1493"
                        emissiveIntensity={hovered ? 0.12 : 0.05}
                    />
                </RoundedBox>
                <group
                    position={[0, 0, cardSize[2] / 2 + 0.03]}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <Text
                        font={FONT_URL}
                        fontSize={titleSize}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, 0.35, 0]}
                        maxWidth={cardSize[0] - 0.6}
                        textAlign="center"
                    >
                        2025 Wrapped
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#ff1493"
                            emissiveIntensity={hovered ? 0.5 : 0.35}
                            metalness={0.9}
                            roughness={0.1}
                        />
                    </Text>
                    <Text
                        font={FONT_URL}
                        fontSize={subtitleSize}
                        color="#ffb6c1"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, -0.35, 0]}
                        maxWidth={cardSize[0] - 0.8}
                        textAlign="center"
                    >
                        It's been quite a year...
                    </Text>
                </group>
            </group>
        </Float>
    );
};

// ——— Decorative ring around the hero card ———
const HeroRing = ({
    isMobile,
    isSmallMobile,
}: {
    isMobile: boolean;
    isSmallMobile: boolean;
}) => {
    const ringRef = useRef<THREE.Mesh>(null);
    const radius = isSmallMobile ? 3.2 : isMobile ? 3.8 : 4.6;

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.006;
            ringRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
        }
    });

    return (
        <mesh ref={ringRef}>
            <torusGeometry args={[radius, 0.06, 20, 80]} />
            <meshStandardMaterial
                color="#ff69b4"
                emissive="#ff1493"
                emissiveIntensity={0.45}
                roughness={0.2}
                metalness={0.85}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
};

// ——— Full 3D scene ———
const IntroScene = ({
    isMobile,
    isSmallMobile,
}: {
    isMobile: boolean;
    isSmallMobile: boolean;
}) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[8, 8, 8]} intensity={1.8} color="#ff1493" />
            <pointLight position={[-6, -6, 6]} intensity={0.9} color="#ff69b4" />
            <pointLight position={[0, 10, 5]} intensity={1.2} color="#ffb6c1" />

            <Stars radius={80} depth={50} count={2800} factor={3.5} saturation={0} fade speed={0.45} />
            <Sparkles count={90} scale={14} size={2.5} speed={0.25} opacity={0.55} color="#fff" />

            <GlowOrb position={[-5, 2, -8]} color="#ff0080" scale={1.3} />
            <GlowOrb position={[6, -2, -10]} color="#ff69b4" scale={1} />
            <GlowOrb position={[0, 5, -11]} color="#ff1493" scale={0.85} />

            <FloatingHearts />

            <HeroRing isMobile={isMobile} isSmallMobile={isSmallMobile} />
            <HeroTitleCard isMobile={isMobile} isSmallMobile={isSmallMobile} />
        </>
    );
};

export const IntroSlide = () => {
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

    const cameraZ = isSmallMobile ? 14 : isMobile ? 12 : 8;
    const cameraFov = isSmallMobile ? 45 : 50;

    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-black via-[#0a0510] to-black min-h-[320px]">
            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
                    dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
                    gl={{ antialias: true, alpha: false }}
                >
                    <IntroScene isMobile={isMobile} isSmallMobile={isSmallMobile} />
                </Canvas>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end items-center pb-8 sm:pb-10 md:pb-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="text-[10px] sm:text-xs md:text-sm text-gray-400 animate-pulse px-4 text-center"
                >
                    Tap right to continue →
                </motion.div>
            </div>
        </div>
    );
};
