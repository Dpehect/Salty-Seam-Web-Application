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

	// Mesh and group references to coordinate exploding Easter Egg
	const seatRef = useRef<THREE.Mesh>(null);
	const backrestRef = useRef<THREE.Mesh>(null);
	const legsGroupRef = useRef<THREE.Group>(null);

	// Target values for lerped mouse drift and swatches rotation offset
	const targetGalleryRot = useRef(0);

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
				uniform float uTime;
				uniform float uScrollGlow;

				// High-frequency pseudo-random hash
				float hash(vec3 p) {
					p = fract(p * 0.3183099 + vec3(0.1, 0.1, 0.1));
					p *= 17.0;
					return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
				}

				// Buttery 3D Noise generator to simulate natural organic bouclé weave
				float noise(vec3 x) {
					vec3 i = floor(x);
					vec3 f = fract(x);
					f = f * f * (3.0 - 2.0 * f);
					return mix(
						mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
							mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
						mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
							mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
					);
				}

				void main() {
					vUv = uv;
					vNormal = normalize(normalMatrix * normal);
					
					// Displace vertices along the normal to give bouclé textural relief
					float displacement = noise(position * 75.0 + vec3(0.0, uTime * 0.08, 0.0)) * 0.012;
					vec3 displacedPosition = position + normal * displacement;
					
					gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
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
					// 1. Procedural fabric grain using fine noise
					float noiseVal = fract(sin(dot(vUv * 130.0, vec2(12.9898, 78.233))) * 43758.5453);
					
					// 2. Adjust roughness and metalness dynamically based on scroll velocity (intensity)
					float currentRoughness = mix(uRoughness, uRoughness * 0.32, clamp(uScrollGlow, 0.0, 1.0));
					float currentMetalness = mix(0.0, 0.85, clamp(uScrollGlow, 0.0, 1.0));

					vec3 fabricBase = uBaseColor + (noiseVal - 0.5) * 0.022 * (currentRoughness + 0.25);
					
					// 3. Compute seam contours near box geometry face boundaries
					float borderX = smoothstep(0.04, 0.0, vUv.x) + smoothstep(0.96, 1.0, vUv.x);
					float borderY = smoothstep(0.04, 0.0, vUv.y) + smoothstep(0.96, 1.0, vUv.y);
					float seamIntensity = clamp(borderX + borderY, 0.0, 1.0);

					// 4. Muted pastel accents
					vec3 rose = vec3(0.74, 0.44, 0.47);      // Muted Dusty Rose
					vec3 gold = vec3(0.85, 0.77, 0.65);      // Muted Champagne Gold
					vec3 clay = vec3(0.75, 0.50, 0.40);      // Muted Terracotta

					// Slow color shifting cycle
					vec3 highlightColor = mix(rose, clay, sin(uTime * 0.75 + vUv.y * 5.0) * 0.5 + 0.5);
					highlightColor = mix(highlightColor, gold, cos(uTime * 0.5 + vUv.x * 3.0) * 0.3 + 0.3);

					// 5. Blinn-Phong specular highlight calculation using scroll-induced metalness
					vec3 normal = normalize(vNormal);
					vec3 lightDirection = normalize(vec3(3.0, 5.0, 3.0));
					float ndl = max(dot(normal, lightDirection), 0.0) * 0.55 + 0.45;

					vec3 viewDirection = normalize(vec3(0.0, 0.4, 3.2));
					vec3 halfDir = normalize(lightDirection + viewDirection);
					float specExponent = 32.0 * (1.0 - currentRoughness);
					float spec = pow(max(dot(normal, halfDir), 0.0), max(1.0, specExponent));
					vec3 specularHighlight = vec3(spec * currentMetalness * 0.6);

					// Seam highlight modulated by lighting and scroll velocity
					float finalGlow = seamIntensity * (uSeamGlow + uScrollGlow * 0.48) * clamp(ndl, 0.25, 1.0);
					vec3 finalColor = mix(fabricBase, highlightColor, finalGlow) + specularHighlight;

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

			// 4. Exploding Chair Easter Egg GSAP Animation
			if (state.isExploding && seatRef.current && backrestRef.current && legsGroupRef.current) {
				// Kill any active tweens on the furniture parts
				gsap.killTweensOf([seatRef.current.position, backrestRef.current.position, legsGroupRef.current.position]);

				const tl = gsap.timeline({
					onComplete: () => {
						// Reset state when animation completes
						useThemeStore.getState().setIsExploding(false);
					}
				});

				// Explode meshes outwards and spike seam highlight glows
				tl.to(backrestRef.current.position, {
					y: 2.2,
					z: -2.0,
					duration: 1.0,
					ease: 'luxury'
				})
				.to(seatRef.current.position, {
					y: -0.8,
					z: 0.8,
					duration: 1.0,
					ease: 'luxury'
				}, 0)
				.to(legsGroupRef.current.position, {
					y: -1.5,
					duration: 1.0,
					ease: 'luxury'
				}, 0);

				// Flash seams during explosion
				if (materialRef.current && backMaterialRef.current) {
					tl.to([materialRef.current.uniforms.uScrollGlow, backMaterialRef.current.uniforms.uScrollGlow], {
						value: 2.8,
						duration: 0.5,
						ease: 'power2.out'
					}, 0)
					.to([materialRef.current.uniforms.uScrollGlow, backMaterialRef.current.uniforms.uScrollGlow], {
						value: 0.0,
						duration: 1.2,
						ease: 'luxury'
					}, 1.0);
				}

				// Reassemble chair components back to resting dimensions
				tl.to(backrestRef.current.position, {
					y: 0.65,
					z: -0.65,
					duration: 1.4,
					ease: 'luxury',
					delay: 0.6
				})
				.to(seatRef.current.position, {
					y: 0,
					z: 0,
					duration: 1.4,
					ease: 'luxury',
					delay: 0.6
				}, '<')
				.to(legsGroupRef.current.position, {
					y: -0.2,
					duration: 1.4,
					ease: 'luxury',
					delay: 0.6
				}, '<');
			}
		});

		return () => unsubscribe();
	}, []);

	// R3F Render frame ticks
	useFrame((state, delta) => {
		if (materialRef.current && backMaterialRef.current) {
			materialRef.current.uniforms.uTime.value += delta;
			backMaterialRef.current.uniforms.uTime.value += delta;

			// Decelerate scroll glow uniform back to resting state
			const currentGlow = materialRef.current.uniforms.uScrollGlow.value;
			const decay = currentGlow - currentGlow * 3.5 * delta;
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
			<mesh ref={seatRef} position={[0, 0, 0]} castShadow receiveShadow>
				<boxGeometry args={[1.6, 0.35, 1.6, 64, 16, 64]} />
				<shaderMaterial
					ref={materialRef}
					args={[shaderMaterialData]}
					transparent
				/>
			</mesh>

			{/* 2. Curved Backrest */}
			<mesh ref={backrestRef} position={[0, 0.65, -0.65]} rotation={[0.08, 0, 0]} castShadow receiveShadow>
				<boxGeometry args={[1.6, 0.95, 0.3, 64, 32, 16]} />
				<shaderMaterial
					ref={backMaterialRef}
					args={[shaderMaterialData]}
					transparent
				/>
			</mesh>

			{/* 3. Luxury Wood Supports (Oak styling) */}
			<group ref={legsGroupRef} position={[0, -0.2, 0]}>
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
