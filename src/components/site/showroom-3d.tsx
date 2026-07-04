"use client";

import { useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function AtelierObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.1;
      torusRef.current.rotation.z = t * 0.07;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group>
        {/* Central sculptural object */}
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1.1, 64, 64]} />
          <MeshDistortMaterial
            color="#C4A882"
            distort={0.18}
            speed={1.5}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* Orbiting ring */}
        <mesh
          ref={torusRef}
          position={[0, 0, 0]}
          rotation={[Math.PI / 4, 0, 0]}
        >
          <torusGeometry args={[1.9, 0.025, 16, 100]} />
          <meshStandardMaterial
            color="#B8975A"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Small accent sphere */}
        <mesh position={[1.6, 0.6, 0.4]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#B85C38" roughness={0.9} metalness={0} />
        </mesh>

        {/* Ground plinth */}
        <mesh position={[0, -1.65, 0]}>
          <cylinderGeometry args={[1.2, 1.3, 0.12, 64]} />
          <meshStandardMaterial
            color="#D4C5B0"
            roughness={0.95}
            metalness={0}
          />
        </mesh>
      </group>
    </Float>
  );
}

function ShowroomLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#F9F0E8" />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.4}
        color="#FFF5E8"
        castShadow
      />
      <pointLight position={[-4, 2, -2]} intensity={0.5} color="#E8D5B8" />
      <pointLight position={[2, -2, 4]} intensity={0.3} color="#B85C3844" />
    </>
  );
}

function Scene() {
  return (
    <>
      <ShowroomLighting />
      <AtelierObject />
    </>
  );
}

export function Showroom3D() {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      id="showroom"
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        paddingTop: "var(--spacing-section)",
        paddingBottom: "var(--spacing-section)",
        overflow: "hidden",
      }}
    >
      <div className="editorial-container">
        {/* Section header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "2rem",
            alignItems: "end",
            marginBottom: "clamp(3rem, 5vw, 6rem)",
          }}
        >
          <motion.div variants={fadeIn} style={{ gridColumn: "1 / 3" }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(3rem, 5vw, 5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--color-sand)",
                lineHeight: 1,
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              03
            </span>
            <span className="eyebrow">Chapter Three</span>
          </motion.div>

          <motion.div variants={fadeUp} style={{ gridColumn: "3 / 10" }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 5vw, 5.5rem)",
                fontWeight: 400,
                lineHeight: 0.97,
                letterSpacing: "-0.025em",
                color: "var(--color-text)",
              }}
            >
              The
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  color: "var(--color-terracotta)",
                }}
              >
                Showroom
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={fadeIn}
            style={{ gridColumn: "10 / 13", alignSelf: "end" }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8125rem",
                lineHeight: 1.7,
                color: "var(--color-muted)",
              }}
            >
              A digital installation. Each object, light, and shadow rendered in
              real time.
            </p>
          </motion.div>
        </motion.div>

        {/* Canvas + editorial overlay layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          {/* 3D Canvas */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            style={{
              gridColumn: "1 / 9",
              height: "clamp(400px, 55vw, 680px)",
              backgroundColor: "var(--color-cream)",
              borderRadius: "2px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {prefersReduced ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "1rem",
                  backgroundColor: "var(--color-cream)",
                }}
              >
                <div
                  style={{
                    width: "clamp(80px, 12vw, 160px)",
                    height: "clamp(80px, 12vw, 160px)",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-sand)",
                    opacity: 0.6,
                  }}
                />
                <span className="eyebrow">Sculptural Object</span>
              </div>
            ) : (
              <Canvas
                camera={{ position: [0, 0, 5], fov: 40 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: false }}
                style={{ background: "#EDE9E1" }}
              >
                <Suspense fallback={null}>
                  <Scene />
                </Suspense>
              </Canvas>
            )}
          </motion.div>

          {/* Editorial text panel */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ gridColumn: "9 / 13", paddingLeft: "1rem" }}
          >
            <motion.div variants={fadeIn} style={{ marginBottom: "2rem" }}>
              <hr className="hairline" style={{ marginBottom: "1.5rem" }} />
              <span
                className="eyebrow"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Digital Installation
              </span>
              <span
                className="eyebrow"
                style={{ color: "var(--color-terracotta)" }}
              >
                Real-Time Render
              </span>
            </motion.div>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.45,
                color: "var(--color-text)",
                marginBottom: "1.75rem",
              }}
            >
              &ldquo;Each object catches light the way it would in a gallery —
              unhurried, material-first.&rdquo;
            </motion.p>

            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                lineHeight: 1.8,
                color: "var(--color-muted)",
                marginBottom: "2rem",
              }}
            >
              The digital showroom renders each sculptural piece in a warm,
              gallery-like environment. Light is positioned to reveal surface,
              not to impress. Rotate, observe, understand the object.
            </motion.p>

            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--color-sand)",
              }}
            >
              {[
                { label: "Rendering", value: "Three.js / WebGL" },
                { label: "Lighting", value: "Warm Gallery" },
                { label: "Interaction", value: "Real-Time" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span className="eyebrow">{item.label}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.75rem",
                      color: "var(--color-text)",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
