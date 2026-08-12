import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import { getFaceLandmarker } from "../services/mediapipe";
import { checkFacePosition, checkImageQuality } from "../services/quality";

import { estimateFacePose } from "../utils/facePose";
import { PoseFilter } from "../utils/poseFilter";
import { getEyeEAR } from "../utils/eye";
import { EyeStateFilter } from "../utils/eyeFilter";
import type { FaceDirection } from "../types/face";

interface Props {
  webcamRef: React.RefObject<Webcam | null>;
}

interface FaceDetectionState {
  detected: boolean;
  brightness: boolean;
  sharp: boolean;
  position: boolean;
  pose: boolean;
  eyesOpen: boolean;
  direction: FaceDirection | null;
}

export function useFaceDetection({ webcamRef }: Props) {
  const [state, setState] = useState<FaceDetectionState>({
    detected: false,
    brightness: false,
    sharp: false,
    position: false,
    pose: false,
    direction: null,
    eyesOpen: false
  });

  const canvasRef = useRef(document.createElement("canvas"));

  const poseFilter = useRef(new PoseFilter());
  const eyeFilter = useRef(new EyeStateFilter());

  const stableCount = useRef(0);

  const lastDirection = useRef<FaceDirection | null>(null);

  useEffect(() => {
    let mounted = true;

    let frame = 0;

    let detector: Awaited<ReturnType<typeof getFaceLandmarker>> | null = null;

    let brightness = false;
    let sharp = false;

    let lastQuality = 0;

    async function start() {
      detector = await getFaceLandmarker();

      const detect = () => {
        if (!mounted || !detector) return;

        frame = requestAnimationFrame(detect);

        const video = webcamRef.current?.video;

        if (!video || video.readyState !== 4 || video.videoWidth === 0) {
          return;
        }

        const result = detector.detectForVideo(video, performance.now());

        // ==========================
        // Không phát hiện khuôn mặt
        // ==========================

        if (result.faceLandmarks.length === 0) {
          poseFilter.current.reset();
          eyeFilter.current.reset();
          stableCount.current = 0;

          lastDirection.current = null;

          setState({
            detected: false,
            brightness: false,
            sharp: false,
            position: false,
            pose: false,
            eyesOpen: false,
            direction: null,
          });

          return;
        }

        const landmarks = result.faceLandmarks[0];
        const eyeData = getEyeEAR(landmarks);

        const eyesOpen = eyeFilter.current.update(
          eyeData.leftEAR,
          eyeData.rightEAR
        );

        const position = checkFacePosition(landmarks);

        let direction: FaceDirection = "STRAIGHT";

        let poseOK = false;

        const matrix = result.facialTransformationMatrixes?.[0]?.data;

        if (matrix) {
          const pose = poseFilter.current.update(estimateFacePose(matrix));

          const yaw = pose.yaw;
          const pitch = pose.pitch;

          if (Math.abs(yaw) <= 8 && Math.abs(pitch) <= 8) {
            direction = "STRAIGHT";
          } else if (yaw >= 15) {
            direction = "RIGHT";
          } else if (yaw <= -15) {
            direction = "LEFT";
          } else if (pitch <= -15) {
            direction = "DOWN";
          } else if (pitch >= 15) {
            direction = "UP";
          } else {
            direction = lastDirection.current ?? "STRAIGHT";
          }

          if (direction === lastDirection.current) {
            stableCount.current++;
          } else {
            stableCount.current = 1;
            lastDirection.current = direction;
          }

          
          poseOK = stableCount.current >= 10;
        }

        // ==========================
        // Quality
        // ==========================

        const now = performance.now();

        if (now - lastQuality > 200) {
          lastQuality = now;

          const canvas = canvasRef.current;

          canvas.width = video.videoWidth;

          canvas.height = video.videoHeight;

          const ctx = canvas.getContext("2d", {
            willReadFrequently: true,
          });

          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const quality = checkImageQuality(ctx, canvas.width, canvas.height);

            brightness = quality.brightness;

            sharp = quality.isSharp;
          }
        }

        setState({
          detected: true,
          brightness,
          sharp,
          position,
          pose: poseOK,
          eyesOpen: eyesOpen,
          direction,
        });
      };

      detect();
    }

    start();

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
    };
  }, [webcamRef]);

  return state;
}
