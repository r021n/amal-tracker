import { AnimatePresence, motion } from "motion/react";

import CircleStatus from "./CircleStatus";
import { sholatItems, type SholatKey, type SholatStatus } from "./constants";

type SholatSectionProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
  onToggleAll: () => void;
  doneCount: number;
  statuses: Record<SholatKey, SholatStatus>;
  onSetStatus: (key: SholatKey, status: SholatStatus) => void;
};

export default function SholatSection({
  expanded,
  onToggleExpanded,
  onToggleAll,
  doneCount,
  statuses,
  onSetStatus,
}: SholatSectionProps) {
  const allDone = doneCount === sholatItems.length;

  return (
    <section className="pt-2 pb-3">
      <div
        className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
        onClick={onToggleExpanded}
      >
        <button
          aria-label="Toggle All Sholat"
          onClick={(e) => {
            e.stopPropagation();
            onToggleAll();
          }}
        >
          <CircleStatus checked={allDone} />
        </button>
        <h2 className="text-lg font-bold flex-1">Sholat 5 waktu</h2>
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
            <div className="mt-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-3">
              <div className="space-y-1">
                {sholatItems.map((item) => {
                  const isDone = statuses[item.k] === "done";
                  const isHalangan = statuses[item.k] === "halangan";

                  return (
                    <div
                      key={item.k}
                      className="w-full flex items-center justify-between rounded-lg px-1 py-2"
                    >
                      <button
                        onClick={() =>
                          onSetStatus(item.k, isDone ? "none" : "done")
                        }
                        className="flex items-center gap-2 text-left text-base font-medium select-none"
                      >
                        <CircleStatus checked={isDone} />
                        <span>
                          {item.icon} {item.label}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          onSetStatus(item.k, isHalangan ? "none" : "halangan")
                        }
                        className={`rounded-full border-2 px-3 py-1 text-xs font-bold transition-colors ${
                          isHalangan
                            ? "border-amber-600 bg-amber-200 text-amber-900"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        Halangan
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between px-1 text-sm text-gray-500">
                <span className="font-medium">{doneCount}/5 selesai</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
