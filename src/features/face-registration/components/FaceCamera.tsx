import Webcam from "react-webcam";
import { motion } from "framer-motion";

interface Props {
  webcamRef: React.RefObject<Webcam | null>;

  /**
   * Đã đủ điều kiện để bắt đầu capture.
   */
  ready: boolean;

  /**
   * Progress capture:
   * 0 -> 1
   */
  progress: number;

  /**
   * Đã capture đủ 3 ảnh.
   */
  allReady: boolean;

  /**
   * Đang xử lý/upload embedding.
   */
  uploading?: boolean;

  /**
   * Đăng ký thất bại.
   */
  error?: boolean;
}

export default function FaceCamera({
  webcamRef,
  ready,
  progress,
  allReady,
  uploading = false,
  error = false,
}: Props) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);

  const size = 280;
  const strokeWidth = 10;

  const svgSize = size + 20;
  const ringRadius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * ringRadius;

  const circleMode =
    ready ||
    allReady ||
    uploading ||
    error;

  /**
   * Progress chỉ thực sự được hiển thị
   * khi camera đã đạt điều kiện.
   *
   * Nhưng khi ready vừa true thì progress
   * vẫn bắt đầu từ giá trị collector truyền xuống.
   */
  const showProgress =
    circleMode && (safeProgress > 0 || allReady || uploading || error);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {/* =====================================================
          CAMERA
      ====================================================== */}

      <motion.div
        initial={false}
        animate={{
          width: size,
          height: size,

          borderRadius: circleMode ? "50%" : "24px",

          boxShadow: error
            ? "0 0 35px rgba(239,68,68,0.25)"
            : uploading
              ? "0 0 40px rgba(59,130,246,0.30)"
              : circleMode
                ? "0 0 35px rgba(59,130,246,0.20)"
                : "0 0 20px rgba(0,0,0,0.10)",
        }}
        transition={{
          duration: 0.55,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          overflow-hidden
          bg-black
        "
      >
        <Webcam
          ref={webcamRef}
          mirrored
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
          }}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

        {/* =================================================
            READY EFFECT
        ================================================== */}

        {circleMode && !uploading && !error && !allReady && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: [0, 0.35, 0],
              scale: [0.96, 1.01, 1.04],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-full
              border-2
              border-blue-400
            "
          />
        )}
      </motion.div>

      {/* =====================================================
          PROGRESS RING
      ====================================================== */}

      <motion.svg
        initial={{
          opacity: 0,
          scale: 0.92,
        }}
        animate={{
          opacity: showProgress ? 1 : 0,
          scale: showProgress ? 1 : 0.92,
        }}
        transition={{
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          -rotate-90
        "
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        {/* Background */}

        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={ringRadius}
          fill="none"
          stroke={
            error
              ? "rgba(239,68,68,0.18)"
              : "rgba(59,130,246,0.15)"
          }
          strokeWidth={strokeWidth}
        />

        {/* Progress */}

        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={ringRadius}
          fill="none"
          stroke={error ? "#ef4444" : "#2196f3"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset:
              circumference * (1 - safeProgress),
          }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        />
      </motion.svg>

      {/* =====================================================
          UPLOADING EFFECT
      ====================================================== */}

      {uploading && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: [0, 0.45, 0],
            scale: [0.9, 1.05, 1.12],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[280px]
            w-[280px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border-2
            border-blue-400
          "
        />
      )}

      {/* =====================================================
          UPLOAD INDICATOR
      ====================================================== */}

      {uploading && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-3
            w-3
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500
          "
        />
      )}

      {/* =====================================================
          MESSAGE
      ====================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-[calc(50%+180px)]
          -translate-x-1/2
        "
      >
        {uploading && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              whitespace-nowrap
              rounded-full
              bg-blue-500/90
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              shadow-lg
            "
          >
            Đang xử lý khuôn mặt...
          </motion.div>
        )}

        {error && !uploading && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
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
          </motion.div>
        )}
      </div>
    </div>
  );
}