import { motion } from "framer-motion";

interface Props {
  progress: number;
  allReady: boolean;
}

export default function HoldProgress({ progress, allReady }: Props) {
  return (
    <div className="relative ">
      <div className="relative h-5 overflow-hidden rounded-full bg-black/60">
        <div
          className={`absolute top-1/2 -translate-y-1/2 text-sm w-full font-bold flex justify-center items-center ${allReady ? "text-emerald-400" : "text-slate-400"
            }`}
        >
          {Math.round(progress)}%
        </div>
        <motion.div
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            duration: 0.25,
          }}
          className="h-full rounded-full bg-blue-500"
        >
        </motion.div>
      </div>
    </div>
  );
}
