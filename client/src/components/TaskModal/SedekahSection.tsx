import { AnimatePresence, motion } from "motion/react";

import CircleStatus from "./CircleStatus";

type SedekahSectionProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
  isDone: boolean;
  amount: number;
  onToggleDone: () => void;
  onSetAmount: (amount: number) => void;
  options: readonly number[];
};

export default function SedekahSection({
  expanded,
  onToggleExpanded,
  isDone,
  amount,
  onToggleDone,
  onSetAmount,
  options,
}: SedekahSectionProps) {
  const isDisabled = amount <= 0;

  return (
    <section className="py-3">
      <div
        className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
        onClick={onToggleExpanded}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone();
          }}
          disabled={isDisabled}
          className="disabled:opacity-40"
        >
          <CircleStatus checked={isDone} />
        </button>
        <h2
          className={`text-lg font-bold flex-1 ${isDisabled ? "opacity-40" : ""}`}
        >
          Sedekah
        </h2>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-2 mt-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => onSetAmount(option)}
                    className={`rounded-full border-2 px-3 py-1 text-sm font-semibold transition-colors ${
                      amount === option
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-black hover:border-black"
                    }`}
                  >
                    {option / 1000}k
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount || ""}
                onChange={(e) =>
                  onSetAmount(Math.max(0, Number(e.target.value)))
                }
                className="w-full rounded-xl border-2 border-black/70 px-4 py-2.5 font-medium"
                placeholder="Nominal custom..."
                min="0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
