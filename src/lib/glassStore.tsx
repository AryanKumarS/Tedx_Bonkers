import { create } from "zustand";
import * as THREE from "three";

type GlassState = {
  bufferTexture: THREE.Texture | null;
  chromaticAberration: number;
};

export const useGlassStore = create<GlassState>(() => ({
  bufferTexture: null,
  chromaticAberration: 0,
}));
