import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { FloatingHeart } from './FloatingHeart';
import { Suspense } from 'react';

export function ProposalScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00cc" />

                    <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                    <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} color="#ffb6c1" />

                    {/* Random Hearts Background */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <FloatingHeart
                            key={i}
                            position={[
                                (Math.random() - 0.5) * 15,
                                (Math.random() - 0.5) * 10,
                                (Math.random() - 0.5) * 5 - 2
                            ]}
                        />
                    ))}
                </Suspense>
            </Canvas>
        </div>
    );
}
