import Webcam from "react-webcam";
import { motion } from "framer-motion";

interface Props {
  webcamRef: React.RefObject<Webcam | null>;
  ready: boolean;
  captureStarted: boolean;
  progress: number;
  allReady: boolean;
  uploading?: boolean;
  error?: boolean;
}

export default function FaceCamera({
  webcamRef,
  ready,
  captureStarted,
  progress,
  allReady,
  uploading = false,
  error = false,
}: Props) {

  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const size = 280;
  const strokeWidth = 10;
  const gap = 10;
  const svgSize = size + gap * 2 + strokeWidth;
  const ringRadius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const circleMode = captureStarted || allReady || uploading || error;
  const showProgress = captureStarted || allReady || uploading || error;
  const progressColor = error ? "#ef4444" : "#2196f3";
  const backgroundColor = error
    ? "rgba(239,68,68,0.38)"
    : "rgba(33,150,243,0.35)";
  return (
    <div
      className="
        relative
        flex
        h-full
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-white
      "
    >
      {/* =====================================================
          CAMERA
      ====================================================== */}

      <motion.div
        initial={false}
        animate={{
          width: size,
          height: size,
          borderRadius: circleMode ? "50%" : "24px",
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

        {/* ==================================================
            NHẬN DIỆN ĐANG ĐẠT ĐIỀU KIỆN
        ================================================== */}

        {ready && captureStarted && !uploading && !error && !allReady && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
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
          scale: 0.96,
        }}
        animate={{
          opacity: showProgress ? 1 : 0,
          scale: showProgress ? 1 : 0.96,
        }}
        transition={{
          duration: 0.3,
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
        {/* ==================================================
            BACKGROUND RING
        ================================================== */}

        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={ringRadius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />

        {/* ==================================================
            RUNNING PROGRESS
        ================================================== */}

        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={ringRadius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset: circumference * (1 - safeProgress),
          }}
          transition={{
            /**
             * Collector update mỗi 50ms.
             *
             * Để progress bám sát thời gian thật,
             * không dùng duration quá dài.
             */
            duration: 0.05,
            ease: "linear",
          }}
        />
      </motion.svg>

      {/* =====================================================
          PROCESSING
      ====================================================== */}

      {uploading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: 1.4,
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
    </div>
  );
}
