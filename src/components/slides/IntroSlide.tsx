import { Canvas, useFrame } from "@react-three/fiber";
import {
    Text,
    Float,
    Stars,
    Sparkles,
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


const IntroScene = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ff1493" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff69b4" />
            <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffb6c1" />

            <Stars radius={100} depth={50} count={isMobile ? 1500 : 3000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={isMobile ? 50 : 100} scale={15} size={3} speed={0.3} opacity={0.6} color="#fff" />

            <FloatingHearts />

            <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
                <Text
                    fontSize={isMobile ? 1.2 : 2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0.5, 0]}
                    maxWidth={isMobile ? 5 : 7}
                    textAlign="center"
                    font={FONT_URL}
                >
                    2025 Wrapped
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ff1493"
                        emissiveIntensity={2.5}
                        roughness={0.1}
                        metalness={0.9}
                    />
                </Text>
            </Float>

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
                <Text
                    fontSize={isMobile ? 0.35 : 0.5}
                    color="#ffb6c1"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, -1.2, 0]}
                    maxWidth={isMobile ? 4 : 6}
                    textAlign="center"
                    font={FONT_URL}
                >
                    It's been quite a year...
                    <meshStandardMaterial
                        color="#ffb6c1"
                        emissive="#ff69b4"
                        emissiveIntensity={0.8}
                        transparent
                        opacity={0.9}
                    />
                </Text>
            </Float>
        </>
    );
};

export const IntroSlide = (_props: any) => {
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
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-black via-[#0a0510] to-black min-h-[320px]">
            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
                    dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
                    gl={{ antialias: true, alpha: false }}
                >
                    <IntroScene isMobile={isMobile} />
                </Canvas>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end items-center pb-8 sm:pb-10 md:pb-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="text-[10px] sm:text-xs md:text-sm text-gray-400 animate-pulse px-4 text-center"
                >
                    {isMobile ? "Swipe to continue →" : "Swipe or Click right to continue →"}
                </motion.div>
            </div>
        </div>
    );
};
