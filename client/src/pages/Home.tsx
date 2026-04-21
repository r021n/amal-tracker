import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";
import Calendar from "../components/Calendar";
import fireIcon from "../assets/home/fire.svg";

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
  const sholatLogged = sholatItems.filter(
    (item) => today.sholat[item.key] !== "none",
  ).length;

  return (
    <div className="p-4 space-y-5 max-w-md mx-auto">
      <div className="flex items-start justify-between gap-3">
        <div className="text-left">
          <p className="text-2xl sm:text-3xl font-bold">Assalamu'alaikum,</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight mt-0.5">
            {name || "Sahabat"}
          </h1>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 mt-1.5">
          <img src={fireIcon} alt="" aria-hidden="true" className="h-6 w-6" />
          <p className="text-2xl font-black leading-none text-black">
            {streak}
          </p>
        </div>
      </div>

      <div className="rounded-[26px] border-2 border-black bg-stone-50 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold leading-none">
              Sholat Wajib
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Monitoring 5 waktu hari ini
            </p>
          </div>
          <p className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold">
            {sholatDone}/5 done
          </p>
        </div>

        {!isSholatExpanded && (
          <div className="mt-4 flex flex-wrap gap-2">
            {sholatItems.map((item) => {
              const status = today.sholat[item.key];
              const chipClass =
                status === "done"
                  ? "border-emerald-700 bg-emerald-500 text-white"
                  : status === "halangan"
                    ? "border-amber-700 bg-amber-300 text-black"
                    : "border-black bg-white text-gray-600";

              return (
                <span
                  key={item.key}
                  className={`rounded-full border-2 px-2.5 py-1 text-xs font-semibold ${chipClass}`}
                >
                  {item.label}
                </span>
              );
            })}
          </div>
        )}

        {isSholatExpanded && (
          <div className="mt-4 space-y-2">
            {sholatItems.map((item) => {
              const status = today.sholat[item.key];
              const badgeClass =
                status === "done"
                  ? "border-emerald-700 bg-emerald-500 text-white"
                  : status === "halangan"
                    ? "border-amber-700 bg-amber-300 text-black"
                    : "border-black bg-white text-gray-500";

              const statusText =
                status === "done"
                  ? "Tunaikan"
                  : status === "halangan"
                    ? "Halangan"
                    : "Belum";

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border-2 border-black/70 bg-white px-3 py-2"
                >
                  <div>
                    <p className="text-base font-semibold leading-none">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      {item.window}
                    </p>
                  </div>
                  <span
                    className={`min-w-20 rounded-full border-2 px-2 py-1 text-center text-[11px] font-semibold ${badgeClass}`}
                  >
                    {statusText}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-3 text-xs text-gray-600">
          {sholatLogged}/5 waktu sudah dicatat (termasuk halangan).
        </p>
        <button
          type="button"
          onClick={() => setSholatExpanded((v) => !v)}
          className="mt-2 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold"
        >
          {isSholatExpanded ? "Ringkas" : "Lihat detail"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-stone-50">
          <div
            className="absolute inset-y-0 left-0 bg-emerald-300/70"
            style={{ width: `${sedekahPercent}%` }}
          />
          <div className="relative p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-gray-600">
                Sedekah pekan
              </p>
              <span className="rounded-full border-2 border-black/60 bg-white/70 px-2 py-0.5 text-[11px] font-semibold">
                {Math.round(sedekahPercent)}%
              </span>
            </div>
            <p className="mt-1 text-3xl font-black leading-none text-black">
              {weeklySedekah.toLocaleString("id-ID")}
              <span className="ml-1 text-base font-semibold text-gray-700">
                / {targetSedekah.toLocaleString("id-ID")}
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Akumulasi sedekah sejak Jumat 18.00
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-stone-50">
          <div
            className="absolute inset-y-0 left-0 bg-sky-300/70"
            style={{ width: `${quranPercent}%` }}
          />
          <div className="relative p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-gray-600">
                Quran hari ini
              </p>
              <span className="rounded-full border-2 border-black/60 bg-white/70 px-2 py-0.5 text-[11px] font-semibold">
                {Math.round(quranPercent)}%
              </span>
            </div>
            <p className="mt-1 text-3xl font-black leading-none text-black">
              {today.quran.pages}
              <span className="ml-1 text-base font-semibold text-gray-700">
                / {targetQuran} halaman
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {today.quran.done
                ? "Target hari ini selesai"
                : "Lanjutkan bacaan untuk capai target"}
            </p>
          </div>
        </div>
      </div>

      <Calendar />
    </div>
  );
}
