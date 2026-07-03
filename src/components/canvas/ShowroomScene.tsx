'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Stage } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { useMemo } from 'react';
import Chair from './Chair';

interface ShowroomSceneProps {
	scrollRotation?: number; // Linked dynamically to GSAP ScrollTrigger
}

export default function ShowroomScene({ scrollRotation = 0 }: ShowroomSceneProps) {
	// Set device pixel ratio strictly capped at 2 to maximize battery & performance
	const dprValue = useMemo(() => {
		if (typeof window === 'undefined') return 1;
		return Math.min(2, window.devicePixelRatio);
	}, []);

	return (
		<div className="w-full h-full relative">
			<Canvas
				shadows
				frameloop="demand" // On-demand drawing to conserve CPU/GPU
				dpr={dprValue}
				camera={{ position: [0, 0.4, 3.2], fov: 45 }}
				className="bg-transparent"
			>
				{/* Ambient studio lights */}
				<ambientLight intensity={0.65} />
				<directionalLight
					position={[5, 10, 5]}
					intensity={1.2}
					castShadow
					shadow-mapSize-width={1024}
					shadow-mapSize-height={1024}
				/>
				<spotLight position={[-5, 8, -5]} intensity={0.4} />

				{/* Showroom Chair element with GLSL seam shader */}
				<Stage intensity={0} environment="studio" adjustCamera={false}>
					<Chair scrollRotation={scrollRotation} />
				</Stage>

				{/* High-fidelity ground shadows */}
				<ContactShadows
					position={[0, -0.82, 0]}
					opacity={0.45}
					scale={10}
					blur={2.4}
					far={1.5}
				/>

				{/* Orbit controls with locks to prevent clipping */}
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					minPolarAngle={Math.PI / 3}
					maxPolarAngle={Math.PI / 1.8}
				/>

				{/* Cinematic Post-Processing Composers */}
				<EffectComposer multisampling={4}>
					{/* Subtle Bloom highlight for glowing details/seams */}
					<Bloom
						intensity={0.8}
						luminanceThreshold={0.25}
						luminanceSmoothing={0.9}
						mipmapBlur
					/>
					{/* Tactile film grain overlay */}
					<Noise opacity={0.03} />
				</EffectComposer>
			</Canvas>
		</div>
	);
}
