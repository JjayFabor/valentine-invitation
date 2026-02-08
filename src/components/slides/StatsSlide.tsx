import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Text, Float, Stars, Sparkles, RoundedBox } from "@react-three/drei";

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

const StatItem = ({ label, value, color, position, isMobile, emoji, isHero }: any) => {
    const [hovered, setHovered] = useState(false);

    const size: [number, number, number] = isHero
        ? (isMobile ? [5.5, 3.2, 0.2] : [8, 3, 0.2])
        : (isMobile ? [3, 1.8, 0.2] : [3.5, 2.2, 0.2]);
    const valueSize = isHero ? (isMobile ? 0.45 : 1.2) : (isMobile ? 0.7 : 1.2);
    const labelSize = isMobile ? 0.18 : 0.25;

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4} position={position}>
            <group
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <RoundedBox args={size} radius={0.1} smoothness={4}>
                    <meshStandardMaterial
                        color="#111"
                        transparent
                        opacity={0.8}
                        metalness={0.9}
                        roughness={0.1}
                        emissive={color}
                        emissiveIntensity={hovered ? 0.2 : 0.05}
                    />
                </RoundedBox>

                {/* Glassy Overlay */}
                <RoundedBox args={[size[0] * 0.98, size[1] * 0.98, size[2] + 0.01]} radius={0.1} smoothness={4} position={[0, 0, 0.01]}>
                    <meshStandardMaterial
                        color={color}
                        transparent
                        opacity={0.1}
                        metalness={1}
                        roughness={0}
                    />
                </RoundedBox>

                <group position={[0, 0, size[2] / 2 + 0.05]}>
                    {emoji && (
                        <Text
                            font={FONT_URL}
                            fontSize={isHero ? 0.5 : 0.4}
                            position={[0, isHero ? 0.8 : 0.6, 0]}
                        >
                            {emoji}
                        </Text>
                    )}

                    <Text
                        font={FONT_URL}
                        fontSize={valueSize}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, isHero ? 0.05 : 0.1, 0]}
                        maxWidth={size[0] - 0.5}
                        textAlign="center"
                        lineHeight={1.2}
                    >
                        {value}
                        <meshStandardMaterial
                            color="white"
                            emissive={color}
                            emissiveIntensity={hovered ? 0.5 : 0.2}
                        />
                    </Text>

                    <Text
                        font={FONT_URL}
                        fontSize={labelSize}
                        color="gray"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, isHero ? -0.8 : -0.6, 0]}
                    >
                        {label}
                    </Text>
                </group>
            </group>
        </Float>
    );
};

const StatsScene = ({ isMobile }: { isMobile: boolean }) => {
    const time = useTimeTogether();

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
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff0080" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />

            <Stars radius={100} depth={50} count={isMobile ? 2000 : 5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={isMobile ? 50 : 100} scale={15} size={3} speed={0.4} opacity={0.6} color="#ff0080" />

            <group position={[0, isMobile ? -0.5 : 0, 0]}>
                <Text
                    font={FONT_URL}
                    fontSize={isMobile ? 1.5 : 2.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, isMobile ? 5 : 4.5, -3]}
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

    const cameraZ = isSmallMobile ? 15 : isMobile ? 12 : 9;
    const cameraFov = isSmallMobile ? 45 : 50;

    return (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-black via-[#0d0510] to-black min-h-[320px]">
            <Canvas
                camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
                dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
                gl={{ antialias: true, alpha: false }}
            >
                <StatsScene isMobile={isMobile} />
            </Canvas>

            <div className="absolute bottom-10 w-full text-center pointer-events-none px-4">
                <p className="text-[10px] md:text-xs text-gray-500 font-mono">
                    (Source: My Heart • Updated Real-time • Error: 0%)
                </p>
            </div>
        </div>
    );
};
