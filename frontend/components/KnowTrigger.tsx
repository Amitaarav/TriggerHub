"use client"
import { OrbitControls } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PopularUseCases} from "./PopularUseCases"
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three"

const AnimatedTorus = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [colorShift, setColorShift] = useState(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Rotation
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;

    // Floating effect
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;

    // Pulsing scale
    const scale = 1 + 0.1 * Math.sin(state.clock.elapsedTime * 2);
    meshRef.current.scale.set(scale, scale, scale);

    // Color shifting
    setColorShift((prev: any) => (prev + delta * 0.5) % 1);
    (meshRef.current.material as THREE.MeshStandardMaterial).color.setHSL(colorShift, 1, 0.5);
  });

  return (
    <mesh ref={meshRef} rotation={[1.4, 0.2, 0]}>
      <torusKnotGeometry args={[1.5, 0.4, 150, 80]} />
      <meshStandardMaterial />
    </mesh>
  );
};

export default function AnimatedCanvas() {
  return (
    <div className="w-full h-64  rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <AnimatedTorus />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

export function KnowTrigger() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
        <section className="grid md:grid-cols-2 gap-8 p-10 items-center ml-10">
            <div>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold mb-4 text-gray-800"
            >
                Automate Your Workflow Without Writing Code
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg mb-6 text-gray-600"
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
