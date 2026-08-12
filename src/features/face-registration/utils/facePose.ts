import type { FacePose } from "../types/face";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function estimateFacePose(matrix: number[]): FacePose {
  const m02 = matrix[2];

  const m10 = matrix[4];
  const m11 = matrix[5];
  const m12 = matrix[6];

  const m22 = matrix[10];

  const yaw = (Math.atan2(m02, m22) * 180) / Math.PI;

  const pitch =
    (Math.asin(clamp(-m12, -1, 1)) * 180) / Math.PI;

  const roll = (Math.atan2(m10, m11) * 180) / Math.PI;

  return {
    yaw,
    pitch,
    roll,
  };
}