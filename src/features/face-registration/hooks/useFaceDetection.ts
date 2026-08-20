import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import { getFaceLandmarker } from "../services/mediapipe";
import { checkImageQuality } from "../services/quality";

import { estimateFacePose } from "../utils/facePose";
import { PoseFilter } from "../utils/poseFilter";
import { getEyeEAR } from "../utils/eye";
import { EyeStateFilter } from "../utils/eyeFilter";

import type {
  FaceDirection,
  FaceDistance,
} from "../types/face";
import { isFaceInsideOval } from "../utils/facePosition";

interface Props {
  webcamRef: React.RefObject<Webcam | null>;
}

interface FaceDetectionState {
  detected: boolean;
  brightness: boolean;
  sharp: boolean;
  position: boolean;
  distance: FaceDistance;
  pose: boolean;
  eyesOpen: boolean;
  direction: FaceDirection | null;
}

export function useFaceDetection({
  webcamRef,
}: Props) {
  const [state, setState] =
    useState<FaceDetectionState>({
      detected: false,
      brightness: false,
      sharp: false,
      position: false,
      distance: "TOO_FAR",
      pose: false,
      eyesOpen: false,
      direction: null,
    });

  // ==========================================================
  // CANVAS
  // ==========================================================

  const canvasRef = useRef(
    document.createElement("canvas"),
  );

  // ==========================================================
  // FILTERS
  // ==========================================================

  const poseFilter = useRef(
    new PoseFilter(),
  );

  const eyeFilter = useRef(
    new EyeStateFilter(),
  );

  // ==========================================================
  // POSE STABILITY
  // ==========================================================

  const stableCount = useRef(0);

  const lastDirection =
    useRef<FaceDirection | null>(null);

  // ==========================================================
  // EFFECT
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    let frame = 0;

    let detector:
      | Awaited<
          ReturnType<typeof getFaceLandmarker>
        >
      | null = null;

    // Cache image quality
    let brightness = false;
    let sharp = false;

    let lastQuality = 0;

    // ========================================================
    // START
    // ========================================================

    async function start() {
      detector =
        await getFaceLandmarker();

      if (!mounted || !detector) {
        return;
      }

      // ======================================================
      // DETECT LOOP
      // ======================================================

      const detect = () => {
        if (!mounted || !detector) {
          return;
        }

        frame =
          requestAnimationFrame(
            detect,
          );

        const video =
          webcamRef.current?.video;

        // ----------------------------------------------------
        // VIDEO NOT READY
        // ----------------------------------------------------

        if (
          !video ||
          video.readyState !== 4 ||
          video.videoWidth === 0
        ) {
          return;
        }

        // ----------------------------------------------------
        // MEDIAPIPE
        // ----------------------------------------------------

        const result =
          detector.detectForVideo(
            video,
            performance.now(),
          );

        // ====================================================
        // NO FACE
        // ====================================================

        if (
          result.faceLandmarks.length ===
          0
        ) {
          poseFilter.current.reset();

          eyeFilter.current.reset();

          stableCount.current = 0;

          lastDirection.current = null;

          setState({
            detected: false,
            brightness: false,
            sharp: false,
            position: false,
            distance: "TOO_FAR",
            pose: false,
            eyesOpen: false,
            direction: null,
          });

          return;
        }

        // ====================================================
        // FACE
        // ====================================================

        const landmarks =
          result.faceLandmarks[0];

        // ====================================================
        // FACE BOUNDING BOX
        // ====================================================

        let minX = 1;
        let maxX = 0;

        let minY = 1;
        let maxY = 0;

        for (const landmark of landmarks) {
          minX = Math.min(
            minX,
            landmark.x,
          );

          maxX = Math.max(
            maxX,
            landmark.x,
          );

          minY = Math.min(
            minY,
            landmark.y,
          );

          maxY = Math.max(
            maxY,
            landmark.y,
          );
        }

        const faceWidth = maxX - minX;

        const position = isFaceInsideOval({
          minX,
          maxX,
          minY,
          maxY,
        });

        // ====================================================
        // FACE DISTANCE
        // ====================================================

        let distance: FaceDistance;

        if (faceWidth < 0.35) {
          distance = "TOO_FAR";
        } else if (faceWidth > 0.45) {
          distance = "TOO_CLOSE";
        } else {
          distance = "GOOD";
        }

        // ====================================================
        // EYES
        // ====================================================

        const eyeData =
          getEyeEAR(landmarks);

        const eyesOpen =
          eyeFilter.current.update(
            eyeData.leftEAR,
            eyeData.rightEAR,
          );

        // ====================================================
        // FACE POSE
        // ====================================================

        let direction:
          FaceDirection | null =
          "STRAIGHT";

        let poseOK = false;

        const matrix =
          result
            .facialTransformationMatrixes?.[0]
            ?.data;

        if (matrix) {
          const pose =
            poseFilter.current.update(
              estimateFacePose(matrix),
            );

          const yaw = pose.yaw;
          const pitch = pose.pitch;

          // --------------------------------------------------
          // STRAIGHT
          // --------------------------------------------------

          const isStraight =
            Math.abs(yaw) <= 8 &&
            Math.abs(pitch) <= 8;

          if (isStraight) {
            direction =
              "STRAIGHT";
          } else {
            direction = null;
          }

          // --------------------------------------------------
          // STABILITY
          // --------------------------------------------------

          if (isStraight) {
            if (
              lastDirection.current ===
              "STRAIGHT"
            ) {
              stableCount.current++;
            } else {
              stableCount.current = 1;

              lastDirection.current =
                "STRAIGHT";
            }
          } else {
            stableCount.current = 0;

            lastDirection.current =
              null;
          }

          // --------------------------------------------------
          // POSE OK
          // --------------------------------------------------

          poseOK =
            isStraight &&
            stableCount.current >= 10;
        } else {
          stableCount.current = 0;

          lastDirection.current =
            null;
        }

        // ====================================================
        // IMAGE QUALITY
        // ====================================================

        const now =
          performance.now();

        /*
         * Không cần check brightness/sharp
         * ở mỗi animation frame.
         *
         * Chỉ check mỗi 200ms.
         */

        if (
          now - lastQuality >
          200
        ) {
          lastQuality = now;

          const canvas =
            canvasRef.current;

          canvas.width =
            video.videoWidth;

          canvas.height =
            video.videoHeight;

          const ctx =
            canvas.getContext("2d", {
              willReadFrequently: true,
            });

          if (ctx) {
            ctx.drawImage(
              video,
              0,
              0,
              canvas.width,
              canvas.height,
            );

            const quality =
              checkImageQuality(
                ctx,
                canvas.width,
                canvas.height,
              );

            brightness =
              quality.brightness;

            sharp =
              quality.isSharp;
          }
        }

        // ====================================================
        // STATE
        // ====================================================

        setState({
          detected: true,

          brightness,

          sharp,

          position,

          distance,

          pose: poseOK,

          eyesOpen,

          direction,
        });
      };

      // ======================================================
      // START DETECTION
      // ======================================================

      detect();
    }

    start();

    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      mounted = false;

      cancelAnimationFrame(frame);
    };
  }, [webcamRef]);

  return state;
}