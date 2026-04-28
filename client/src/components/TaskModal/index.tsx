import { AnimatePresence, motion } from "motion/react";

import { useTaskModal } from "../../hooks/useTaskModal";

import CustomSection from "./CustomSection";
import DzikirSection from "./DzikirSection";
import QuranSection from "./QuranSection";
import SedekahSection from "./SedekahSection";
import SholatSection from "./SholatSection";

export default function TaskModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    today,
    customName,
    setCustomName,
    isSholatExpanded,
    setSholatExpanded,
    isDzikirExpanded,
    setDzikirExpanded,
    isQuranExpanded,
    setQuranExpanded,
    isSedekahExpanded,
    setSedekahExpanded,
    isCustomExpanded,
    setCustomExpanded,
    sholatDoneCount,
    isQuranChecked,
    isSedekahChecked,
    progressPercent,
    hijriDate,
    gregorianDate,
    setSholatStatus,
    toggleAllSholat,
    toggleDzikir,
    toggleAllDzikir,
    setQuranPages,
    toggleQuran,
    setSedekahAmount,
    toggleSedekah,
    addCustomItem,
    toggleCustom,
    removeCustom,
    sedekahOptions,
  } = useTaskModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none p-4">
            <div className="relative flex w-full max-w-85 flex-col items-center pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="flex w-full max-h-[80vh] flex-col overflow-hidden rounded-3xl border-2 border-black bg-white shadow-xl"
              >
                <div className="relative z-10 border-b-2 border-black/5 bg-white px-4 pt-6 pb-3 text-center">
                  <h1 className="text-xl font-black tracking-tight">
                    IBADAH HARI INI
                  </h1>
                  <div className="mt-1 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    <span>{hijriDate}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>{gregorianDate}</span>
                  </div>
                  <div className="mt-1" />
                </div>

                <div className="flex-1 overflow-y-auto px-1 py-1 scrollbar-hide">
                  <div className="divide-y divide-gray-200 px-3 pb-3">
                    <SholatSection
                      expanded={isSholatExpanded}
                      onToggleExpanded={() =>
                        setSholatExpanded((value) => !value)
                      }
                      onToggleAll={toggleAllSholat}
                      doneCount={sholatDoneCount}
                      statuses={today.sholat}
                      onSetStatus={setSholatStatus}
                    />

                    <DzikirSection
                      expanded={isDzikirExpanded}
                      onToggleExpanded={() =>
                        setDzikirExpanded((value) => !value)
                      }
                      isDone={today.dzikirPagi && today.dzikirPetang}
                      pagiDone={today.dzikirPagi}
                      petangDone={today.dzikirPetang}
                      onToggleAll={toggleAllDzikir}
                      onTogglePagi={() => toggleDzikir("pagi")}
                      onTogglePetang={() => toggleDzikir("petang")}
                    />

                    <QuranSection
                      expanded={isQuranExpanded}
                      onToggleExpanded={() =>
                        setQuranExpanded((value) => !value)
                      }
                      isDone={isQuranChecked}
                      pages={today.quran.pages}
                      onToggleDone={toggleQuran}
                      onSetPages={setQuranPages}
                    />

                    <SedekahSection
                      expanded={isSedekahExpanded}
                      onToggleExpanded={() =>
                        setSedekahExpanded((value) => !value)
                      }
                      isDone={isSedekahChecked}
                      amount={today.sedekah.amount}
                      onToggleDone={toggleSedekah}
                      onSetAmount={setSedekahAmount}
                      options={sedekahOptions}
                    />

                    <CustomSection
                      expanded={isCustomExpanded}
                      onToggleExpanded={() =>
                        setCustomExpanded((value) => !value)
                      }
                      items={today.custom}
                      customName={customName}
                      onCustomNameChange={setCustomName}
                      onAddCustom={addCustomItem}
                      onToggleCustom={toggleCustom}
                      onRemoveCustom={removeCustom}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="z-20 mt-6"
              >
                <button
                  onClick={onClose}
                  className="relative flex h-16 w-16 items-center justify-center transition-transform active:scale-95"
                  aria-label="Tutup dan Simpan"
                >
                  <div className="absolute inset-0 rounded-full border-2 border-black bg-white shadow-[0_8px_25px_rgb(0,0,0,0.12)]" />

                  <svg
                    className="absolute inset-0 h-full w-full -rotate-90 overflow-visible"
                    viewBox="0 0 80 80"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="fill-white stroke-gray-100"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="213.6"
                      className={`transition-colors duration-500 ${
                        progressPercent >= 80
                          ? "text-emerald-500"
                          : progressPercent >= 50
                            ? "text-amber-500"
                            : "text-rose-500"
                      }`}
                      initial={{ strokeDashoffset: 213.6 }}
                      animate={{
                        strokeDashoffset: 213.6 * (1 - progressPercent / 100),
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="34"
                      className={`transition-colors duration-500 ${
                        progressPercent >= 80
                          ? "fill-emerald-500"
                          : progressPercent >= 50
                            ? "fill-amber-500"
                            : "fill-rose-500"
                      }`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: progressPercent === 100 ? 1 : 0,
                        opacity: progressPercent === 100 ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        type: "spring",
                        damping: 15,
                      }}
                    />
                  </svg>

                  <div
                    className={`relative z-10 text-xl font-black transition-all duration-500 ${
                      progressPercent === 100
                        ? "text-white scale-110"
                        : "text-black"
                    }`}
                  >
                    ✓
                  </div>
                </button>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
