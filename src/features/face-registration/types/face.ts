export type FaceDirection = "STRAIGHT" | null;
export type FaceDistance =
  | "TOO_FAR"
  | "GOOD"
  | "TOO_CLOSE";
export interface FacePose {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface FaceQuality {
  brightness: boolean;
  sharp: boolean;
  position: boolean;
  eyesOpen: boolean;
}