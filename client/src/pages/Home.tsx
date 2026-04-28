import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "motion/react";
import Calendar from "../components/Calendar";
import fireIcon from "../assets/home/fire.svg";
import walletIcon from "../assets/home/wallet.svg";
import bookIcon from "../assets/home/book.svg";
import { CheckIcon } from "../assets/home/CheckIcon";
import { CrossIcon } from "../assets/home/CrossIcon";
import { ClockIcon } from "../assets/home/ClockIcon";
import { ChevronIcon } from "../assets/home/ChevronIcon";
import { CircularProgress } from "../assets/home/CircularProgress";




type SholatKey = "s" | "d" | "a" | "m" | "i";

export default function Home() {
  const [isSholatExpanded, setSholatExpanded] = useState(false);
  const name = useUserStore((s) => s.name);
  const streak = useUserStore((s) => s.streak);
  const targetSedekah = useUserStore((s) => s.targetSedekah);
  const targetQuran = useUserStore((s) => s.targetQuran);
  const today = useTaskStore(useShallow((s) => s.getToday()));
  const weeklySedekah = useTaskStore((s) => s.getWeeklySedekah());

  const sholatItems: { key: SholatKey; label: string; window: string }[] = [
    { key: "s", label: "Subuh", window: "Sebelum matahari terbit" },
    { key: "d", label: "Dzuhur", window: "Setelah matahari tergelincir" },
    { key: "a", label: "Ashar", window: "Menjelang sore" },
    { key: "m", label: "Maghrib", window: "Setelah matahari terbenam" },
    { key: "i", label: "Isya", window: "Malam hari" },
  ];

  const toPercent = (value: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min(100, Math.max(0, (value / target) * 100));
  };

  const sedekahPercent = toPercent(weeklySedekah, targetSedekah);
  const quranPercent = toPercent(today.quran.pages, targetQuran);
  const sholatDone = sholatItems.filter(
    (item) => today.sholat[item.key] === "done",
  ).length;

  return (
    <div className="p-8 pb-24 space-y-5 max-w-md mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="text-left">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-lg font-bold text-gray-400">Assalamu'alaikum,</p>
            <h1 className="text-2xl font-black text-black tracking-tighter">
              {name || "Sahabat"}
            </h1>
          </div>
          <p className="mt-1 text-sm font-bold text-gray-500">
            Sudahkah kamu beramal hari ini?
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2.5 mt-1">
          <img src={fireIcon} alt="" aria-hidden="true" className="h-8 w-8" />
          <div className="flex flex-col">
            <p className="text-2xl font-black leading-none text-black">
              {streak}
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Days
            </p>
          </div>
        </div>
      </div>

      <motion.div
        layout
        className="rounded-[26px] border-2 border-black bg-stone-50 p-5"
        transition={{
          layout: {
            duration: 0.3,
            type: "spring",
            bounce: 0,
            stiffness: 200,
            damping: 25,
          },
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black leading-none tracking-tight">
              Sholat Wajib
            </h2>
            <p className="mt-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
              5 Waktu Hari Ini
            </p>
          </div>

          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <CircularProgress sholatDone={sholatDone} />
            <div className="absolute flex flex-col items-center justify-center leading-none">
              <span className="text-sm font-black">{sholatDone}</span>
              <span className="text-[8px] font-bold text-gray-400">/5</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSholatExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-5 flex items-center justify-between rounded-2xl border-2 border-black bg-white p-3"
            >
              <div className="flex gap-2.5">
                {sholatItems.map((item) => {
                  const status = today.sholat[item.key];
                  return (
                    <div
                      key={item.key}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`h-8 w-8 rounded-lg border-2 border-black flex items-center justify-center ${
                          status === "done"
                            ? "bg-emerald-400"
                            : status === "halangan"
                              ? "bg-amber-300"
                              : "bg-gray-100"
                        }`}
                      >
                        {status === "done" ? (
                          <CheckIcon />
                        ) : status === "halangan" ? (
                          <CrossIcon />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase text-gray-400">
                        {item.label[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setSholatExpanded(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white"
              >
                <ChevronIcon direction="down" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-5 space-y-2.5">
                {sholatItems.map((item) => {
                  const status = today.sholat[item.key];
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-2xl border-2 border-black bg-white p-3 transition-all hover:bg-stone-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black ${
                            status === "done"
                              ? "bg-emerald-400"
                              : status === "halangan"
                                ? "bg-amber-300"
                                : "bg-stone-100"
                          }`}
                        >
                          {status === "done" ? (
                            <CheckIcon size={20} />
                          ) : status === "halangan" ? (
                            <CrossIcon size={20} />
                          ) : (
                            <ClockIcon size={20} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black leading-none">
                            {item.label}
                          </p>
                          <p className="mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                            {item.window}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`rounded-full border-2 border-black px-3 py-1 text-[10px] font-black uppercase ${
                          status === "done"
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "halangan"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-stone-100 text-gray-500"
                        }`}
                      >
                        {status === "done"
                          ? "Done"
                          : status === "halangan"
                            ? "Skip"
                            : "Pending"}
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setSholatExpanded(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-white"
                  >
                    <ChevronIcon direction="up" size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {/* Sedekah Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-black bg-stone-50 p-5 aspect-4/5">
          <div
            className="absolute inset-x-0 bottom-0 bg-emerald-300/60 transition-all duration-1000 ease-out"
            style={{ height: `${sedekahPercent}%` }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="rounded-xl border-2 border-black bg-white p-2.5">
                <img src={walletIcon} alt="" className="h-[22px] w-[22px]" />
              </div>
              <div className="rounded-full border-2 border-black bg-white/90 px-2 py-0.5 text-[11px] font-black">
                {Math.round(sedekahPercent)}%
              </div>
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
              Sedekah Pekan
            </p>
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl font-black leading-none text-black tracking-tighter">
              {weeklySedekah >= 1000
                ? `${(weeklySedekah / 1000).toFixed(0)}k`
                : weeklySedekah}
            </h3>
            <p className="mt-1 text-xs font-bold text-gray-600">
              /{" "}
              {targetSedekah >= 1000
                ? `${(targetSedekah / 1000).toFixed(0)}k`
                : targetSedekah}{" "}
              target
            </p>
          </div>
        </div>

        {/* Quran Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-black bg-stone-50 p-5 aspect-4/5">
          <div
            className="absolute inset-x-0 bottom-0 bg-sky-300/60 transition-all duration-1000 ease-out"
            style={{ height: `${quranPercent}%` }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="rounded-xl border-2 border-black bg-white p-2.5">
                <img src={bookIcon} alt="" className="h-[22px] w-[22px]" />
              </div>
              <div className="rounded-full border-2 border-black bg-white/90 px-2 py-0.5 text-[11px] font-black">
                {Math.round(quranPercent)}%
              </div>
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
              Tilawah Harian
            </p>
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl font-black leading-none text-black tracking-tighter">
              {today.quran.pages}
            </h3>
            <p className="mt-1 text-xs font-bold text-gray-600">
              / {targetQuran} halaman
            </p>
          </div>
        </div>
      </div>

      <Calendar />
    </div>
  );
}
