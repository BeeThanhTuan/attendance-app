export class EyeStateFilter {
  private state = false;

  private openCount = 0;
  private closeCount = 0;

  private readonly openFrames: number;
  private readonly closeFrames: number;

  constructor(openFrames = 3, closeFrames = 3) {
    this.openFrames = openFrames;
    this.closeFrames = closeFrames;
  }

  update(leftEAR: number, rightEAR: number) {
    const OPEN_THRESHOLD = 0.17;
    const CLOSE_THRESHOLD = 0.14;

    const leftOpen = this.state
      ? leftEAR > CLOSE_THRESHOLD
      : leftEAR > OPEN_THRESHOLD;

    const rightOpen = this.state
      ? rightEAR > CLOSE_THRESHOLD
      : rightEAR > OPEN_THRESHOLD;

    const opened = leftOpen && rightOpen;

    if (opened) {
      this.openCount++;
      this.closeCount = 0;

      if (this.openCount >= this.openFrames) {
        this.state = true;
      }
    } else {
      this.closeCount++;
      this.openCount = 0;

      if (this.closeCount >= this.closeFrames) {
        this.state = false;
      }
    }

    return this.state;
  }

  reset() {
    this.state = false;
    this.openCount = 0;
    this.closeCount = 0;
  }
}
