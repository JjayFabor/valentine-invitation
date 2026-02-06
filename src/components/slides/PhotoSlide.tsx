import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image, Float, Sparkles, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

const PHOTO = {
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop",
    caption: "Our Beautiful Memory 💕"
};

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
            <extrudeGeometry args={[shape, { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 }]} />
            <meshStandardMaterial color={color || "#ff0080"} roughness={0.2} metalness={0.5} emissive={color || "#ff0080"} emissiveIntensity={0.3} />
        </mesh>
    );
};

const FloatingHearts = () => {
    const hearts = useMemo(() => {
        return new Array(20).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10 - 5
            ],
            scale: Math.random() * 0.5 + 0.2,
            rotation: [0, 0, Math.random() * Math.PI],
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

// Interactive photo frame
const InteractivePhotoFrame = ({ isMobile }: { isMobile: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current && !isMobile) {
            const targetX = (state.mouse.x * Math.PI) / 15;
            const targetY = (state.mouse.y * Math.PI) / 15;

            groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
            groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
        }

        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
    });

    const scale = isMobile ? [4, 2.8] : [5, 3.5];
    const frameScale = isMobile ? [4.2, 3, 0.1] : [5.2, 3.7, 0.1];

    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <group ref={groupRef}>
                <Image
                    url={PHOTO.url}
                    scale={scale as [number, number]}
                    transparent
                    opacity={1}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                />
                {/* Frame border */}
                <mesh position={[0, 0, -0.1]}>
                    <boxGeometry args={frameScale as [number, number, number]} />
                    <meshStandardMaterial
                        color={hovered ? "#ff69b4" : "#ffc0cb"}
                        metalness={0.8}
                        roughness={0.2}
                        emissive={hovered ? "#ff69b4" : "#ffc0cb"}
                        emissiveIntensity={hovered ? 0.3 : 0.1}
                    />
                </mesh>
            </group>
        </Float>
    );
};

const PhotoScene = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff1493" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff69b4" />
            <pointLight position={[0, 10, 5]} intensity={1.2} color="#ffb6c1" />

            <Sparkles count={100} scale={15} size={3} speed={0.3} opacity={0.6} color="#fff" />

            <FloatingHearts />

            {/* Animated background orbs */}
            <AnimatedOrb position={[-6, 3, -8]} color="#ff0080" scale={1.2} />
            <AnimatedOrb position={[6, -2, -10]} color="#ff69b4" scale={1} />
            <AnimatedOrb position={[0, 5, -12]} color="#ffc0cb" scale={0.8} />

            <InteractivePhotoFrame isMobile={isMobile} />
        </>
    );
};

export const PhotoSlide = () => {
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
                <PhotoScene isMobile={isMobile} />
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 pointer-events-none z-10">
                <div className="mt-4 sm:mt-6 md:mt-10 text-center px-2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-400 drop-shadow-lg font-serif">Memory Lane</h2>
                </div>

                <div className="mb-12 sm:mb-16 md:mb-20 text-center px-2">
                    <div className="bg-black/50 backdrop-blur-md p-2.5 sm:p-3 md:p-4 rounded-xl inline-block">
                        <p className="text-white font-medium text-sm sm:text-base md:text-lg italic">
                            "{PHOTO.caption}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
