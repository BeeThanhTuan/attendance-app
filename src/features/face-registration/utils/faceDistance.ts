import type { FaceDistance } from "../types/face";


export function getFaceDistance(
  faceWidth: number,
  videoWidth: number,
): FaceDistance {
  if (videoWidth <= 0) {
    return "TOO_FAR";
  }

  const faceRatio =
    faceWidth / videoWidth;

  if (faceRatio < 0.15) {
    return "TOO_FAR";
  }

  if (faceRatio > 0.55) {
    return "TOO_CLOSE";
  }

  return "GOOD";
}