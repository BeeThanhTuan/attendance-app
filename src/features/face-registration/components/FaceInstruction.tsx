import { motion } from "framer-motion";

import type { FaceDirection } from "../types/face";

interface Props {
  success?: boolean;
  expectedDirection: FaceDirection;
  completedDirections?: Set<FaceDirection>;
}


const labels: Record<FaceDirection, string> = {
  STRAIGHT: "Nhìn thẳng",
  LEFT: "Quay sang trái",
  RIGHT: "Quay sang phải",
  UP: "Ngẩng đầu",
  DOWN: "Cúi đầu",
};

export default function FaceInstruction({
  success = false,
  expectedDirection,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-x"
    >
          <h2 className="text-base font-semibold text-white text-center">
            {success ? "Đang đăng ký" : labels[expectedDirection]}
          </h2>
    </motion.div>
  );
}
