import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Stars, PerspectiveCamera, Sparkles, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
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

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} {...props}>
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

// Interactive 3D Text that responds to mouse
const Interactive3DText = ({ isMobile }: { isMobile: boolean }) => {
    const textRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (textRef.current && !isMobile) {
            // Smooth mouse follow effect
            const targetX = (state.mouse.x * Math.PI) / 10;
            const targetY = (state.mouse.y * Math.PI) / 10;

            textRef.current.rotation.x += (targetY - textRef.current.rotation.x) * 0.05;
            textRef.current.rotation.y += (targetX - textRef.current.rotation.y) * 0.05;
        }

        // Gentle floating animation
        if (textRef.current) {
            textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <group ref={textRef}>
                <Text
                    fontSize={isMobile ? 1.5 : 2.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0.5, 0]}
                    maxWidth={isMobile ? 5 : 8}
                    textAlign="center"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    2025 Wrapped
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ff1493"
                        emissiveIntensity={hovered ? 0.6 : 0.4}
                        roughness={0.1}
                        metalness={0.9}
                    />
                </Text>

                <Text
                    fontSize={isMobile ? 0.4 : 0.6}
                    color="#ffb6c1"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, -1.2, 0]}
                    maxWidth={isMobile ? 5 : 7}
                    textAlign="center"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                >
                    It's been quite a year...
                </Text>
            </group>
        </Float>
    );
};

// Animated orbs in background
const AnimatedOrb = ({ position, color, scale }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.003;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <Sphere args={[1, 32, 32]}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={color}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.6}
                />
            </Sphere>
        </mesh>
    );
};

const IntroScene = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, isMobile ? 12 : 8]} />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ff1493" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff69b4" />
            <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffb6c1" />

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={100} scale={15} size={3} speed={0.3} opacity={0.6} color="#fff" />

            <FloatingHearts />

            {/* Animated background orbs */}
            <AnimatedOrb position={[-5, 3, -8]} color="#ff0080" scale={1.5} />
            <AnimatedOrb position={[6, -2, -10]} color="#ff69b4" scale={1.2} />
            <AnimatedOrb position={[0, 5, -12]} color="#ff1493" scale={1} />

            <Interactive3DText isMobile={isMobile} />
        </>
    );
};

export const IntroSlide = () => {
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount
    useState(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    });

    return (
        <div className="w-full h-full relative overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <IntroScene isMobile={isMobile} />
                </Canvas>
            </div>

            {/* Overlay UI */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end items-center pb-10 md:pb-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="text-xs md:text-sm text-gray-400 animate-pulse px-4 text-center"
                >
                    Tap right to continue →
                </motion.div>
            </div>
        </div>
    );
};
