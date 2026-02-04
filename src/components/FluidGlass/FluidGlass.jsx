import * as THREE from "three";
import { useRef, useState, useEffect, memo } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import BackgroundPlane from "./Backgroundplane";
import { scrollSync } from "@/lib/scrollStore";

import {
  useFBO,
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
  useTexture,
} from "@react-three/drei";
import { easing } from "maath";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PHASE_START = 0.45;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FluidGlass({
  mode = "lens",
  lensProps = {},
  ...props
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100dvh", // Use dynamic viewport height for mobile compatibility
        minHeight: "100vh", // Fallback for older browsers
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <Canvas
        dpr={
          typeof window !== "undefined" && window.innerWidth < 768 ? 1 : [1, 2]
        }
        camera={{ position: [0, 0, 20], fov: 15 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        <Lens modeProps={lensProps} />
      </Canvas>
    </div>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}) {
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef();
  const { nodes } = useGLTF(glb);
  const buffer = useFBO({
    resolution: isMobile ? 512 : 1024,
  });

  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);
  const scrollProgressRef = useRef(0);
  const logoRef = useRef();
  const chromaticAberrationRef = useRef(0.5);
  const materialRef = useRef();
  const lensProgressRef = useRef(0);

  // Idle detection for initial state only
  const lastPointerMoveTime = useRef(Date.now());
  const idleTime = useRef(0);
  const lastThrottledPointerUpdateRef = useRef(0);
  const POINTER_THROTTLE_MS = 16; // ~60fps throttling

  const logoTexture = useTexture("/images/Landing_Page/AuraLogo.png");

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let geo = nodes[geometryKey]?.geometry;
    if (!geo) {
      const firstMesh = Object.values(nodes).find((n) => n.type === "Mesh");
      if (firstMesh) geo = firstMesh.geometry;
    }
    if (geo) {
      geo.computeBoundingBox();
      geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
    }
  }, [nodes, geometryKey]);

  // Track pointer movement with throttling
  useEffect(() => {
    const handlePointerMove = () => {
      const now = Date.now();
      if (now - lastThrottledPointerUpdateRef.current >= POINTER_THROTTLE_MS) {
        lastPointerMoveTime.current = now;
        idleTime.current = 0;
        lastThrottledPointerUpdateRef.current = now;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        scrollSync.isLensIdle = false; // Reset on unmount
      };
    }
  }, []);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    // GSAP in index.tsx is the single source of truth
    const scrollProgress = scrollSync.rawProgress;

    // PHASE 1: Lens growth - mobile takes longer to ensure full screen coverage
    const phaseStart = isMobile ? 0.65 : 0.45;
    const lensProgress = Math.min(scrollProgress / phaseStart, 1);

    lensProgressRef.current = lensProgress;

    // PHASE 2: Content movement (ONLY after lens is done)
    // start logo movement when lens is ~45% grown
    const LOGO_EARLY_START = 0.45;

    const contentProgress =
      lensProgress < LOGO_EARLY_START
        ? 0
        : (lensProgress - LOGO_EARLY_START) / (1 - LOGO_EARLY_START);

    const clampedContentProgress = THREE.MathUtils.clamp(contentProgress, 0, 1);

    // Check if user is idle ONLY before scrolling starts
    const timeSinceLastMove = Date.now() - lastPointerMoveTime.current;
    const isIdle = timeSinceLastMove > 2000 && scrollProgress === 0;

    if (isIdle) {
      idleTime.current += delta;
    }

    // Update shared state for cursor hiding
    scrollSync.isLensIdle = isIdle;

    /* ---------- LENS POSITION ---------- */

    let destX, destY;

    if (scrollProgress === 0 && isIdle) {
      // Before any scrolling, move randomly in small area at center to hint at hidden content
      const randomRadius = isMobile ? 0.4 : 0.35;
      const randomSpeed = 0.6;
      destX =
        Math.sin(idleTime.current * randomSpeed) *
        randomRadius *
        (isMobile ? 0.3 : 1);
      destY =
        Math.cos(idleTime.current * randomSpeed * 0.7) *
        randomRadius *
        (isMobile ? 0.4 : 0.5);
    } else if (scrollProgress === 0) {
      // Before scrolling starts, follow pointer
      const pointerX = (pointer.x * v.width) / 2;
      const pointerY = (pointer.y * v.height) / 2;

      destX = pointerX * 0.85;
      destY = pointerY * 0.85;
    } else {
      // Once scrolling starts, move to center and grow from there
      destX = 0;
      destY = 0;
    }

    // Continue easing with slightly increased damping for smoother motion
    easing.damp3(ref.current.position, [destX, destY, 15], 0.12, delta);

    /* ---------- LENS SCALE ---------- */
    const baseScale = Math.min(
      0.13,
      (v.width * 0.8) / (geoWidthRef.current || 1),
    );

    const maxViewportSize = Math.max(v.width, v.height);

    const maxScale = (maxViewportSize * 2.5) / (geoWidthRef.current || 1);

    const targetScale = THREE.MathUtils.lerp(baseScale, maxScale, lensProgress);

    if (modeProps.scale == null) {
      easing.damp(ref.current.scale, "x", targetScale, 0.4, delta);
      easing.damp(ref.current.scale, "y", targetScale, 0.4, delta);
      easing.damp(ref.current.scale, "z", targetScale, 0.4, delta);
    }

    /* ---------- LOGO MOVE (AFTER LENS FULL) ---------- */

    const LOGO_PHASE_DURATION = isMobile ? 0.5 : 0.3;
    const logoShiftProgress = THREE.MathUtils.clamp(contentProgress, 0, 1);

    // Chromatic aberration reduces as user scrolls down from the very beginning
    const aberrationProgress = THREE.MathUtils.smoothstep(
      scrollProgress,
      0,
      0.3,
    );

    const targetChromaticAberration = THREE.MathUtils.lerp(
      0.6, // blurry at start
      0.0005, // crystal clear
      aberrationProgress,
    );

    easing.damp(
      chromaticAberrationRef,
      "current",
      targetChromaticAberration,
      0.4,
      delta,
    );

    // 🔑 force material uniform update every frame
    if (materialRef.current) {
      materialRef.current.chromaticAberration = chromaticAberrationRef.current;
    }

    const logoViewport = viewport.getCurrentViewport(camera, [0, 0, -59.5]);

    if (logoRef.current) {
      if (logoRef.current) {
        if (isMobile) {
          // MOBILE: logo moves UP only
          const logoStart = 0.78;
          const logoEnd = 0.92;

          const logoUpProgress = THREE.MathUtils.clamp(
            (scrollProgress - logoStart) / (logoEnd - logoStart),
            0,
            1,
          );

          const targetLogoY = THREE.MathUtils.lerp(0, 3.5, logoUpProgress);

          easing.damp(logoRef.current.position, "y", targetLogoY, 0.25, delta);
          easing.damp(logoRef.current.position, "x", 0, 0.25, delta);
        } else {
          // DESKTOP: lock Y to center, animate X only
          logoRef.current.position.y = -0.5;

          const targetLogoX = THREE.MathUtils.lerp(
            0,
            -logoViewport.width * 0.18,
            logoShiftProgress,
          );

          easing.damp(logoRef.current.position, "x", targetLogoX, 0.3, delta);
        }
      }
    }

    const shouldRenderBuffer = lensProgress < 1 || scrollProgress < 0.9;

    if (shouldRenderBuffer) {
      gl.setRenderTarget(buffer);
      gl.render(scene, camera);
      gl.setRenderTarget(null);
    }

    gl.setClearColor(0x000000, 0);
  });

  const {
    scale,
    ior,
    thickness,
    anisotropy,
    chromaticAberration,
    ...extraMat
  } = modeProps;
  const geometry =
    nodes[geometryKey]?.geometry ||
    Object.values(nodes).find((n) => n.type === "Mesh")?.geometry;

  return (
    <>
      {createPortal(
        <>
          <BackgroundPlane
            isMobile={isMobile}
            lensProgress={lensProgressRef.current}
          />
          <mesh
            ref={logoRef}
            position={[0, isMobile ? 0 : -3, -59.5]}
            scale={isMobile ? 1.4 : 1.5}
            renderOrder={2}
          >
            <planeGeometry args={isMobile ? [15, 10] : [21, 15]} />
            <meshBasicMaterial map={logoTexture} transparent />
          </mesh>
          {children}
        </>,
        scene,
      )}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={buffer.texture}
          transparent
          opacity={children ? 1 : 0}
        />
      </mesh>
      <mesh
        ref={ref}
        position-z={1}
        scale={scale ?? 0.1}
        rotation-x={Math.PI / 2}
        geometry={geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          ref={materialRef}
          buffer={buffer.texture}
          ior={ior ?? 1.05}
          thickness={isMobile ? 0.4 : 0.7}
          anisotropy={isMobile ? 0 : 0.1}
          chromaticAberration={chromaticAberrationRef.current}
          transmission={1}
          roughness={0}
          attenuationDistance={0.8}
          samples={isMobile ? 4 : 8}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }) {
  return (
    <ModeWrapper
      glb="/assets/lens.glb"
      geometryKey="Cylinder"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  );
}
