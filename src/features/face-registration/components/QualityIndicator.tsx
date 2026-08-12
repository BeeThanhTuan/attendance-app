import { CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  detected?: boolean;
  brightness?: boolean;
  sharp?: boolean;
  position?: boolean;
  eyesOpen?: boolean;
}

export default function QualityIndicator({
  detected = false,
  brightness = false,
  sharp = false,
  position = false,
  eyesOpen = false,
}: Props) {
  let message = "";
  let success = false;

  if (!detected) {
    message = "Không phát hiện khuôn mặt";
  } else if (!position) {
    message = "Vui lòng khuôn mặt vào đúng khung";
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
        flex items-center gap-3
        rounded-full
        px-4 py-3
        backdrop-blur-xl
        
        border

        ${success
          ? "border-emerald-500/30 bg-emerald-500/15"
          : "border-white/10 bg-black/60"
        }
      `}
    >
      {success ? (
        <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
      ) : (
        <AlertCircle size={20} className="shrink-0 text-cyan-400" />
      )}

      <span
        className={`text-sm font-medium ${success ? "text-emerald-300" : "text-white"
          }`}
      >
        {message}
      </span>
    </div>
  );
}
