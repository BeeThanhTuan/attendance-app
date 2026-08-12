import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

function distance(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
) {
  return Math.hypot(
    a.x - b.x,
    a.y - b.y,
  );
}

function eyeAspectRatio(
  p1: NormalizedLandmark,
  p2: NormalizedLandmark,
  p3: NormalizedLandmark,
  p4: NormalizedLandmark,
  p5: NormalizedLandmark,
  p6: NormalizedLandmark,
) {
  const vertical =
    distance(p2, p6) +
    distance(p3, p5);

  const horizontal =
    distance(p1, p4);

  return vertical / (2 * horizontal);
}

export function getEyeEAR(
  landmarks: NormalizedLandmark[],
) {
  const leftEAR = eyeAspectRatio(
    landmarks[33],
    landmarks[160],
    landmarks[158],
    landmarks[133],
    landmarks[153],
    landmarks[144],
  );

  const rightEAR = eyeAspectRatio(
    landmarks[362],
    landmarks[385],
    landmarks[387],
    landmarks[263],
    landmarks[373],
    landmarks[380],
  );

  return {
    leftEAR,
    rightEAR,
    average: (leftEAR + rightEAR) / 2,
  };
}