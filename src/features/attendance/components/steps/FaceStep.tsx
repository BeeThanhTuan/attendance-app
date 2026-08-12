import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import {
  useFaceDetection,
} from "@/features/face-registration/hooks/useFaceDetection";
import FaceCamera from "@/features/face-registration/components/FaceCamera";
import CaptureFlash from "@/features/face-registration/components/CaptureFlash";
import QualityIndicator from "@/features/face-registration/components/QualityIndicator";
import { ChevronLeft, ScanFace } from "lucide-react";

interface Props {
  onBack(): void;
  onNext(faceImage: string): void;
}

const HOLD_TIME = 800; // ms khuôn mặt phải đứng yên trước khi chụp

export default function FaceStep({ onBack, onNext }: Props) {
  const webcamRef = useRef<Webcam>(null);

  const [flashTrigger, setFlashTrigger] = useState(0);
  const [captured, setCaptured] = useState(false);

  const { detected, brightness, sharp, position, direction, eyesOpen } =
    useFaceDetection({ webcamRef });

  /**
   * Tất cả điều kiện chất lượng phải đạt
   * và hướng nhìn thẳng (STRAIGHT).
   */
  const allReady =
    detected &&
    brightness &&
    sharp &&
    position &&
    eyesOpen &&
    direction === "STRAIGHT";

  const allReadyRef = useRef(allReady);
  allReadyRef.current = allReady;

  const holdStartRef = useRef<number | null>(null);
  const capturedRef = useRef(false);

  /**
   * Countdown hold → tự động chụp khi đủ điều kiện
   */
  useEffect(() => {
    if (captured) return;

    const interval = setInterval(() => {
      if (capturedRef.current) return;

      if (!allReadyRef.current) {
        holdStartRef.current = null;
        return;
      }

      if (holdStartRef.current === null) {
        holdStartRef.current = performance.now();
        return;
      }

      if (performance.now() - holdStartRef.current < HOLD_TIME) {
        return;
      }

      // ===== Chụp =====
      capturedRef.current = true;

      const image = webcamRef.current?.getScreenshot();

      if (!image) return;

      setFlashTrigger((v) => v + 1);
      setCaptured(true);

      setTimeout(() => {
        onNext(image);
      }, 400); // chờ flash xong rồi chuyển sang ConfirmStep
    }, 50);

    return () => clearInterval(interval);
  }, [captured, onNext]);

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-black">
      {/* Camera */}
      <FaceCamera webcamRef={webcamRef} detected={detected} />

      {/* Flash */}
      <CaptureFlash trigger={flashTrigger} />

      {/* Overlay UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
        {/* Header */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleBack}
            className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md active:scale-95 text-white"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex flex-1 items-center justify-center gap-2">
            <ScanFace className="size-5 text-white" />
            <h1 className="text-base font-semibold text-white">
              Xác thực khuôn mặt
            </h1>
          </div>

          <div className="w-10" />
        </div>

        {/* Instruction & Status */}
        <div className="space-y-3">
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-sm font-medium text-white">
              {captured
                ? "✅ Đã chụp – đang chuyển bước..."
                : allReady
                  ? "Giữ nguyên, đang chụp..."
                  : "Nhìn thẳng vào camera"}
            </p>
          </div>

          {/* Quality indicator */}
          <QualityIndicator
            detected={detected}
            brightness={brightness}
            sharp={sharp}
            position={position}
            eyesOpen={eyesOpen}
          />
        </div>
      </div>
    </div>
  );
}
