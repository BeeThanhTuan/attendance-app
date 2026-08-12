import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { estimateBlur } from "../utils/blur";
import { getBrightness } from "../utils/brightness";

const MIN_BRIGHTNESS = 60;
const MAX_BRIGHTNESS = 220;
const MIN_SHARPNESS = 120;

export function checkImageQuality(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const sharpScore = estimateBlur(ctx, width, height);
  const brightnessScore = getBrightness(ctx, width, height);

  return {
    isSharp: sharpScore > MIN_SHARPNESS,
    brightness:
      brightnessScore >= MIN_BRIGHTNESS &&
      brightnessScore <= MAX_BRIGHTNESS,
  };
}

function insideOval(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
) {
  return (
    ((x - cx) * (x - cx)) / (rx * rx) +
      ((y - cy) * (y - cy)) / (ry * ry) <=
    1
  );
}

export function checkFacePosition(
  landmarks: NormalizedLandmark[],
) {
  if (!landmarks.length) return false;

  let minX = 1;
  let maxX = 0;
  let minY = 1;
  let maxY = 0;

  for (const lm of landmarks) {
    minX = Math.min(minX, lm.x);
    maxX = Math.max(maxX, lm.x);

    minY = Math.min(minY, lm.y);
    maxY = Math.max(maxY, lm.y);
  }

  const faceWidth = maxX - minX;
  const faceHeight = maxY - minY;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // ===== Oval của FaceOverlay =====
  const ovalCenterX = 0.5;
  const ovalCenterY = 0.5;

  // Điều chỉnh theo kích thước oval trên UI
  const ovalRadiusX = 0.27;
  const ovalRadiusY = 0.46;

  // ===== 5 điểm quan trọng =====
  const required = [
    landmarks[1],   // Nose
    landmarks[33],  // Left eye
    landmarks[263], // Right eye
    landmarks[10],  // Forehead
    landmarks[152], // Chin
  ];

  const allInside = required.every((p) =>
    insideOval(
      p.x,
      p.y,
      ovalCenterX,
      ovalCenterY,
      ovalRadiusX,
      ovalRadiusY,
    ),
  );

  // ===== Tâm mặt phải gần tâm oval =====
  const centered =
    Math.abs(centerX - ovalCenterX) < 0.07 &&
    Math.abs(centerY - ovalCenterY) < 0.08;

  // ===== Kích thước khuôn mặt =====
  const sizeOK =
    faceWidth > 0.26 &&
    faceWidth < 0.52 &&
    faceHeight > 0.34 &&
    faceHeight < 0.72;

  // ===== Không được chạm viền =====
  const margin = 0.015;

  const boxInside =
    insideOval(
      minX + margin,
      minY + margin,
      ovalCenterX,
      ovalCenterY,
      ovalRadiusX,
      ovalRadiusY,
    ) &&
    insideOval(
      maxX - margin,
      minY + margin,
      ovalCenterX,
      ovalCenterY,
      ovalRadiusX,
      ovalRadiusY,
    ) &&
    insideOval(
      minX + margin,
      maxY - margin,
      ovalCenterX,
      ovalCenterY,
      ovalRadiusX,
      ovalRadiusY,
    ) &&
    insideOval(
      maxX - margin,
      maxY - margin,
      ovalCenterX,
      ovalCenterY,
      ovalRadiusX,
      ovalRadiusY,
    );

  return allInside && centered && sizeOK && boxInside;
}