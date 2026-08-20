import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface Props {
  trigger: number;
}

export default function CaptureFlash({ trigger }: Props) {
  const controls = useAnimationControls();
  const previousTrigger = useRef(trigger);

  useEffect(() => {
    if (
      trigger === 0 ||
      trigger === previousTrigger.current
    ) {
      previousTrigger.current = trigger;
      return;
    }

    previousTrigger.current = trigger;

    controls.start({
      opacity: [0, 0.45, 0],
      transition: {
        duration: 0.3,
        times: [0, 0.15, 1],
        ease: "easeOut",
      },
    });
  }, [trigger, controls]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={controls}
    />
  );
}