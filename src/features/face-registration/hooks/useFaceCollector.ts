import { useEffect, useRef, useState } from "react";
import type { FaceDistance } from "../types/face";

interface Props {
  brightness: boolean;
  sharp: boolean;
  position: boolean;
  distance: FaceDistance;
  eyesOpen: boolean;
  direction: boolean;
  onCapture: (frameIndex: number) => void;
}

const REQUIRED_FRAMES = 3;

const START_DELAY = 1000;
const HOLD_TIME = 500;
const FRAME_INTERVAL = 300;

export function useFaceCollector({
  brightness,
  sharp,
  position,
  distance,
  eyesOpen,
  direction,
  onCapture,
}: Props) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [capturedCount, setCapturedCount] = useState(0);

  // ==========================================================
  // REFS
  // ==========================================================

  const readyAtRef = useRef(performance.now() + START_DELAY);

  const holdStartRef = useRef<number | null>(null);

  const cooldownRef = useRef(0);

  const isCapturingRef = useRef(false);

  const capturedCountRef = useRef(0);

  // ==========================================================
  // CAPTURE COUNT
  // ==========================================================

  capturedCountRef.current = capturedCount;

  // ==========================================================
  // DISTANCE
  // ==========================================================

  const distanceOK = distance === "GOOD";

  const distanceOKRef = useRef(distanceOK);

  distanceOKRef.current = distanceOK;

  // ==========================================================
  // QUALITY
  // ==========================================================

  const qualityOK =
    brightness && sharp && position && distanceOK && eyesOpen && direction;

  const qualityOKRef = useRef(qualityOK);

  qualityOKRef.current = qualityOK;

  // ==========================================================
  // FINISHED
  // ==========================================================

  const isFinished = capturedCount >= REQUIRED_FRAMES;

  // ==========================================================
  // COLLECT
  // ==========================================================

  useEffect(() => {
    if (isFinished) {
      return;
    }

    const timer = setInterval(() => {
      // ------------------------------------------------------
      // Already capturing
      // ------------------------------------------------------

      if (isCapturingRef.current) {
        return;
      }

      const now = performance.now();

      // ------------------------------------------------------
      // Camera startup delay
      // ------------------------------------------------------

      if (now < readyAtRef.current) {
        holdStartRef.current = null;
        return;
      }

      // ------------------------------------------------------
      // Quality not ready
      // ------------------------------------------------------

      if (!qualityOKRef.current) {
        holdStartRef.current = null;
        return;
      }

      // ------------------------------------------------------
      // Wait between frames
      // ------------------------------------------------------

      if (now < cooldownRef.current) {
        return;
      }

      // ------------------------------------------------------
      // Start holding
      // ------------------------------------------------------

      if (holdStartRef.current === null) {
        holdStartRef.current = now;
        return;
      }

      // ------------------------------------------------------
      // Calculate hold time
      // ------------------------------------------------------

      const elapsed = now - holdStartRef.current;

      if (elapsed < HOLD_TIME) {
        return;
      }

      // ======================================================
      // CAPTURE
      // ======================================================

      isCapturingRef.current = true;

      const frameIndex = capturedCountRef.current + 1;

      // ------------------------------------------------------
      // Notify parent
      // ------------------------------------------------------

      onCapture(frameIndex);

      // ------------------------------------------------------
      // Update refs/state
      // ------------------------------------------------------

      capturedCountRef.current = frameIndex;

      setCapturedCount(frameIndex);

      holdStartRef.current = null;

      // ------------------------------------------------------
      // Completed
      // ------------------------------------------------------

      if (frameIndex >= REQUIRED_FRAMES) {
        isCapturingRef.current = false;

        return;
      }

      // ------------------------------------------------------
      // Cooldown before next frame
      // ------------------------------------------------------

      cooldownRef.current = now + FRAME_INTERVAL;

      setTimeout(() => {
        isCapturingRef.current = false;
      }, FRAME_INTERVAL);
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [isFinished, onCapture]);

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
  capturedCount,
  requiredFrames: REQUIRED_FRAMES,

  progress: capturedCount / REQUIRED_FRAMES,

  completed: capturedCount === REQUIRED_FRAMES,

  captureReady:
    !isFinished &&
    qualityOK,

  distance,
  distanceOK,
};
}
