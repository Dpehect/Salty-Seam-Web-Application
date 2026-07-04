'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeStore } from '@/components/store/useThemeStore';
import { gsap } from '@/lib/gsap';

interface ChairProps {
	scrollRotation?: number; // Synced with GSAP scroll timeline
}

export default function Chair({ scrollRotation = 0 }: ChairProps) {
	const groupRef = useRef<THREE.Group>(null);
	const materialRef = useRef<THREE.ShaderMaterial>(null);
	const backMaterialRef = useRef<THREE.ShaderMaterial>(null);
	const legsMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

	// Target values for lerped mouse drift and swatches rotation offset
	const targetGalleryRot = useRef(0);
	const scrollSpeedRef = useRef(0);

	// Custom GLSL shader material setup
	const shaderMaterialData = useMemo(() => {
		return {
			uniforms: {
				uTime: { value: 0 },
				uBaseColor: { value: new THREE.Color('#FAF8F5') },
				uRoughness: { value: 0.45 },
				uSeamGlow: { value: 0.12 },
				uScrollGlow: { value: 0.0 }
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
				uniform vec3 uBaseColor;
				uniform float uRoughness;
				uniform float uSeamGlow;
				uniform float uScrollGlow;

				void main() {
					// 1. Procedural fabric grain using fine noise modulated by roughness
					float noiseVal = fract(sin(dot(vUv * 130.0, vec2(12.9898, 78.233))) * 43758.5453);
					vec3 fabricBase = uBaseColor + (noiseVal - 0.5) * 0.022 * (uRoughness + 0.25);
					
					// 2. Compute seam contours near box geometry face boundaries
					float borderX = smoothstep(0.04, 0.0, vUv.x) + smoothstep(0.96, 1.0, vUv.x);
					float borderY = smoothstep(0.04, 0.0, vUv.y) + smoothstep(0.96, 1.0, vUv.y);
					float seamIntensity = clamp(borderX + borderY, 0.0, 1.0);

					// 3. Elegant, desaturated luxury pastel interior accents
					vec3 rose = vec3(0.74, 0.44, 0.47);      // Muted Dusty Rose
					vec3 gold = vec3(0.85, 0.77, 0.65);      // Muted Champagne Gold
					vec3 clay = vec3(0.75, 0.50, 0.40);      // Muted Terracotta

					// Slow coordinates-based color shifting cycle
					vec3 highlightColor = mix(rose, clay, sin(uTime * 0.75 + vUv.y * 5.0) * 0.5 + 0.5);
					highlightColor = mix(highlightColor, gold, cos(uTime * 0.5 + vUv.x * 3.0) * 0.3 + 0.3);

					// 4. Seam is modulated by lighting angles to only catch specular highlights (not neon glow)
					vec3 normal = normalize(vNormal);
					vec3 lightDirection = normalize(vec3(3.0, 5.0, 3.0));
					float ndl = max(dot(normal, lightDirection), 0.0) * 0.55 + 0.45;

					// Highlight glows softly when scrolling is active
					float finalGlow = seamIntensity * (uSeamGlow + uScrollGlow * 0.45) * clamp(ndl, 0.25, 1.0);
					vec3 finalColor = mix(fabricBase, highlightColor, finalGlow);

					gl_FragColor = vec4(finalColor * ndl, 1.0);
				}
			`
		};
	}, []);

	// Zustand subscription: updates shader uniforms transiently (0 React re-renders)
	useEffect(() => {
		const unsubscribe = useThemeStore.subscribe((state) => {
			// 1. Transition Fabric colors
			const fabricColor = new THREE.Color('#FAF8F5');
			let roughnessValue = 0.45;
			let seamGlowValue = 0.12;

			if (state.fabricType === 'boucle-cream') {
				fabricColor.set('#FAF8F5');
				roughnessValue = 0.55;
				seamGlowValue = 0.12;
			} else if (state.fabricType === 'nubuck-amber') {
				fabricColor.set('#E6D7BD');
				roughnessValue = 0.35;
				seamGlowValue = 0.22;
			} else if (state.fabricType === 'velvet-ochre') {
				fabricColor.set('#D9B48F');
				roughnessValue = 0.70;
				seamGlowValue = 0.32;
			}

			const tweenUniforms = (mat: THREE.ShaderMaterial | null) => {
				if (!mat) return;
				// GSAP animate colors and float uniform values with custom 'luxury' ease
				gsap.to(mat.uniforms.uBaseColor.value, {
					r: fabricColor.r,
					g: fabricColor.g,
					b: fabricColor.b,
					duration: 1.2,
					ease: 'luxury'
				});
				gsap.to(mat.uniforms, {
					'uRoughness.value': roughnessValue,
					'uSeamGlow.value': seamGlowValue,
					duration: 1.2,
					ease: 'luxury'
				});
			};

			tweenUniforms(materialRef.current);
			tweenUniforms(backMaterialRef.current);

			// 2. Transition Wood Leg color finishes
			const woodColor = new THREE.Color('#D4C5B3');
			let woodRoughness = 0.55;

			if (state.woodFinish === 'white-oak') {
				woodColor.set('#D4C5B3');
				woodRoughness = 0.55;
			} else if (state.woodFinish === 'natural-walnut') {
				woodColor.set('#7C5E43');
				woodRoughness = 0.42;
			} else if (state.woodFinish === 'ebonized-ash') {
				woodColor.set('#2D2B2A');
				woodRoughness = 0.65;
			}

			if (legsMaterialRef.current) {
				gsap.to(legsMaterialRef.current.color, {
					r: woodColor.r,
					g: woodColor.g,
					b: woodColor.b,
					duration: 1.2,
					ease: 'luxury'
				});
				gsap.to(legsMaterialRef.current, {
					roughness: woodRoughness,
					duration: 1.2,
					ease: 'luxury'
				});
			}

			// 3. Transition Gallery rotation targets
			gsap.to(targetGalleryRot, {
				current: state.galleryRotationOffset,
				duration: 1.4,
				ease: 'luxury'
			});
		});

		return () => unsubscribe();
	}, []);

	// R3F Render frame ticks
	useFrame((state, delta) => {
		// Calculate instantaneous scroll speed to drive dynamic seam highlight flash
		if (materialRef.current && backMaterialRef.current) {
			materialRef.current.uniforms.uTime.value += delta;
			backMaterialRef.current.uniforms.uTime.value += delta;

			// Decelerate scroll glow uniform back to resting state
			const currentGlow = materialRef.current.uniforms.uScrollGlow.value;
			const decay = currentGlow - currentGlow * 4.0 * delta;
			materialRef.current.uniforms.uScrollGlow.value = Math.max(0, decay);
			backMaterialRef.current.uniforms.uScrollGlow.value = Math.max(0, decay);
		}

		if (groupRef.current) {
			// Subtle interactive drift combined with mouse pointer position (smooth lerped)
			const targetRotY = scrollRotation + targetGalleryRot.current + state.pointer.x * 0.18;
			const targetRotX = state.pointer.y * 0.08;

			groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);
			groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
		}
	});

	// Handle dynamic scroll impulse alerts to flash the seams
	useEffect(() => {
		const triggerGlow = () => {
			if (materialRef.current && backMaterialRef.current) {
				// Instantly spike glow uniform, then let useFrame decay it
				materialRef.current.uniforms.uScrollGlow.value = 1.0;
				backMaterialRef.current.uniforms.uScrollGlow.value = 1.0;
			}
		};

		window.addEventListener('scroll', triggerGlow, { passive: true });
		return () => window.removeEventListener('scroll', triggerGlow);
	}, []);

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
					ref={backMaterialRef}
					args={[shaderMaterialData]}
					transparent
				/>
			</mesh>

			{/* 3. Luxury Wood Supports (Oak styling) */}
			<group position={[0, -0.2, 0]}>
				{/* Share standard material to optimize memory */}
				<meshStandardMaterial ref={legsMaterialRef} color="#D4C5B3" roughness={0.55} />
				
				{/* Front-left leg */}
				<mesh position={[-0.65, -0.4, 0.65]} castShadow>
					<cylinderGeometry args={[0.08, 0.05, 0.8]} />
				</mesh>
				{/* Front-right leg */}
				<mesh position={[0.65, -0.4, 0.65]} castShadow>
					<cylinderGeometry args={[0.08, 0.05, 0.8]} />
				</mesh>
				{/* Back-left leg */}
				<mesh position={[-0.65, -0.4, -0.65]} castShadow>
					<cylinderGeometry args={[0.08, 0.05, 0.8]} />
				</mesh>
				{/* Back-right leg */}
				<mesh position={[0.65, -0.4, -0.65]} castShadow>
					<cylinderGeometry args={[0.08, 0.05, 0.8]} />
				</mesh>
			</group>
		</group>
	);
}
