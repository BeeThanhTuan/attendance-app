import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FaceCamera from "./FaceCamera";
import FaceInstruction from "./FaceInstruction";
import QualityIndicator from "./QualityIndicator";
import CaptureFlash from "./CaptureFlash";
import HoldProgress from "./HoldProgress";

import FaceUploadingView from "./FaceUploading";
import FaceSuccessView from "./FaceSuccess";

import { useFaceDetection } from "../hooks/useFaceDetection";
import { useFaceCollector } from "../hooks/useFaceCollector";
import {
  useRegisterFace,
  type FaceRegistrationMode,
} from "../hooks/useRegisterFace";

import type { FaceDirection } from "../types/face";

import { dataUrlToBlob } from "@/utils/dataUrlToBlob";

interface Props {
  mode?: FaceRegistrationMode;

  title: string;

  successTitle?: string;

  successDescription?: string;

  redirectTo?: string;

  buttonText?: string;
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

  const uploadedRef = useRef(false);

  const [images, setImages] = useState<
    {
      direction: FaceDirection;
      image: string;
    }[]
  >([]);

  const [flashTrigger, setFlashTrigger] = useState(0);

  const { upload, status, error } = useRegisterFace(mode);

  const { detected, brightness, sharp, position, direction, eyesOpen } =
    useFaceDetection({
      webcamRef,
    });

  const handleCapture = useCallback((direction: FaceDirection) => {
    const image = webcamRef.current?.getScreenshot();

    if (!image) return;

    setFlashTrigger((v) => v + 1);

    setImages((prev) => {
      if (prev.some((item) => item.direction === direction)) {
        return prev;
      }

      return [
        ...prev,
        {
          direction,
          image,
        },
      ];
    });
  }, []);

  const {
    progress,
    allReady,
    completedDirections,
    completed,
    expectedDirection,
  } = useFaceCollector({
    brightness,
    sharp,
    position,
    direction,
    eyesOpen,
    onCapture: handleCapture,
  });

  const uploadFace = useCallback(() => {
    const formData = new FormData();

    images.forEach((item) => {
      const blob = dataUrlToBlob(item.image);

      switch (item.direction) {
        case "STRAIGHT":
          formData.append("front", blob, "front.jpg");
          break;

        case "LEFT":
          formData.append("left", blob, "left.jpg");
          break;

        case "RIGHT":
          formData.append("right", blob, "right.jpg");
          break;

        case "UP":
          formData.append("up", blob, "up.jpg");
          break;

        case "DOWN":
          formData.append("down", blob, "down.jpg");
          break;
      }
    });

    upload(formData);
  }, [images, upload]);

  useEffect(() => {
    if (!completed) return;

    if (images.length !== 5) return;

    if (uploadedRef.current) return;

    uploadedRef.current = true;

    uploadFace();
  }, [completed, images.length, uploadFace]);

  /* ================= SUCCESS ================= */

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

  /* ================= UPLOADING / ERROR ================= */

  if (completed) {
    return (
      <FaceUploadingView
        images={images}
        status={status === "error" ? "error" : "uploading"}
        error={error}
        onRetry={() => {
          uploadedRef.current = false;
          uploadFace();
        }}
      />
    );
  }

  /* ================= CAMERA ================= */

  return (
    <div className="relative h-dvh overflow-hidden bg-black">
      <FaceCamera webcamRef={webcamRef} detected={detected} />

      <CaptureFlash trigger={flashTrigger} />

      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md active:scale-95"
          >
            <Undo2 className="size-5 text-white" />
          </button>

          <h1 className="flex-1 text-center text-lg font-semibold text-white">
            {title}
          </h1>

          <div className="w-10" />
        </div>

        <div className="mt-3">
          <FaceInstruction
            success={allReady}
            expectedDirection={expectedDirection}
            completedDirections={completedDirections}
          />
        </div>

        <div className="space-y-3">
          <QualityIndicator
            detected={detected}
            brightness={brightness}
            sharp={sharp}
            position={position}
            eyesOpen={eyesOpen}
          />

          <HoldProgress progress={progress} allReady={allReady} />
        </div>
      </div>
    </div>
  );
}
