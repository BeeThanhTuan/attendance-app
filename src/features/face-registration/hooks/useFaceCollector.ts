import { useEffect, useRef, useState } from "react";
import type { FaceDirection } from "../types/face";

interface Props {
  brightness: boolean;
  sharp: boolean;
  position: boolean;
  eyesOpen: boolean;
  direction: FaceDirection | null;
  onCapture: (direction: FaceDirection) => void;
}

const STEPS: FaceDirection[] = [
  "STRAIGHT",
  "LEFT",
  "RIGHT",
  "UP",
  "DOWN",
];

const START_DELAY = 1000; // Chờ 2 giây
const HOLD_TIME = 500;    // Giữ 0.5 giây
const COOLDOWN = 450;
export function useFaceCollector({
  brightness,
  sharp,
  position,
  eyesOpen,
  direction,
  onCapture,
}: Props) {
  const readyAtRef = useRef(performance.now() + START_DELAY);
  const [completedDirections, setCompletedDirections] = useState<
    Set<FaceDirection>
  >(new Set());

  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = STEPS[stepIndex];
  const isFinished = stepIndex >= STEPS.length;

  const qualityOK =
    !isFinished &&
    brightness &&
    sharp &&
    position &&
    eyesOpen &&
    direction === currentStep;

  const qualityOKRef = useRef(qualityOK);
  qualityOKRef.current = qualityOK;

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  const holdStartRef = useRef<number | null>(null);
  const cooldownRef = useRef(0);
  const isCapturingRef = useRef(false);

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      if (isCapturingRef.current) return;

      // Chưa hết 2s kể từ khi mở camera
      if (performance.now() < readyAtRef.current) {
        holdStartRef.current = null;
        return;
      }

      if (!qualityOKRef.current || !directionRef.current) {
        holdStartRef.current = null;
        return;
      }

      if (performance.now() < cooldownRef.current) {
        return;
      }

      // Bắt đầu đếm
      if (holdStartRef.current === null) {
        holdStartRef.current = performance.now();
        return;
      }

      const elapsed = performance.now() - holdStartRef.current;

      if (elapsed < HOLD_TIME) {
        return;
      }


      // ===== Capture =====
      isCapturingRef.current = true;

      const target = currentStepRef.current;

      cooldownRef.current = performance.now() + COOLDOWN;

      onCapture(target);

      setCompletedDirections((prev) => {
        const next = new Set(prev);
        next.add(target);
        return next;
      });

      setStepIndex((prev) => Math.min(prev + 1, STEPS.length));

      holdStartRef.current = null;

      setTimeout(() => {
        isCapturingRef.current = false;
      }, COOLDOWN);
    }, 50);

    return () => clearInterval(timer);
  }, [isFinished, onCapture]);

  return {
    completedDirections,
    expectedDirection: currentStep,
    progress: (completedDirections.size / STEPS.length) * 100,
    completed: completedDirections.size === STEPS.length,
    allReady: qualityOK,
  };
}