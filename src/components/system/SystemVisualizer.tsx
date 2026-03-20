"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Html } from "@react-three/drei";
import { useSystemStore, SecuritySystem, LayerType } from "@/store/systemStore";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface LayerProps {
  type: LayerType;
  radius: number;
  color: string;
  active: boolean;
  failed: boolean;
  opacity: number;
}

function DefenseLayer({ type, radius, color, active, failed, opacity }: LayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && active && !failed) {
      meshRef.current.rotation.y = state.clock.elapsedTime * (0.2 + radius * 0.05);
      meshRef.current.rotation.z = state.clock.elapsedTime * (0.1 + radius * 0.02);
    }
  });

  const materialColor = failed ? "#ff0000" : active ? color : "#333333";
  const materialOpacity = failed ? 0.3 : active ? opacity : 0.1;

  return (
    <group>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef}>
          {type === 'asset' ? (
            <octahedronGeometry args={[radius, 0]} />
          ) : type === 'access' ? (
            <torusGeometry args={[radius, 0.2, 16, 100]} />
          ) : (
            <sphereGeometry args={[radius, 32, 32]} />
          )}
          <meshStandardMaterial
            color={materialColor}
            transparent
            opacity={materialOpacity}
            wireframe={type !== 'asset'}
            emissive={materialColor}
            emissiveIntensity={failed ? 0.8 : active ? 0.5 : 0}
          />
        </mesh>
      </Float>

      {/* Label */}
      <Html position={[radius + 0.5, radius + 0.5, 0]} center>
        <div className={`px-2 py-1 rounded text-xs font-bold backdrop-blur-md transition-colors ${
          failed ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
          active ? 'bg-white/10 text-white/80 border border-white/20' :
          'bg-black/50 text-gray-500 border border-gray-800'
        }`}>
          {type.toUpperCase()}
        </div>
      </Html>
    </group>
  );
}

export function SystemVisualizer({ system }: { system: SecuritySystem }) {
  const { activeLayers, simulationResult } = useSystemStore();

  const layersData = useMemo(() => [
    { type: 'perimeter' as LayerType, radius: 4, color: '#3b82f6', opacity: 0.15 },
    { type: 'detection' as LayerType, radius: 3, color: '#10b981', opacity: 0.2 },
    { type: 'access' as LayerType, radius: 2, color: '#f59e0b', opacity: 0.3 },
    { type: 'response' as LayerType, radius: 1.5, color: '#ef4444', opacity: 0.4 },
    { type: 'asset' as LayerType, radius: 0.5, color: '#fbbf24', opacity: 0.9 },
  ], []);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-gradient-to-b from-black to-zinc-900 overflow-hidden">
      <div className="absolute top-4 left-4 z-10 p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
        <h2 className="text-2xl font-bold mb-1">{system.name}</h2>
        <p className="text-muted-foreground text-sm">{system.category}</p>
      </div>

      <Canvas camera={{ position: [0, 5, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={2} color="#4338ca" />

        {layersData.map((layer) => (
          <DefenseLayer
            key={layer.type}
            type={layer.type}
            radius={layer.radius}
            color={layer.color}
            opacity={layer.opacity}
            active={activeLayers[layer.type]}
            failed={simulationResult?.failedLayers.includes(layer.type) || false}
          />
        ))}

        <OrbitControls enablePan={false} maxDistance={15} minDistance={3} />
        <Environment preset="city" />
      </Canvas>

      {/* Simulation Overlay */}
      {simulationResult && (
        <div className={`absolute bottom-4 left-4 right-4 z-10 p-4 rounded-xl backdrop-blur-md border ${
          simulationResult.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-bold text-lg ${simulationResult.success ? 'text-green-400' : 'text-red-400'}`}>
              {simulationResult.success ? 'System Secure' : 'System Compromised'}
            </h3>
            <div className="text-right">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Weakness Score</span>
              <div className="font-mono text-xl">{simulationResult.weaknessScore}/100</div>
            </div>
          </div>
          <p className="text-sm text-gray-300">{simulationResult.message}</p>
        </div>
      )}
    </div>
  );
}
