import { AnimatePresence, motion } from "motion/react";

import CircleStatus from "./CircleStatus";

type QuranSectionProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
  isDone: boolean;
  pages: number;
  onToggleDone: () => void;
  onSetPages: (pages: number) => void;
};

export default function QuranSection({
  expanded,
  onToggleExpanded,
  isDone,
  pages,
  onToggleDone,
  onSetPages,
}: QuranSectionProps) {
  const isDisabled = pages <= 0;

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
          Baca Quran
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
            <div className="mt-2 flex items-center gap-3 px-2">
              <button
                onClick={() => onSetPages(Math.max(0, pages - 1))}
                className="h-12 w-12 rounded-xl border-2 border-black bg-gray-100 text-2xl font-bold active:bg-gray-200"
              >
                -
              </button>
              <input
                type="number"
                value={pages}
                onChange={(e) =>
                  onSetPages(Math.max(0, Number(e.target.value)))
                }
                className="flex-1 min-w-0 rounded-xl border-2 border-black/70 px-3 py-2.5 text-center text-lg font-bold"
                placeholder="Jumlah halaman"
                min="0"
              />
              <button
                onClick={() => onSetPages(pages + 1)}
                className="h-12 w-12 rounded-xl border-2 border-black bg-gray-100 text-2xl font-bold active:bg-gray-200"
              >
                +
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
