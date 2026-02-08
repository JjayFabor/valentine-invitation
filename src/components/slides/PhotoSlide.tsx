import { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Sparkles, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

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

    return (
        <mesh {...props}>
            <extrudeGeometry args={[shape, { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 }]} />
            <meshStandardMaterial color={color || "#ff0080"} roughness={0.2} metalness={0.5} />
        </mesh>
    );
};

const FloatingHearts = () => {
    const hearts = useMemo(() => {
        return new Array(15).fill(0).map(() => ({
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
                <Float key={i} speed={1 + Math.random()} rotationIntensity={1} floatIntensity={1}>
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

const VideoFrame = () => {
    const texture = useVideoTexture(VIDEO_DATA.url, {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        start: true,
    });

    return (
        <mesh scale={[5, 3.5, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
}

const PhotoScene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ffcccc" />
            <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} color="#fff" />

            <FloatingHearts />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <group position={[0, 0, 0]}>
                    <Suspense fallback={<mesh scale={[5, 3.5, 0.1]}><planeGeometry /><meshStandardMaterial color="#333" /></mesh>}>
                        <VideoFrame />
                    </Suspense>
                    {/* Frame border */}
                    <mesh position={[0, 0, -0.1]}>
                        <boxGeometry args={[5.2, 3.7, 0.1]} />
                        <meshStandardMaterial color="#ffc0cb" metalness={0.8} roughness={0.2} />
                    </mesh>
                </group>
            </Float>
        </>
    );
};

export const PhotoSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-black/90">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <PhotoScene />
            </Canvas>

            {/* Overlay UI */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none z-10">
                <div className="mt-10 text-center">
                    <h2 className="text-3xl font-bold text-pink-400 drop-shadow-lg font-serif">Memory Lane</h2>
                </div>

                <div className="mb-20 text-center">
                    <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl inline-block">
                        <p className="text-white font-medium text-lg italic">
                            "{VIDEO_DATA.caption}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
