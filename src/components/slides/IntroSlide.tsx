import { Canvas } from "@react-three/fiber";
import { Text, Float, Stars, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo } from "react";
import * as THREE from "three";

const HeartShape = ({ color, ...props }: any) => {
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

    return (
        <mesh {...props}>
            <extrudeGeometry args={[shape, { depth: 0.3, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 }]} />
            <meshStandardMaterial color={color || "#ff0080"} roughness={0.2} metalness={0.8} emissive={color || "#ff0080"} emissiveIntensity={0.3} />
        </mesh>
    );
};

const FloatingHearts = () => {
    const hearts = useMemo(() => {
        return new Array(25).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15 - 5
            ],
            scale: Math.random() * 0.8 + 0.3,
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
            color: Math.random() > 0.5 ? "#ff0080" : "#ff69b4"
        }));
    }, []);

    return (
        <>
            {hearts.map((data, i) => (
                <Float key={i} speed={0.5 + Math.random() * 0.5} rotationIntensity={0.5} floatIntensity={1}>
                    <HeartShape
                        position={data.position as [number, number, number]}
                        scale={data.scale}
                        rotation={data.rotation as [number, number, number]}
                        color={data.color}
                    />
                </Float>
            ))}
        </>
    );
};

const IntroScene = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 12 : 8]} />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ff1493" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff69b4" />
            <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffb6c1" />

            <Stars radius={100} depth={50} count={isMobile ? 1500 : 3000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={isMobile ? 50 : 100} scale={15} size={3} speed={0.3} opacity={0.6} color="#fff" />

            <FloatingHearts />

            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
                <Text
                    fontSize={isMobile ? 1.2 : 2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0.5, 0]}
                    maxWidth={isMobile ? 5 : 7}
                    textAlign="center"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                >
                    2025 Wrapped
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ff1493"
                        emissiveIntensity={0.4}
                        roughness={0.1}
                        metalness={0.9}
                    />
                </Text>

                <Text
                    fontSize={isMobile ? 0.35 : 0.5}
                    color="#ffb6c1"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, -1.2, 0]}
                    maxWidth={isMobile ? 4 : 6}
                    textAlign="center"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                >
                    It's been quite a year...
                </Text>
            </Float>
        </>
    );
};

export const IntroSlide = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="w-full h-full relative overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <IntroScene />
                </Canvas>
            </div>

            {/* Overlay UI */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end items-center pb-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="text-sm text-gray-400 animate-pulse"
                >
                    {isMobile ? "Swipe to continue →" : "Swipe or Click right to continue →"}
                </motion.div>
            </div>
        </div>
    );
};
