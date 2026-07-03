'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FurniturePlaceholder() {
	const meshRef = useRef<THREE.Mesh>(null);

	return (
		<mesh ref={meshRef} castShadow receiveShadow>
			{/* Rounded/soft cube simulating a luxury stool/ottoman */}
			<boxGeometry args={[1.5, 1, 1.5]} />
			<meshStandardMaterial color="#FAF6F0" roughness={0.3} metalness={0.1} />
		</mesh>
	);
}

export default function Showroom() {
	return (
		<div className="w-full h-[500px] rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#EAE1D9] shadow-inner">
			<Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
				<ambientLight intensity={0.7} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
				<Stage intensity={0.5} environment="city" adjustCamera={false}>
					<FurniturePlaceholder />
				</Stage>
				<OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
			</Canvas>
		</div>
	);
}
