import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, Stars, Sparkles, Center, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

const stats = [
    { label: "Days Together", value: "730+", color: "#ff0080", position: [-3, 1.5, 0] },
    { label: "Coffees Shared", value: "∞", color: "#00ffff", position: [3, 1.5, 0] },
    { label: "Arguments Won", value: "100%", color: "#ffcc00", position: [-3, -1.5, 0] },
    { label: "Happiness Level", value: "9000+", color: "#ff69b4", position: [3, -1.5, 0] },
];

// Animated orbs
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
                    opacity={0.5}
                />
            </Sphere>
        </mesh>
    );
};

const StatItem = ({ label, value, color, position, isMobile }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current && !isMobile) {
            const targetX = (state.mouse.x * Math.PI) / 20;
            const targetY = (state.mouse.y * Math.PI) / 20;

            groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
            groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
        }

        if (groupRef.current) {
            groupRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.001;
        }
    });

    const fontSize = isMobile ? 0.9 : 1.2;
    const labelSize = isMobile ? 0.25 : 0.3;

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={position}>
            <Center>
                <group ref={groupRef}>
                    <Text
                        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                        fontSize={fontSize}
                        color={color}
                        anchorX="center"
                        anchorY="middle"
                        position={[0, 0, 0]}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                    >
                        {value}
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={hovered ? 0.8 : 0.5}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </Text>
                    <Text
                        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                        fontSize={labelSize}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        position={[0, -1, 0]}
                    >
                        {label}
                    </Text>
                </group>
            </Center>
        </Float>
    );
};

// Interactive title
const InteractiveTitle = ({ isMobile }: { isMobile: boolean }) => {
    const textRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (textRef.current && !isMobile) {
            const targetX = (state.mouse.x * Math.PI) / 15;
            const targetY = (state.mouse.y * Math.PI) / 15;

            textRef.current.rotation.x += (targetY - textRef.current.rotation.x) * 0.05;
            textRef.current.rotation.y += (targetX - textRef.current.rotation.y) * 0.05;
        }

        if (textRef.current) {
            textRef.current.position.y = 3.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    const fontSize = isMobile ? 1.5 : 2;

    return (
        <mesh ref={textRef}>
            <Text
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                fontSize={fontSize}
                color="white"
                anchorX="center"
                anchorY="middle"
                position={[0, 0, -2]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                The Data 📊
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ff1493"
                    emissiveIntensity={hovered ? 0.5 : 0.2}
                    metalness={0.9}
                    roughness={0.1}
                />
            </Text>
        </mesh>
    );
};

const StatsScene = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ff1493" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff69b4" />
            <pointLight position={[0, 10, 5]} intensity={1.5} color="#00ffff" />

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
            <Sparkles count={100} scale={15} size={3} speed={0.3} opacity={0.6} color="#ff0080" />

            {/* Animated background orbs */}
            <AnimatedOrb position={[-5, 2, -10]} color="#ff0080" scale={1.5} />
            <AnimatedOrb position={[6, -3, -12]} color="#00ffff" scale={1.2} />
            <AnimatedOrb position={[0, 4, -8]} color="#ffcc00" scale={1} />

            <group position={[0, 0, 0]}>
                <InteractiveTitle isMobile={isMobile} />

                {stats.map((stat, index) => (
                    <StatItem key={index} {...stat} isMobile={isMobile} delay={index * 0.2} />
                ))}
            </group>
        </>
    );
};

export const StatsSlide = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden bg-black">
            <Canvas camera={{ position: [0, 0, isMobile ? 10 : 8], fov: 50 }}>
                <StatsScene isMobile={isMobile} />
            </Canvas>

            <div className="absolute bottom-6 md:bottom-10 w-full text-center pointer-events-none">
                <p className="text-[10px] md:text-xs text-gray-500 font-mono px-4">
                    (Source: My Heart, 2025 • Margin of error: 0%)
                </p>
            </div>
        </div>
    );
};
