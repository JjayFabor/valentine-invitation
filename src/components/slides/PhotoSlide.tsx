import { useMemo, Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, useVideoTexture, Text } from "@react-three/drei";
import * as THREE from "three";

const FONT_URL = "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

const VIDEO_DATA = {
    url: "/vid.MP4",
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

const VideoFrame = ({ isMobile }: { isMobile: boolean }) => {
    const texture = useVideoTexture(VIDEO_DATA.url, {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        start: true,
        playsInline: true,
        crossOrigin: "anonymous",
    });

    const scale: [number, number, number] = isMobile ? [4, 2.8, 1] : [5, 3.5, 1];

    return (
        <mesh scale={scale}>
            <planeGeometry />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
}

const PhotoScene = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#ff0080" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
            <Sparkles count={isMobile ? 50 : 100} scale={12} size={2} speed={0.4} opacity={0.5} color="#fff" />

            <FloatingHearts />

            {/* Title */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text
                    font={FONT_URL}
                    fontSize={isMobile ? 0.8 : 1.2}
                    color="#ff69b4"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, isMobile ? 4.5 : 4, -2]}
                >
                    Memory Lane
                    <meshStandardMaterial color="#ff69b4" emissive="#ff0080" emissiveIntensity={2} />
                </Text>
            </Float>

            {/* Video Content */}
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
                <group position={[0, isMobile ? 0.3 : 0, 0]}>
                    <Suspense fallback={<mesh scale={[isMobile ? 4 : 5, isMobile ? 2.8 : 3.5, 0.1]}><planeGeometry /><meshStandardMaterial color="#333" /></mesh>}>
                        <VideoFrame isMobile={isMobile} />
                    </Suspense>
                    {/* Frame border with glow */}
                    <mesh position={[0, 0, -0.1]}>
                        <boxGeometry args={[isMobile ? 4.2 : 5.2, isMobile ? 3 : 3.7, 0.1]} />
                        <meshStandardMaterial color="#ff0080" emissive="#ff0080" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>
            </Float>

            {/* Caption */}
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
                <Text
                    font={FONT_URL}
                    fontSize={isMobile ? 0.4 : 0.6}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, isMobile ? -3.5 : -3, 0]}
                    maxWidth={isMobile ? 6 : 10}
                    textAlign="center"
                    fontStyle="italic"
                >
                    "{VIDEO_DATA.caption}"
                    <meshStandardMaterial color="white" emissive="#ff69b4" emissiveIntensity={0.8} />
                </Text>
            </Float>
        </>
    );
};

export const PhotoSlide = (_props: any) => {
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
            <Canvas camera={{ position: [0, 0, isMobile ? 12 : 10], fov: 50 }}>
                <PhotoScene isMobile={isMobile} />
            </Canvas>

            {/* Swipe prompt integration */}
            <div className="absolute bottom-10 inset-0 flex flex-col justify-end items-center pointer-events-none z-20">
                <p className="text-[10px] md:text-xs text-gray-500 font-mono opacity-60">
                    (Memory captured with Love • Real-time Playback)
                </p>
            </div>
        </div>
    );
};
