import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { scrollBus } from '../lib/scrollBus';

function Core() {
  const mesh = useRef<THREE.Mesh>(null!);
  const group = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!mesh.current || !group.current) return;
    mesh.current.rotation.x += delta * 0.15;
    mesh.current.rotation.y += delta * 0.2;

    const p = scrollBus.progress;
    // Drift the core across the page as user scrolls
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, -3 + p * 6, 0.08);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0.5 - p * 1.2, 0.08);
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, 1 - p * 0.3, 0.08));

    // Subtle breathing on cursor
    const t = state.clock.elapsedTime;
    mesh.current.position.y = Math.sin(t * 0.6) * 0.08;
  });

  return (
    <group ref={group} position={[-3, 0.5, 0]}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.7, 24]} />
          <MeshDistortMaterial
            color="#0a1628"
            emissive="#1ea7ff"
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.85}
            distort={0.42}
            speed={1.6}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Particles({ count = 600 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.02;
    points.current.rotation.x += delta * 0.005;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#7fd6ff"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Rig() {
  useFrame((state) => {
    const p = scrollBus.progress;
    const cam = state.camera;
    cam.position.z = THREE.MathUtils.lerp(cam.position.z, 6 + p * 2.5, 0.06);
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, p * 1.5, 0.06);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-0 pointer-events-none"
      style={{ background: 'radial-gradient(circle at 30% 20%, #0a1020 0%, #04060b 60%, #020306 100%)' }}
    >
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#04060b']} />
        <fog attach="fog" args={['#04060b', 8, 22]} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#bfe6ff" />
        <pointLight position={[-4, -2, -3]} intensity={2.0} color="#1ea7ff" distance={12} />
        <pointLight position={[3, 3, -2]} intensity={1.2} color="#ff6a3d" distance={10} />

        <Suspense fallback={null}>
          <Environment preset="night" />
          <Core />
          <Particles />
          <Stars radius={60} depth={40} count={1800} factor={2} fade speed={0.4} />
        </Suspense>

        <Rig />

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.5} mipmapBlur />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0008, 0.0008)}
            blendFunction={BlendFunction.NORMAL}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
