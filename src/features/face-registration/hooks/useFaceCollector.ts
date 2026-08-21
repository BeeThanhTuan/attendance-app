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

// Thời gian camera ổn định trước khi bắt đầu kiểm tra
const START_DELAY = 1000;

// Frame 1 cần giữ điều kiện liên tục 2 giây
const FIRST_FRAME_HOLD = 2000;

// Frame 2 + 3 cần giữ điều kiện liên tục 1 giây
const NEXT_FRAME_HOLD = 1000;

// Nếu trong 5 giây đầu chưa bao giờ đạt đủ điều kiện -> fail
const FACE_TIMEOUT = 5000;

// Tần suất kiểm tra
const CHECK_INTERVAL = 50;

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

  const [progress, setProgress] = useState(0);

  const [failed, setFailed] = useState(false);

  // ==========================================================
  // REFS
  // ==========================================================

  const capturedCountRef = useRef(0);

  /**
   * Thời điểm bắt đầu hold điều kiện
   * cho frame hiện tại.
   */
  const holdStartRef = useRef<number | null>(null);

  /**
   * Thời điểm bắt đầu quá trình tìm khuôn mặt.
   */
  const waitingStartRef = useRef<number | null>(null);

  /**
   * Đã từng đạt điều kiện lần đầu hay chưa.
   *
   * Sau khi true thì timeout 5s không còn tác dụng.
   */
  const firstReadyRef = useRef(false);

  /**
   * Chống capture 2 lần trong cùng một tick/render.
   */
  const capturingRef = useRef(false);

  /**
   * Đảm bảo callback/state không bị xử lý
   * khi collector đã fail.
   */
  const failedRef = useRef(false);

  // ==========================================================
  // QUALITY
  // ==========================================================

  const distanceOK = distance === "GOOD";

  /**
   * Toàn bộ điều kiện khuôn mặt.
   */
  const qualityOK =
    brightness &&
    sharp &&
    position &&
    distanceOK &&
    eyesOpen &&
    direction;

  const qualityOKRef = useRef(qualityOK);

  useEffect(() => {
    qualityOKRef.current = qualityOK;
  }, [qualityOK]);

  // ==========================================================
  // COMPLETED
  // ==========================================================

  const completed =
    capturedCount >= REQUIRED_FRAMES;

  // ==========================================================
  // COLLECTOR
  // ==========================================================

  useEffect(() => {
    if (completed || failed) {
      return;
    }

    /**
     * Reset timer khi component/hook được khởi tạo.
     */
    waitingStartRef.current = null;
    holdStartRef.current = null;

    const timer = window.setInterval(() => {
      if (failedRef.current) {
        return;
      }

      if (capturingRef.current) {
        return;
      }

      if (capturedCountRef.current >= REQUIRED_FRAMES) {
        return;
      }

      const now = performance.now();

      // ======================================================
      // START WAITING TIMER
      // ======================================================

      if (waitingStartRef.current === null) {
        waitingStartRef.current =
          now + START_DELAY;

        return;
      }

      const waitingStart =
        waitingStartRef.current;

      // ======================================================
      // WAIT CAMERA STARTUP
      // ======================================================

      if (now < waitingStart) {
        return;
      }

      // ======================================================
      // TIMEOUT 5 GIÂY
      // ======================================================

      /**
       * Chỉ timeout nếu:
       *
       * - chưa chụp frame nào
       * - chưa từng đạt điều kiện
       * - quá 5 giây
       */

      if (
        capturedCountRef.current === 0 &&
        !firstReadyRef.current &&
        now >= waitingStart + FACE_TIMEOUT
      ) {
        /**
         * Chỉ fail khi hiện tại vẫn không đạt.
         *
         * Nếu đúng tại thời điểm 5s mà qualityOK = true
         * thì cho phép bắt đầu capture, không fail.
         */
        if (!qualityOKRef.current) {
          failedRef.current = true;

          holdStartRef.current = null;

          setFailed(true);
          setProgress(0);

          return;
        }
      }

      // ======================================================
      // KIỂM TRA ĐIỀU KIỆN
      // ======================================================

      if (!qualityOKRef.current) {
        /**
         * Mất điều kiện:
         *
         * - Không capture
         * - Không tăng progress
         * - Không reset capturedCount
         *
         * Nhưng phải reset hold của frame hiện tại.
         *
         * Ví dụ frame 2:
         *
         * 700ms / 1000ms
         *       ↓
         *     mất mặt
         *
         * => frame 2 phải giữ lại từ 0ms
         */
        holdStartRef.current = null;

        return;
      }

      // ======================================================
      // ĐÃ ĐẠT ĐIỀU KIỆN LẦN ĐẦU
      // ======================================================

      if (!firstReadyRef.current) {
        firstReadyRef.current = true;
      }

      // ======================================================
      // CURRENT FRAME
      // ======================================================

      const frameIndex =
        capturedCountRef.current + 1;

      const requiredHold =
        frameIndex === 1
          ? FIRST_FRAME_HOLD
          : NEXT_FRAME_HOLD;

      // ======================================================
      // START HOLD
      // ======================================================

      if (holdStartRef.current === null) {
        holdStartRef.current = now;

        /**
         * Đã đủ điều kiện.
         *
         * Progress bắt đầu từ 0.
         */
        return;
      }

      // ======================================================
      // CALCULATE HOLD
      // ======================================================

      const elapsed =
        now - holdStartRef.current;

      // ======================================================
      // PROGRESS
      // ======================================================

      /**
       * Progress không chia đều 3 frame.
       *
       * Frame 1:
       * 0 -> 2000ms
       *
       * Frame 2:
       * 2000 -> 3000ms
       *
       * Frame 3:
       * 3000 -> 4000ms
       *
       * Tổng = 4000ms.
       */

      const completedTime =
        frameIndex === 1
          ? 0
          : frameIndex === 2
            ? FIRST_FRAME_HOLD
            : FIRST_FRAME_HOLD +
              NEXT_FRAME_HOLD;

      const totalCaptureTime =
        FIRST_FRAME_HOLD +
        NEXT_FRAME_HOLD +
        NEXT_FRAME_HOLD;

      const totalElapsed =
        Math.min(
          completedTime + elapsed,
          totalCaptureTime
        );

      const nextProgress =
        totalElapsed /
        totalCaptureTime;

      setProgress(
        Math.min(
          Math.max(nextProgress, 0),
          1
        )
      );

      // ======================================================
      // CHƯA ĐỦ THỜI GIAN
      // ======================================================

      if (elapsed < requiredHold) {
        return;
      }

      // ======================================================
      // CAPTURE
      // ======================================================

      capturingRef.current = true;

      /**
       * Capture đúng frame hiện tại.
       */
      onCapture(frameIndex);

      // ======================================================
      // UPDATE COUNT
      // ======================================================

      capturedCountRef.current =
        frameIndex;

      setCapturedCount(frameIndex);

      // ======================================================
      // RESET HOLD
      // ======================================================

      holdStartRef.current = null;

      // ======================================================
      // COMPLETE
      // ======================================================

      if (
        frameIndex >=
        REQUIRED_FRAMES
      ) {
        setProgress(1);

        capturingRef.current = false;

        return;
      }

      // ======================================================
      // READY FOR NEXT FRAME
      // ======================================================

      /**
       * Không cần cooldown.
       *
       * Frame tiếp theo sẽ bắt đầu hold
       * ngay ở lần kiểm tra kế tiếp.
       */
      capturingRef.current = false;
    }, CHECK_INTERVAL);

    return () => {
      window.clearInterval(timer);

      holdStartRef.current = null;
    };
  }, [
    completed,
    failed,
    onCapture,
  ]);

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    /**
     * Đã chụp bao nhiêu ảnh.
     *
     * 0 -> 3
     */
    capturedCount,

    /**
     * Tổng số ảnh cần chụp.
     */
    requiredFrames:
      REQUIRED_FRAMES,

    /**
     * Progress tổng:
     *
     * 0 -> 1
     */
    progress,

    /**
     * Progress dạng %.
     */
    progressPercent:
      Math.round(
        progress * 100
      ),

    /**
     * Điều kiện hiện tại có đạt hay không.
     */
    captureReady:
      !completed &&
      !failed &&
      qualityOK,

    /**
     * Quan trọng:
     *
     * Chỉ true khi đã bắt đầu quá trình
     * capture thật sự.
     *
     * Dùng biến này cho FaceCamera
     * để quyết định vuông -> tròn.
     */
    captureStarted:
      firstReadyRef.current &&
      !failed,

    /**
     * Đã capture đủ 3 ảnh.
     */
    allReady:
      completed,

    completed,

    /**
     * Capture thất bại.
     */
    failed,

    distance,

    distanceOK,
  };
}