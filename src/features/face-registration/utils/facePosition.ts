// utils/facePosition.ts

interface FaceBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Kiểm tra vị trí khuôn mặt.
 *
 * Chỉ kiểm tra CENTER của khuôn mặt
 * có nằm trong vùng oval hay không.
 *
 * Không kiểm tra kích thước khuôn mặt.
 */
export function isFaceInsideOval({
  minX,
  maxX,
  minY,
  maxY,
}: FaceBounds): boolean {
  // =========================================================
  // FACE CENTER
  // =========================================================

  const faceCenterX =
    (minX + maxX) / 2;

  const faceCenterY =
    (minY + maxY) / 2;

  // =========================================================
  // OVAL CENTER
  // =========================================================

  const ovalCenterX = 0.5;
  const ovalCenterY = 0.51;

  // =========================================================
  // POSITION TOLERANCE
  // =========================================================

  const radiusX = 0.20;
  const radiusY = 0.20;

  // =========================================================
  // NORMALIZE
  // =========================================================

  const dx =
    (faceCenterX - ovalCenterX) /
    radiusX;

  const dy =
    (faceCenterY - ovalCenterY) /
    radiusY;

  // =========================================================
  // ELLIPSE
  // =========================================================

  return (
    dx * dx +
      dy * dy <=
    1
  );
}