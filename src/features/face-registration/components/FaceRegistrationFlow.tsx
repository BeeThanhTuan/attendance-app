import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { ArrowLeft, RotateCcw, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FaceCamera from "./FaceCamera";
import QualityIndicator from "./QualityIndicator";
import CaptureFlash from "./CaptureFlash";
import FaceSuccessView from "./FaceSuccess";

import { useFaceDetection } from "../hooks/useFaceDetection";
import { useFaceCollector } from "../hooks/useFaceCollector";
import {
  useRegisterFace,
  type FaceRegistrationMode,
} from "../hooks/useRegisterFace";

import { dataUrlToBlob } from "@/utils/dataUrlToBlob";
import AppHeader from "@/shared/components/Header";

interface Props {
  mode?: FaceRegistrationMode;

  title: string;

  successTitle?: string;

  successDescription?: string;

  redirectTo?: string;

  buttonText?: string;
}

interface CapturedFrame {
  index: number;
  image: string;
}

export default function FaceRegistrationFlow({
  mode = "register",

  title,

  successTitle = "Thành công",

  successDescription = "Khuôn mặt của bạn đã được đăng ký thành công.",

  redirectTo = "/profile",

  buttonText = "Quay về hồ sơ",
}: Props) {
  const navigate = useNavigate();

  const webcamRef = useRef<Webcam>(null);

  /**
   * Prevent duplicate upload.
   */
  const uploadedRef = useRef(false);

  /**
   * Captured face frames.
   */
  const [images, setImages] = useState<CapturedFrame[]>([]);

  /**
   * Capture flash animation trigger.
   */
  const [flashTrigger, setFlashTrigger] = useState(0);

  const { upload, status, error } = useRegisterFace(mode);

  // ==========================================================
  // FACE DETECTION
  // ==========================================================

  const handleCapture = useCallback((frameIndex: number) => {
    const image = webcamRef.current?.getScreenshot();

    if (!image) {
      return;
    }

    setFlashTrigger((value) => value + 1);

    setImages((prev) => {
      /**
       * Prevent duplicate frame index.
       */
      if (prev.some((item) => item.index === frameIndex)) {
        return prev;
      }

      /**
       * Only capture 3 frames.
       */
      if (prev.length >= 3) {
        return prev;
      }

      return [
        ...prev,
        {
          index: frameIndex,
          image,
        },
      ];
    });
  }, []);

  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const {
    detected,
    brightness,
    sharp,
    position,
    direction,
    eyesOpen,
    distance,
  } = useFaceDetection({
    webcamRef,
    enabled: detectionEnabled,
  });

  const {
    progress,
    captureReady,
    captureStarted,
    completed,
    allReady,
    failed,
    requiredFrames,
  } = useFaceCollector({
    brightness,
    sharp,
    position,
    distance,
    eyesOpen,
    direction: direction === "STRAIGHT",
    onCapture: handleCapture,
  });

  useEffect(() => {
    if (failed) {
      setDetectionEnabled(false);
    }
  }, [failed]);

  const uploadFace = useCallback(() => {
    if (images.length !== requiredFrames) {
      return;
    }

    const formData = new FormData();

    images.forEach((item) => {
      const blob = dataUrlToBlob(item.image);

      formData.append("images", blob, `frame_${item.index}.jpg`);
    });

    upload(formData);
  }, [images, requiredFrames, upload]);

  // ==========================================================
  // AUTO UPLOAD
  // ==========================================================

  useEffect(() => {
    if (!completed) {
      return;
    }

    if (images.length !== requiredFrames) {
      return;
    }

    if (uploadedRef.current) {
      return;
    }

    uploadedRef.current = true;

    uploadFace();
  }, [completed, images.length, requiredFrames, uploadFace]);

  // ==========================================================
  // RETRY
  // ==========================================================

  const handleRetry = useCallback(() => {
    /**
     * Allow another upload.
     */
    uploadedRef.current = false;

    uploadFace();
  }, [uploadFace]);

  // ==========================================================
  // SUCCESS
  // ==========================================================

  if (status === "success") {
    return (
      <FaceSuccessView
        title={successTitle}
        description={successDescription}
        redirectTo={redirectTo}
        buttonText={buttonText}
      />
    );
  }

  // ==========================================================
  // UPLOADING
  // ==========================================================

  const uploading = completed && status !== "error";

  // ==========================================================
  // ERROR
  // ==========================================================

  const hasError = completed && status === "error";

  // ==========================================================
  // CAMERA
  // ==========================================================

  return (
    <div className="relative h-dvh overflow-hidden">
      <CaptureFlash trigger={flashTrigger} />
      <div className="absolute inset-0 z-20 flex flex-col justify-between">
        <AppHeader showBack title={title}  />

        <div className="pointer-events-auto flex flex-col w-full h-full items-center justify-center gap-2 p-4">
          {/* -----------------------------------------------
              NORMAL FACE CHECK
          ------------------------------------------------ */}
          <div className="w-full h-[320px] flex justify-center items-center">
            <div className="w-[330px] h-[330px]">
              <FaceCamera
                webcamRef={webcamRef}
                ready={captureReady}
                captureStarted={captureStarted}
                progress={progress}
                allReady={allReady}
                uploading={uploading}
                error={failed}
              />
            </div>
          </div>
          {!completed && (
            <QualityIndicator
              detected={detected}
              brightness={brightness}
              sharp={sharp}
              position={position}
              eyesOpen={eyesOpen}
              direction={direction}
              distance={distance}
              failed={failed}
            />
          )}
          {
            failed &&(
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-black
                  transition
                  active:scale-95
                "
              >
                <RotateCcw className="size-4" />
                Thử lại
              </button>

            )
          }

          {/* -----------------------------------------------
              UPLOADING
          ------------------------------------------------ */}

          {uploading && (
            <div
              className="
                flex
                items-center
                gap-3
                rounded-full
                border
                border-white/10
                bg-black/55
                px-5
                py-3
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <div
                className="
                  size-4
                  animate-spin
                  rounded-full
                  border-2
                  border-white/25
                  border-t-white
                "
              />

              <span
                className="
                  text-sm
                  font-medium
                  text-white
                "
              >
                Đang đăng ký khuôn mặt
              </span>
              {error && !uploading && (
                <div
                  className="
                    whitespace-nowrap
                    rounded-full
                    bg-red-500/90
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    shadow-lg
                  "
                >
                  Đăng ký khuôn mặt thất bại
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------
              ERROR
          ------------------------------------------------ */}

          {hasError && (
            <div
              className="
                flex
                max-w-[90%]
                flex-col
                items-center
                gap-3
                rounded-2xl
                border
                border-red-400/20
                bg-black/65
                px-5
                py-4
                text-center
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <span
                className="
                  text-sm
                  font-medium
                  text-red-300
                "
              >
                {error || "Không thể đăng ký khuôn mặt."}
              </span>

              <button
                type="button"
                onClick={handleRetry}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-black
                  transition
                  active:scale-95
                "
              >
                <RotateCcw className="size-4" />
                Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
