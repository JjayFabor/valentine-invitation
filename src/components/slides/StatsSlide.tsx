import { Canvas } from "@react-three/fiber";
import { Text, Float, Stars, Sparkles, Center } from "@react-three/drei";

const stats = [
    { label: "Days Together", value: "730+", color: "#ff0080", position: [-3, 1.5, 0] },
    { label: "Coffees Shared", value: "∞", color: "#00ffff", position: [3, 1.5, 0] },
    { label: "Arguments Won", value: "100%", color: "#ffcc00", position: [-3, -1.5, 0] },
    { label: "Happiness Level", value: "9000+", color: "#ff69b4", position: [3, -1.5, 0] },
];

const StatItem = ({ label, value, color, position }: any) => {
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={position}>
            <Center>
                <group>
                    <Text
                        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                        fontSize={1.2}
                        color={color}
                        anchorX="center"
                        anchorY="middle"
                        position={[0, 0, 0]}
                    >
                        {value}
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                    </Text>
                    <Text
                        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                        fontSize={0.3}
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

const StatsScene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="white" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={50} scale={10} size={3} speed={0.4} opacity={0.5} color="#ff0080" />

            <group position={[0, 0, 0]}>
                <Text
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                    fontSize={2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 3.5, -2]}
                >
                    The Data 📊
                    <meshStandardMaterial color="#ffffff" />
                </Text>

                {stats.map((stat, index) => (
                    <StatItem key={index} {...stat} delay={index * 0.2} />
                ))}
            </group>
        </>
    );
};

export const StatsSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-black/90">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <StatsScene />
            </Canvas>

            <div className="absolute bottom-10 w-full text-center pointer-events-none">
                <p className="text-xs text-gray-500 font-mono">
                    (Source: My Heart, 2025 • Margin of error: 0%)
                </p>
            </div>
        </div>
    );
};
