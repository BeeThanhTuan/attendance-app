import { useMemo } from "react";
import type { FaceQuality } from "../types/quality";

interface Props {
  brightness: number;
  blur: number;

  yaw: number;
  pitch: number;
  roll: number;

  centered: boolean;
}

export function useFaceQuality({
  brightness,
  blur,
  yaw,
  pitch,
  roll,
  centered,
}: Props): FaceQuality {
  return useMemo(() => {
    const brightnessOK = brightness > 90 && brightness < 220;

    const blurOK = blur > 15;

    const poseOK =
      Math.abs(yaw) < 10 && Math.abs(pitch) < 10 && Math.abs(roll) < 10;

    const ready = brightnessOK && blurOK && poseOK && centered;

    return {
      brightness: brightnessOK,
      blur: blurOK,
      centered,
      pose: poseOK,

      brightnessScore: brightness,
      blurScore: blur,

      yaw,
      pitch,
      roll,

      ready,
    };
  }, [brightness, blur, centered, yaw, pitch, roll]);
}
