    import { OrbitControls } from "@react-three/drei";
    import { motion } from "framer-motion";
    import { PopularUseCases} from "./PopularUseCases"
    import { Canvas, useFrame } from "@react-three/fiber";
    import { Suspense, useRef } from "react";

    const AnimatedTorus = () => {
        const meshRef = useRef<any>(null);
        
            useFrame(() => {
            if (meshRef.current) {
                meshRef.current.rotation.x += 0.01;
                meshRef.current.rotation.y += 0.01;
            }
            });
        
            return (
            <mesh ref={meshRef} rotation={[0.4, 0.2, 0]}>
                <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
                <meshStandardMaterial color="#38bdf8" />
            </mesh>
            );
        };
        
export default function AnimatedCanvas() {
            return (
            <Canvas className="h-64 w-full">
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                <AnimatedTorus />
                </Suspense>
                <OrbitControls enableZoom={false} />
            </Canvas>
            );
    }

    export function KnowTrigger() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
        <section className="grid md:grid-cols-2 gap-8 p-10 items-center">
            <div>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold mb-4"
            >
                Automate Your Workflow Without Writing Code
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg mb-6"
            >
                Connect your favorite apps to move data, send notifications, or trigger actions — automatically.
            </motion.p>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex gap-4"
            >
            </motion.div>
            </div>

            <div className="h-64">
                <AnimatedCanvas />
            </div>
        </section>

        <PopularUseCases/>
        </div>
    );
    }
