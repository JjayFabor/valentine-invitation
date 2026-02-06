import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Stars, Sparkles, RoundedBox } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

const FONT_URL =
    "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

const getTimeTogether = () => {
    const anniversary = new Date("2021-07-02T00:00:00");
    const now = new Date();
    const diffTime = now.getTime() - anniversary.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
};

const baseStats = [
    { label: "Arguments Won", value: "100%", color: "#ffcc00", emoji: "🏆" },
    { label: "Happiness Level", value: "9000+", color: "#ff69b4", emoji: "💖" },
];

const SMALL_MOBILE_BREAKPOINT = 480;
const MOBILE_BREAKPOINT = 768;

// ——— Floating hearts (consistent with other slides) ———
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
                        depth: 0.15,
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
                emissiveIntensity={0.25}
            />
        </mesh>
    );
};

const FloatingHearts = () => {
    const hearts = useMemo(
        () =>
            new Array(12).fill(0).map(() => ({
                position: [
                    (Math.random() - 0.5) * 18,
                    (Math.random() - 0.5) * 14,
                    (Math.random() - 0.5) * 8 - 6,
                ] as [number, number, number],
                scale: Math.random() * 0.4 + 0.15,
                color: Math.random() > 0.5 ? "#ff0080" : "#ff69b4",
            })),
        []
    );

    return (
        <>
            {hearts.map((data, i) => (
                <Float key={i} speed={0.8 + Math.random() * 0.4} rotationIntensity={0.3} floatIntensity={0.6}>
                    <HeartShape
                        position={data.position}
                        scale={data.scale}
                        color={data.color}
                    />
                </Float>
            ))}
        </>
    );
};

// ——— Soft glowing orbs in background ———
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
                emissiveIntensity={0.4}
                roughness={0.3}
                metalness={0.6}
                transparent
                opacity={0.5}
            />
        </mesh>
    );
};

// ——— Glass stat card (RoundedBox + subtle glass material) ———
interface StatCard3DProps {
    label: string;
    value: string;
    color: string;
    emoji?: string;
    position: [number, number, number];
    size: [number, number, number];
    isMobile: boolean;
    isSmallMobile: boolean;
    isHero?: boolean;
}

const StatCard3D = ({
    label,
    value,
    color,
    emoji,
    position,
    size,
    isMobile,
    isSmallMobile,
    isHero = false,
}: StatCard3DProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current && !isMobile) {
            const tx = (state.mouse.x * Math.PI) / 25;
            const ty = (state.mouse.y * Math.PI) / 25;
            groupRef.current.rotation.x += (ty - groupRef.current.rotation.x) * 0.04;
            groupRef.current.rotation.y += (tx - groupRef.current.rotation.y) * 0.04;
        }
        if (groupRef.current) {
            groupRef.current.position.y =
                position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.03;
        }
    });

    const valueSize = isHero
        ? isSmallMobile ? 0.28 : isMobile ? 0.38 : 0.55
        : isSmallMobile ? 0.2 : isMobile ? 0.28 : 0.4;
    const labelSize = isHero
        ? isSmallMobile ? 0.1 : isMobile ? 0.12 : 0.18
        : isSmallMobile ? 0.08 : isMobile ? 0.1 : 0.14;

    return (
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25} position={position}>
            <group ref={groupRef}>
                <RoundedBox args={size} radius={0.08} smoothness={4} castShadow receiveShadow>
                    <meshStandardMaterial
                        color="#1a0a12"
                        transparent
                        opacity={0.75}
                        roughness={0.2}
                        metalness={0.6}
                        emissive={color}
                        emissiveIntensity={hovered ? 0.15 : 0.06}
                    />
                </RoundedBox>
                <group
                    position={[0, 0, size[2] / 2 + 0.02]}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    {emoji && !isHero && (
                        <Text
                            font={FONT_URL}
                            fontSize={labelSize * 1.8}
                            anchorX="center"
                            anchorY="middle"
                            position={[0, size[1] / 2 - labelSize * 2, 0]}
                        >
                            {emoji}
                        </Text>
                    )}
                    <Text
                        font={FONT_URL}
                        fontSize={valueSize}
                        color={color}
                        anchorX="center"
                        anchorY="middle"
                        position={[0, isHero ? 0.05 : 0, 0]}
                        maxWidth={isHero ? size[0] - 0.4 : undefined}
                        textAlign="center"
                    >
                        {value}
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={hovered ? 0.6 : 0.3}
                            metalness={0.8}
                            roughness={0.15}
                        />
                    </Text>
                    <Text
                        font={FONT_URL}
                        fontSize={labelSize}
                        color="rgba(255,255,255,0.9)"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, isHero ? -0.22 : -0.18, 0]}
                        maxWidth={size[0] - 0.2}
                        textAlign="center"
                    >
                        {label}
                    </Text>
                </group>
            </group>
        </Float>
    );
};

