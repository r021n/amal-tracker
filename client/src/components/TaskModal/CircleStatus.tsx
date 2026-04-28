import { motion } from "motion/react";

export default function CircleStatus({ checked }: { checked: boolean }) {
  return (
    <motion.span
      animate={{
        backgroundColor: checked ? "#000000" : "#ffffff",
        borderColor: checked ? "#000000" : "#d1d5db",
        color: checked ? "#ffffff" : "#000000",
        scale: checked ? [1, 1.2, 1] : 1,
      }}
      transition={{ duration: 0.2 }}
      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-[3px] text-[10px] font-bold"
    >
      {checked ? "✓" : ""}
    </motion.span>
  );
}