import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useEffect } from "react";

interface BackgroundPlaneProps {
  isMobile?: boolean;
}

export default function BackgroundPlane({
  isMobile = false,
}: BackgroundPlaneProps) {
  const texture = useTexture("/images/Landing_Page/BG_Only.png");

  const blurMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: null },
          uBlurAmount: { value: 0 },
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
        fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uBlurAmount;
        varying vec2 vUv;

        void main() {
          vec4 color = vec4(0.0);

          color += texture2D(uTexture, vUv + vec2(-uBlurAmount, -uBlurAmount));
          color += texture2D(uTexture, vUv + vec2( 0.0, -uBlurAmount));
          color += texture2D(uTexture, vUv + vec2( uBlurAmount, -uBlurAmount));

          color += texture2D(uTexture, vUv + vec2(-uBlurAmount, 0.0));
          color += texture2D(uTexture, vUv);
          color += texture2D(uTexture, vUv + vec2( uBlurAmount, 0.0));

          color += texture2D(uTexture, vUv + vec2(-uBlurAmount, uBlurAmount));
          color += texture2D(uTexture, vUv + vec2( 0.0, uBlurAmount));
          color += texture2D(uTexture, vUv + vec2( uBlurAmount, uBlurAmount));

          gl_FragColor = color / 9.0;
        }
      `,
      }),
    [],
  );

  useEffect(() => {
    if (!texture) return;

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    blurMaterial.uniforms.uTexture.value = texture;
    blurMaterial.uniforms.uBlurAmount.value = isMobile ? 0.004 : 0.002;
    blurMaterial.needsUpdate = true;
  }, [texture, isMobile, blurMaterial]);

  // Adjust dimensions for mobile - increased to prevent black lines
  const width = isMobile ? 35 : 47;
  const height = isMobile ? 21 : 26;

  return (
    <group>
      {/* Vignette overlay */}
      <mesh position={[0, 0, -60]} renderOrder={0}>
        <planeGeometry args={[width, height]} />
        <primitive
          object={blurMaterial}
          attach="material"
          depthWrite={false}
          depthTest={false}
          transparent
        />
      </mesh>

      {/* Background plane */}
      <mesh position={[0, 0, -60]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
}
