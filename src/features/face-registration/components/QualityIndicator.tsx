import { CheckCircle2, AlertCircle } from "lucide-react";

import type { FaceDirection, FaceDistance } from "../types/face";

interface Props {
  detected?: boolean;
  brightness?: boolean;
  sharp?: boolean;
  position?: boolean;
  eyesOpen?: boolean;
  direction?: FaceDirection | null;
  distance?: FaceDistance;
}

export default function QualityIndicator({
  detected = false,
  brightness = false,
  sharp = false,
  position = false,
  eyesOpen = false,
  direction = null,
  distance = "TOO_FAR",
}: Props) {
  let message = "";
  let success = false;
  if (!detected) {
    message = "Không phát hiện khuôn mặt";
  } else if (!position) {
    message = "Vui lòng đưa khuôn mặt vào đúng khung";
  } else if (distance === "TOO_FAR") {
    message = "Vui lòng tiến lại gần camera";
  } else if (distance === "TOO_CLOSE") {
    message = "Vui lòng lùi ra xa camera";
  } else if (direction !== "STRAIGHT") {
    message = "Vui lòng nhìn thẳng vào camera";
  } else if (!eyesOpen) {
    message = "Vui lòng mở mắt";
  } else if (!brightness) {
    message = "Điều chỉnh ánh sáng";
  } else if (!sharp) {
    message = "Giữ điện thoại ổn định";
  } else {
    success = true;
    message = "Điều kiện đạt, giữ nguyên khuôn mặt";
  }
  return (
    <div
      className={`
        absolute
        top-1/4
        left-1/2
        -translate-x-1/2
        -translate-y-1/4
        w-fit
        flex items-center gap-3
        rounded-full
        border
        px-4 py-3
        backdrop-blur-xl

        ${
          success
            ? "border-emerald-500/30 bg-emerald-500/15"
            : "border-white/10 bg-black/60"
        }
      `}
    >
      <span
        className={`
          text-sm font-medium truncate
          ${success ? "text-emerald-300" : "text-white"}
        `}
      >
        {message}
      </span>
    </div>
  );
}
