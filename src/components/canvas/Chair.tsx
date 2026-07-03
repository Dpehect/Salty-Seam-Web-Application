'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChairProps {
	scrollRotation?: number; // Passed from GSAP/ScrollTrigger binding
}

export default function Chair({ scrollRotation = 0 }: ChairProps) {
	const groupRef = useRef<THREE.Group>(null);
	const materialRef = useRef<THREE.ShaderMaterial>(null);

	// Custom GLSL shader material that creates a textural fabric and highlighted accent seams
	const shaderMaterialData = useMemo(() => {
		return {
			uniforms: {
				uTime: { value: 0 }
			},
			vertexShader: `
				varying vec2 vUv;
				varying vec3 vNormal;
				void main() {
					vUv = uv;
					vNormal = normalize(normalMatrix * normal);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				varying vec2 vUv;
				varying vec3 vNormal;
				uniform float uTime;

				void main() {
					// Luxury cream fabric base color
					vec3 baseColor = vec3(0.985, 0.975, 0.96);
					
					// Highlight the edges/borders of each face geometry to represent sewn seams
					float borderX = smoothstep(0.04, 0.0, vUv.x) + smoothstep(0.96, 1.0, vUv.x);
					float borderY = smoothstep(0.04, 0.0, vUv.y) + smoothstep(0.96, 1.0, vUv.y);
					float seamIntensity = clamp(borderX + borderY, 0.0, 1.0);

					// Premium accents for the highlighted seams (Pink, Orange, and Golden Yellow)
					vec3 pink = vec3(1.0, 0.29, 0.46);      // #FF4A76
					vec3 orange = vec3(1.0, 0.48, 0.0);    // #FF7B00
					vec3 yellow = vec3(0.96, 0.77, 0.09);  // #F5C518

					// Interpolate seam highlight colors dynamically over time and coordinates
					vec3 highlightColor = mix(pink, orange, sin(uTime * 1.5 + vUv.y * 6.0) * 0.5 + 0.5);
					highlightColor = mix(highlightColor, yellow, cos(uTime * 1.0 + vUv.x * 4.0) * 0.3 + 0.3);

					// Combine fabric with highlighted seams
					vec3 finalColor = mix(baseColor, highlightColor, seamIntensity * 0.95);

					// Diffuse shading with high-end ambient bounce lighting
					vec3 normal = normalize(vNormal);
					vec3 lightDirection = normalize(vec3(3.0, 5.0, 3.0));
					float ndl = max(dot(normal, lightDirection), 0.0) * 0.55 + 0.45;

					gl_FragColor = vec4(finalColor * ndl, 1.0);
				}
			`
		};
	}, []);

	// Animate time uniform and apply scroll rotation smoothly
	useFrame((state, delta) => {
		if (materialRef.current) {
			materialRef.current.uniforms.uTime.value += delta;
		}

		if (groupRef.current) {
			// Slow drifting animation + scroll rotation combined
			const drift = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.05;
			groupRef.current.rotation.y = scrollRotation + drift;
			groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.03;
		}
	});

	return (
		<group ref={groupRef} position={[0, -0.4, 0]}>
			{/* 1. Flat Ottoman Seat Cushion */}
			<mesh position={[0, 0, 0]} castShadow receiveShadow>
				<boxGeometry args={[1.6, 0.35, 1.6]} />
				<shaderMaterial
					ref={materialRef}
					args={[shaderMaterialData]}
					transparent
				/>
			</mesh>

			{/* 2. Curved Backrest */}
			<mesh position={[0, 0.65, -0.65]} rotation={[0.08, 0, 0]} castShadow receiveShadow>
				<boxGeometry args={[1.6, 0.95, 0.3]} />
				<shaderMaterial
					args={[shaderMaterialData]}
					transparent
				/>
			</mesh>

			{/* 3. Luxury Wood Supports (Oak styling) */}
			<group position={[0, -0.2, 0]}>
				{/* Front-left leg */}
				<mesh position={[-0.65, -0.4, 0.65]} castShadow>
					<cylinderGeometry args={[0.08, 0.05, 0.8]} />
					<meshStandardMaterial color="#D4C5B3" roughness={0.5} />
				</mesh>
				{/* Front-right leg */}
				<mesh position={[0.65, -0.4, 0.65]} castShadow>
					<cylinderGeometry args={[0.08, 0.05, 0.8]} />
					<meshStandardMaterial color="#D4C5B3" roughness={0.5} />
				</mesh>
				{/* Back-left leg */}
				<mesh position={[-0.65, -0.4, -0.65]} castShadow>
					<cylinderGeometry args={[0.08, 0.05, 0.8]} />
					<meshStandardMaterial color="#D4C5B3" roughness={0.5} />
				</mesh>
				{/* Back-right leg */}
				<mesh position={[0.65, -0.4, -0.65]} castShadow>
					<cylinderGeometry args={[0.08, 0.05, 0.8]} />
					<meshStandardMaterial color="#D4C5B3" roughness={0.5} />
				</mesh>
			</group>
		</group>
	);
}