// ——— Hero ring around "Days Together" ———
const HeroRing = ({
    position,
    radius,
    isMobile,
    isSmallMobile,
}: {
    position: [number, number, number];
    radius: number;
    isMobile: boolean;
    isSmallMobile: boolean;
}) => {
    const ringRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.008;
            ringRef.current.position.y =
                position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
        }
    });

    const r = isSmallMobile ? radius * 0.7 : isMobile ? radius * 0.85 : radius;

    return (
        <mesh ref={ringRef} position={position}>
            <torusGeometry args={[r, 0.04, 16, 64]} />
            <meshStandardMaterial
                color="#ff1493"
                emissive="#ff1493"
                emissiveIntensity={0.5}
                roughness={0.2}
                metalness={0.9}
                transparent
                opacity={0.85}
            />
        </mesh>
    );
};

// ——— Live countdown (days together) ———
const LiveCountdown = ({
    isMobile,
    isSmallMobile,
}: {
    isMobile: boolean;
    isSmallMobile: boolean;
}) => {
    const [time, setTime] = useState(getTimeTogether());
    useEffect(() => {
        const t = setInterval(() => setTime(getTimeTogether()), 1000);
        return () => clearInterval(t);
    }, []);

    const str = `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;
    const heroSize: [number, number, number] = isSmallMobile
        ? [4.2, 1.0, 0.25]
        : isMobile
          ? [4.8, 1.2, 0.3]
          : [5.5, 1.35, 0.35];
    const heroY = isSmallMobile ? 1.2 : isMobile ? 1.4 : 1.0;

    return (
        <>
            <HeroRing
                position={[0, heroY, 0]}
                radius={isSmallMobile ? 1.4 : isMobile ? 1.6 : 1.8}
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
            />
            <StatCard3D
                label="Days Together"
                value={str}
                color="#ff0080"
                position={[0, heroY, 0]}
                size={heroSize}
                isMobile={isMobile}
                isSmallMobile={isSmallMobile}
                isHero
            />
        </>
    );
};

// ——— Full 3D scene ———
const StatsScene = ({
    isMobile,
    isSmallMobile,
}: {
    isMobile: boolean;
    isSmallMobile: boolean;
}) => {
    const cardSize: [number, number, number] = isSmallMobile
        ? [2.2, 0.9, 0.2]
        : isMobile
          ? [2.6, 1.0, 0.22]
          : [3, 1.15, 0.25];

    const leftPos: [number, number, number] = isMobile
        ? [-1.5, isSmallMobile ? 0.1 : 0.2, 0.3]
        : [-2.4, 0.15, 0.4];
    const rightPos: [number, number, number] = isMobile
        ? [1.5, isSmallMobile ? 0.1 : 0.2, 0.3]
        : [2.4, 0.15, 0.4];

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[8, 8, 8]} intensity={1.8} color="#ff1493" />
            <pointLight position={[-6, -6, 6]} intensity={0.9} color="#ff69b4" />
            <pointLight position={[0, 8, 4]} intensity={1.2} color="#ffb6c1" />

            <Stars radius={80} depth={40} count={2500} factor={3} saturation={0} fade speed={0.4} />
            <Sparkles
                count={80}
                scale={12}
                size={2}
                speed={0.2}
                opacity={0.5}
                color="#ff0080"
            />

            <GlowOrb position={[-4, 1, -8]} color="#ff0080" scale={1.2} />
            <GlowOrb position={[5, -2, -10]} color="#ff69b4" scale={0.9} />
            <GlowOrb position={[0, 4, -9]} color="#ff1493" scale={0.7} />

            <FloatingHearts />
            <LiveCountdown isMobile={isMobile} isSmallMobile={isSmallMobile} />

            {baseStats.map((stat, i) => (
                <StatCard3D
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                    emoji={stat.emoji}
                    position={i === 0 ? leftPos : rightPos}
                    size={cardSize}
                    isMobile={isMobile}
                    isSmallMobile={isSmallMobile}
                />
            ))}
        </>
    );
};

export const StatsSlide = () => {
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
            <Canvas
                camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
                dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
                gl={{ antialias: true, alpha: false }}
            >
                <StatsScene isMobile={isMobile} isSmallMobile={isSmallMobile} />
            </Canvas>

            <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-0 right-0 text-center pointer-events-none">
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-mono px-2 sm:px-4">
                    (Source: My Heart, 2025 • Margin of error: 0%)
                </p>
            </div>
        </div>
    );
};
