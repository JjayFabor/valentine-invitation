import { useState, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const FONT_URL = "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";
const MOBILE_BREAKPOINT = 768;
const SMALL_MOBILE_BREAKPOINT = 480;

const START_DATE = new Date("2021-07-02T00:00:00");

const useTimeTogether = () => {
    const [time, setTime] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculate = () => {
            const now = new Date();
            const diff = now.getTime() - START_DATE.getTime();

            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 365);
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

            setTime({ years, days, hours, minutes, seconds });
        };

        const timer = setInterval(calculate, 1000);
        calculate();
        return () => clearInterval(timer);
    }, []);

    return time;
};

// ——— Heart shape (extruded bezier) ———
const HeartShape = ({ color, ...props }: { color?: string } & Record<string, unknown>) => {
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
            new Array(15).fill(0).map(() => ({
                position: [
                    (Math.random() - 0.5) * 22,
                    (Math.random() - 0.5) * 18,
                    (Math.random() - 0.5) * 12 - 5,
                ] as [number, number, number],
                scale: Math.random() * 0.4 + 0.1,
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

const StatItem = ({ label, value, color, position, isMobile, emoji, isHero }: any) => {
    const [hovered, setHovered] = useState(false);

    const valueSize = isHero ? (isMobile ? 0.45 : 1.2) : (isMobile ? 0.7 : 1.0);
    const labelSize = isMobile ? 0.18 : 0.25;

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4} position={position}>
            <group
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <group position={[0, 0, 0]}>
                    {emoji && (
                        <Float speed={3} rotationIntensity={1.5} floatIntensity={0.5}>
                            <Text
                                font={FONT_URL}
                                fontSize={isHero ? 0.6 : 0.5}
                                position={[0, isHero ? 0.9 : 0.7, 0]}
                            >
                                {emoji}
                            </Text>
                        </Float>
                    )}

                    <Text
                        font={FONT_URL}
                        fontSize={valueSize}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, isHero ? 0.1 : 0.1, 0]}
                        maxWidth={isHero ? 8 : 4}
                        textAlign="center"
                        lineHeight={1.2}
                    >
                        {value}
                        <meshStandardMaterial
                            color="white"
                            emissive={color}
                            emissiveIntensity={hovered ? 2.5 : 1.5}
                        />
                    </Text>

                    <Text
                        font={FONT_URL}
                        fontSize={labelSize}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, isHero ? -1.0 : -0.7, 0]}
                    >
                        {label}
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive={color}
                            emissiveIntensity={hovered ? 0.8 : 0.4}
                            transparent
                            opacity={0.8}
                        />
                    </Text>
                </group>
            </group>
        </Float>
    );
};


const StatsScene = ({ isMobile, isSmallMobile }: { isMobile: boolean; isSmallMobile: boolean }) => {
    const time = useTimeTogether();
    const groupRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const { mouse } = useThree();

    useFrame((state) => {
        if (groupRef.current) {
            // Mouse Parallax
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 0.5, 0.1);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.y * 0.5 + (isMobile ? -0.5 : 0), 0.1);
        }
        if (lightRef.current) {
            // Dynamic pulsing light
            lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
            lightRef.current.position.x = Math.sin(state.clock.elapsedTime) * 5;
        }
    });

    // Format countdown string
    const countdownStr = isMobile
        ? `${time.years}y ${time.days}d\n${time.hours}h ${time.minutes}m ${time.seconds}s`
        : `${time.years} Years, ${time.days} Days, ${time.hours}h ${time.minutes}m ${time.seconds}s`;

    const statsConfig = [
        {
            label: "Time Together",
            value: countdownStr,
            color: "#ff0080",
            position: isMobile ? [0, 2.8, 0] : [0, 1, 0],
            emoji: "⏳",
            isHero: true
        },
        {
            label: "Arguments Won",
            value: "0%",
            color: "#ffcc00",
            position: isMobile ? [0, -0.4, 0] : [-4, -2.5, 0],
            emoji: "🏆"
        },
        {
            label: "Happiness Level",
            value: "9000+",
            color: "#ff69b4",
            position: isMobile ? [0, -2.8, 0] : [4, -2.5, 0],
            emoji: "✨"
        },
    ];

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight ref={lightRef} position={[10, 10, 10]} intensity={1.5} color="#ff0080" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />

            <Stars radius={100} depth={50} count={isMobile ? 2000 : 5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={isMobile ? 50 : 100} scale={15} size={3} speed={0.4} opacity={0.6} color="#ff0080" />

            <FloatingHearts />

            <group ref={groupRef}>
                <Text
                    font={FONT_URL}
                    fontSize={isSmallMobile ? 1.0 : isMobile ? 1.5 : 2.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, isSmallMobile ? 5.5 : isMobile ? 5.8 : 5, -3]}
                >
                    Our Journey
                    <meshStandardMaterial color="#ffffff" emissive="#ff0080" emissiveIntensity={0.5} />
                </Text>

                {statsConfig.map((stat, index) => (
                    <StatItem key={index} {...stat} isMobile={isMobile} />
                ))}
            </group>
        </>
    );
};

export const StatsSlide = (_props: any) => {
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

    const cameraZ = isSmallMobile ? 15 : isMobile ? 12 : 9;
    const cameraFov = isSmallMobile ? 45 : 50;

    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-black via-[#0d0510] to-black min-h-[320px]">
            <Canvas
                camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
                dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
                gl={{ antialias: true, alpha: false }}
            >
                <StatsScene isMobile={isMobile} isSmallMobile={isSmallMobile} />
            </Canvas>

            <div className="absolute bottom-10 w-full text-center pointer-events-none px-4">
                <p className="text-[10px] md:text-xs text-gray-500 font-mono">
                    (Source: My Heart • Updated Real-time • Error: 0%)
                </p>
            </div>
        </div>
    );
};
