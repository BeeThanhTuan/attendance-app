import { motion } from "framer-motion";

interface FaceOverlayProps {
  detected?: boolean;
  position?: boolean;
  message?: string;
}

export default function FaceOverlay({ detected = false }: FaceOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Dark Mask */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="face-mask">
            <rect x="0" y="0" width="1000" height="1000" fill="white" />

            {/* Chỉ cần chỉnh 2 số này */}
            <ellipse cx="500" cy="500" rx="400" ry="246" fill="black" />
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="1000"
          height="1000"
          fill="rgba(0,0,0,.48)"
          mask="url(#face-mask)"
        />
      </svg>

      {/* Oval */}
      <motion.div
        animate={{
          borderColor: detected ? "#5448b7" : "#fff",
          boxShadow: detected
            ? "0 0 28px rgba(48,43,98,.55)"
            : "0 0 22px rgba(255,255,255,.45)",
        }}
        transition={{ duration: 0.25 }}
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          rounded-[50%]
          border-[3px]
        "
        style={{
          width: "80%",
          height: "50%",
          maxWidth: 350,
          maxHeight: 450,
        }}
      ></motion.div>

      {/* Corner */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
        "
        style={{
          width: "80%",
          height: "50%",
          maxWidth: 350,
          maxHeight: 450,
        }}
      >
        <motion.div
          animate={{
            borderColor: detected ? "#5448b7" : "#ffffff",
          }}
          transition={{ duration: 0.25 }}
          className="absolute left-0 top-0 h-9 w-9 rounded-tl-3xl border-l-4 border-t-4"
        />
        <motion.div
          animate={{
            borderColor: detected ? "#5448b7" : "#ffffff",
          }}
          transition={{ duration: 0.25 }}
          className="absolute right-0 top-0 h-9 w-9 rounded-tr-3xl border-r-4 border-t-4"
        />
        <motion.div
          animate={{
            borderColor: detected ? "#5448b7" : "#ffffff",
          }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-0 left-0 h-9 w-9 rounded-bl-3xl border-b-4 border-l-4"
        />
        <motion.div
          animate={{
            borderColor: detected ? "#5448b7" : "#ffffff",
          }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-0 right-0 h-9 w-9 rounded-br-3xl border-b-4 border-r-4"
        />
      </div>
    </div>
  );
}
