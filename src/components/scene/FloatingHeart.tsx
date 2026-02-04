import * as THREE from 'three';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export function FloatingHeart(props: any) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [speed] = useState(() => Math.random() * 0.5 + 0.2);
    const [rotationSpeed] = useState(() => Math.random() * 0.5 + 0.2);

    // Heart shape
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1
    };

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * rotationSpeed;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2 + Math.PI; // Gentle nod, keep uprightish
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1} floatingRange={[-0.5, 0.5]}>
            <mesh ref={meshRef} {...props} scale={0.05} rotation={[Math.PI, 0, 0]}>
                <extrudeGeometry args={[heartShape, extrudeSettings]} />
                <meshStandardMaterial
                    color="#ff69b4"
                    emissive="#ff1493"
                    emissiveIntensity={0.2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
}
