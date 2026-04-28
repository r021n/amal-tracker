import { AnimatePresence, motion } from "motion/react";

import CircleStatus from "./CircleStatus";

type CustomItem = { id: string; name: string; done: boolean };

type CustomSectionProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
  items: CustomItem[];
  customName: string;
  onCustomNameChange: (value: string) => void;
  onAddCustom: () => void;
  onToggleCustom: (id: string) => void;
  onRemoveCustom: (id: string) => void;
};

export default function CustomSection({
  expanded,
  onToggleExpanded,
  items,
  customName,
  onCustomNameChange,
  onAddCustom,
  onToggleCustom,
  onRemoveCustom,
}: CustomSectionProps) {
  return (
    <section className="py-3">
      <div
        className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
        onClick={onToggleExpanded}
      >
        <h2 className="text-lg font-bold flex-1 px-1 text-gray-800">
          Custom Kebaikan
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
            <div className="py-2">
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 px-1"
                  >
                    <button
                      onClick={() => onToggleCustom(item.id)}
                      className="flex-1 flex items-center gap-3 py-1 text-left"
                    >
                      <CircleStatus checked={item.done} />
                      <span className="text-base font-medium">{item.name}</span>
                    </button>
                    <button
                      onClick={() => onRemoveCustom(item.id)}
                      className="rounded-lg border-2 border-transparent bg-white px-3 py-1.5 text-sm font-semibold text-rose-500 hover:border-rose-300"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4 px-1">
                <input
                  value={customName}
                  onChange={(e) => onCustomNameChange(e.target.value)}
                  className="flex-1 rounded-xl border-2 border-black/70 px-3 py-2"
                  placeholder="Nama kebaikan..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onAddCustom();
                    }
                  }}
                />
                <button
                  onClick={onAddCustom}
                  className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl border-2 border-black bg-black text-xl font-bold text-white"
                  aria-label="Tambah custom kebaikan"
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
