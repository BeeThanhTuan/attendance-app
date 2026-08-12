import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  trigger: number;
}

export default function CaptureFlash({ trigger }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {

    if (trigger === 0) return;

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 bg-white"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        />
      )}
    </AnimatePresence>
  );
}
