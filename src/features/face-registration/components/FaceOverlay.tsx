import { motion } from "framer-motion";

interface FaceOverlayProps {
  ready?: boolean;
  progress?: number;
  allReady?: boolean;
}

export default function FaceOverlay({
  ready = false,
  progress = 0,
  allReady = false,
}: FaceOverlayProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);

  // ==========================================================
  // FRAME
  // ==========================================================

  const FRAME_SIZE = 280;

  const STROKE_WIDTH = 4;

  const RING_PADDING = 12;

  const RING_SIZE =
    FRAME_SIZE + RING_PADDING * 2;

  const RING_RADIUS =
    (RING_SIZE - STROKE_WIDTH) / 2;

  const CIRCUMFERENCE =
    2 * Math.PI * RING_RADIUS;

  // ==========================================================
  // SVG MASK
  // ==========================================================

  const frameX =
    (1000 - FRAME_SIZE) / 2;

  const frameY =
    (1000 - FRAME_SIZE) / 2;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* =====================================================
          WHITE MASK
          Camera chỉ nhìn thấy bên trong frame
      ====================================================== */}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <mask
            id="face-camera-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1000"
            height="1000"
          >
            {/* Everything visible */}
            <rect
              x="0"
              y="0"
              width="1000"
              height="1000"
              fill="white"
            />

            {/* Camera hole */}
            <motion.rect
              initial={false}
              animate={{
                x: frameX,
                y: frameY,
                width: FRAME_SIZE,
                height: FRAME_SIZE,

                // Square -> Circle
                rx: ready
                  ? FRAME_SIZE / 2
                  : 18,

                ry: ready
                  ? FRAME_SIZE / 2
                  : 18,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              fill="black"
            />
          </mask>
        </defs>

        {/* White area outside camera frame */}
        <rect
          x="0"
          y="0"
          width="1000"
          height="1000"
          fill="white"
          mask="url(#face-camera-mask)"
        />
      </svg>

      {/* =====================================================
          FRAME BORDER
      ====================================================== */}

      <motion.div
        initial={false}
        animate={{
          width: FRAME_SIZE,
          height: FRAME_SIZE,

          borderRadius: ready
            ? "50%"
            : 18,

          borderColor: ready
            ? "rgba(255,255,255,0.95)"
            : "rgba(120,120,120,0.65)",

          boxShadow: ready
            ? allReady
              ? `
                0 0 0 2px rgba(37, 164, 255, 0.15),
                0 0 30px rgba(37, 164, 255, 0.35)
              `
              : `
                0 0 20px rgba(255,255,255,0.18)
              `
            : "none",
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          border-[3px]
        "
      />

      {/* =====================================================
          RECOGNITION EFFECT
      ====================================================== */}

      {ready && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.82,
          }}
          animate={{
            opacity: [0, 0.18, 0],
            scale: [0.82, 1.08, 1.12],
          }}
          transition={{
            duration: 1.4,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.8,
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-[280px]
            w-[280px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-400
            blur-2xl
          "
        />
      )}

      {/* =====================================================
          PROGRESS RING
      ====================================================== */}

      <motion.svg
        initial={false}
        animate={{
          opacity: ready ? 1 : 0,
          scale: ready ? 1 : 0.85,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          -rotate-90
        "
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      >
        {/* ==================================================
            BACKGROUND RING
        =================================================== */}

        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(120,120,120,0.22)"
          strokeWidth={STROKE_WIDTH}
        />

        {/* ==================================================
            PROGRESS
        =================================================== */}

        <motion.circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke="#2196F3"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{
            strokeDashoffset: CIRCUMFERENCE,
          }}
          animate={{
            strokeDashoffset:
              CIRCUMFERENCE *
              (1 - safeProgress),
          }}
          transition={{
            duration: 0.25,
            ease: "linear",
          }}
        />
      </motion.svg>

      {/* =====================================================
          SMALL CAPTURE FLASH
          Khi hoàn thành 1 frame
      ====================================================== */}

      {allReady && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: [0, 0.35, 0],
            scale: [0.9, 1.05, 1.1],
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="
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