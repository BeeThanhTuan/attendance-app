import type { FacePose } from "../types/face";

export class PoseFilter {
  private readonly alpha = 0.25;

  private initialized = false;

  private pose: FacePose = {
    yaw: 0,
    pitch: 0,
    roll: 0,
  };

  update(input: FacePose): FacePose {
    if (!this.initialized) {
      this.pose = input;
      this.initialized = true;
      return this.pose;
    }

    this.pose = {
      yaw:
        this.pose.yaw +
        this.alpha * (input.yaw - this.pose.yaw),

      pitch:
        this.pose.pitch +
        this.alpha * (input.pitch - this.pose.pitch),

      roll:
        this.pose.roll +
        this.alpha * (input.roll - this.pose.roll),
    };

    return this.pose;
  }

  reset() {
    this.initialized = false;

    this.pose = {
      yaw: 0,
      pitch: 0,
      roll: 0,
    };
  }
}