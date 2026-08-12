export type FaceDirection =
  | "STRAIGHT"
  | "LEFT"
  | "RIGHT"
  | "UP"
  | "DOWN";

export interface FacePose {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface FaceQuality {
  brightness: boolean;
  sharp: boolean;
  position: boolean;
}