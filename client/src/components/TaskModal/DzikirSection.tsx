import { AnimatePresence, motion } from "motion/react";

import CircleStatus from "./CircleStatus";

type DzikirSectionProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
  isDone: boolean;
  pagiDone: boolean;
  petangDone: boolean;
  onToggleAll: () => void;
  onTogglePagi: () => void;
  onTogglePetang: () => void;
};

export default function DzikirSection({
  expanded,
  onToggleExpanded,
  isDone,
  pagiDone,
  petangDone,
  onToggleAll,
  onTogglePagi,
  onTogglePetang,
}: DzikirSectionProps) {
  return (
    <section className="py-3">
      <div
        className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
        onClick={onToggleExpanded}
      >
        <button
          aria-label="Toggle All Dzikir"
          onClick={(e) => {
            e.stopPropagation();
            onToggleAll();
          }}
        >
          <CircleStatus checked={isDone} />
        </button>
        <h2 className="text-lg font-bold flex-1">Dzikir Pagi Petang</h2>
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
            <div className="mt-3 space-y-1 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-3">
              <button
                onClick={onTogglePagi}
                className="w-full flex items-center py-1.5 px-1 rounded-lg text-left"
              >
                <div className="flex items-center gap-3 text-base font-medium">
                  <CircleStatus checked={pagiDone} />
                  <span>Dzikir Pagi</span>
                </div>
              </button>
              <button
                onClick={onTogglePetang}
                className="w-full flex items-center py-1.5 px-1 rounded-lg text-left"
              >
                <div className="flex items-center gap-3 text-base font-medium">
                  <CircleStatus checked={petangDone} />
                  <span>Dzikir Petang</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
