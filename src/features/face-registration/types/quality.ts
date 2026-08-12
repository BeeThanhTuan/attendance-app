export interface FaceQuality {
  brightness: boolean;
  blur: boolean;
  centered: boolean;
  pose: boolean;

  brightnessScore: number;
  blurScore: number;

  yaw: number;
  pitch: number;
  roll: number;

  ready: boolean;
}