import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";
import dayjs from "../lib/dayjs";
import { motion, AnimatePresence } from "motion/react";
import { CalendarIcon } from "../assets/history/CalendarIcon";
import { SholatIcon } from "../assets/history/SholatIcon";
import { QuranIcon } from "../assets/history/QuranIcon";
import { SedekahIcon } from "../assets/history/SedekahIcon";
import { CloseIcon } from "../assets/history/CloseIcon";

const sholatLabel: Record<string, string> = {
  s: "Subuh",
  d: "Dzuhur",
  a: "Ashar",
  m: "Maghrib",
  i: "Isya",
};

export default function History() {
  const days = useTaskStore(useShallow((s) => s.days));
  const [selected, setSelected] = useState<string | null>(null);
  const sorted = Object.keys(days).sort((a, b) => b.localeCompare(a));
  const detail = selected ? days[selected] : null;

  return (
    <div className="mx-auto max-w-md space-y-5 p-4 pb-24">
      <div className="px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Riwayat
        </p>
        <h1 className="mt-2 text-3xl font-black leading-none">
          Catatan Ibadah
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Tinjau kembali progres harian dan buka detail amalan pada tanggal
          tertentu.
        </p>
      </div>

      <div className="space-y-3 p-4">
        {sorted.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-black/40 bg-white px-4 py-6 text-center">
            <p className="text-lg font-bold">Belum ada riwayat</p>
            <p className="mt-1 text-sm text-gray-500">
              Aktivitas harianmu akan muncul di sini setelah mulai dicatat.
            </p>
          </div>
        )}

        {sorted.map((date) => {
          const d = days[date];
          const sholatDone = Object.values(d.sholat).filter(
            (v) => v === "done",
          ).length;
          const done =
            sholatDone +
            (d.dzikirPagi ? 1 : 0) +
            (d.dzikirPetang ? 1 : 0) +
            (d.quran.done ? 1 : 0) +
            (d.sedekah.done ? 1 : 0) +
            d.custom.filter((c) => c.done).length;
          const isSelected = selected === date;

          return (
            <button
              key={date}
              onClick={() => setSelected(isSelected ? null : date)}
              className={`w-full rounded-2xl border-2 px-4 py-4 text-left transition-transform active:scale-[0.98] ${
                isSelected
                  ? "border-amber-500 bg-amber-100"
                  : "border-black bg-white hover:border-black/30 hover:bg-stone-50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <CalendarIcon />
                  </div>
                  <div>
                    <p className="text-lg font-black leading-none text-black">
                      {dayjs(date).format("DD MMM YYYY")}
                    </p>
                    <p className="mt-1 text-xs font-bold text-gray-400">
                      {dayjs(date).format("dddd").toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border-2 border-stone-400 bg-stone-50 px-3 py-1 text-xs font-black text-stone-700">
                  <span>{done}</span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-600">
                    Amal
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-emerald-700">
                  <SholatIcon />
                  <span className="text-[11px] font-black">{sholatDone}/5</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border-2 border-sky-200 bg-sky-50 px-2.5 py-1.5 text-sky-700">
                  <QuranIcon />
                  <span className="text-[11px] font-black">
                    {d.quran.pages}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border-2 border-orange-200 bg-orange-50 px-2.5 py-1.5 text-orange-700">
                  <SedekahIcon />
                  <span className="text-[11px] font-black">
                    {d.sedekah.amount >= 1000
                      ? `${(d.sedekah.amount / 1000).toFixed(0)}k`
                      : d.sedekah.amount}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {detail && selected && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.section
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border-2 border-black bg-stone-50 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                    Detail Catatan
                  </p>
                  <h2 className="mt-1 text-2xl font-black leading-none text-black">
                    {dayjs(selected).format("DD MMMM YYYY")}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-gray-500">
                    {dayjs(selected).format("dddd")}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white transition-all hover:bg-black hover:text-white active:scale-90"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border-2 border-black bg-white p-4">
                  <h3 className="text-base font-black flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs">
                      🕌
                    </span>
                    Sholat Wajib
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(detail.sholat).map(([key, value]) => {
                      const tone =
                        value === "done"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : value === "halangan"
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "bg-stone-50 text-gray-400 border-stone-200";
                      const label =
                        value === "done"
                          ? "Selesai"
                          : value === "halangan"
                            ? "Halangan"
                            : "Belum";

                      return (
                        <span
                          key={key}
                          className={`rounded-xl border-2 px-3 py-1.5 text-xs font-bold ${tone}`}
                        >
                          {sholatLabel[key]}: {label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-black bg-white p-4">
                  <h3 className="text-base font-black flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs">
                      📖
                    </span>
                    Ringkasan Amalan
                  </h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-stone-200 bg-stone-50 px-3 py-2.5">
                      <span className="font-bold text-black">Dzikir</span>
                      <span className="text-right font-medium text-gray-600">
                        {detail.dzikirPagi || detail.dzikirPetang
                          ? `${detail.dzikirPagi ? "Pagi" : ""}${detail.dzikirPagi && detail.dzikirPetang ? " & " : ""}${detail.dzikirPetang ? "Petang" : ""}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-stone-200 bg-stone-50 px-3 py-2.5">
                      <span className="font-bold text-black">Quran</span>
                      <span className="text-right font-medium text-gray-600">
                        {detail.quran.pages} hal {detail.quran.done ? "✓" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-stone-200 bg-stone-50 px-3 py-2.5">
                      <span className="font-bold text-black">Sedekah</span>
                      <span className="text-right font-medium text-gray-600">
                        Rp{detail.sedekah.amount.toLocaleString("id-ID")}{" "}
                        {detail.sedekah.done ? "✓" : ""}
                      </span>
                    </div>
                    <div className="rounded-xl border-2 border-stone-200 bg-stone-50 px-3 py-3">
                      <p className="font-bold text-black">Kebaikan Lainnya</p>
                      <p className="mt-1 font-medium text-gray-600 leading-relaxed">
                        {detail.custom
                          .filter((c) => c.done)
                          .map((c) => c.name)
                          .join(", ") || "Tidak ada catatan"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
