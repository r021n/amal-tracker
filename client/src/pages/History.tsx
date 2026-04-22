import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";
import dayjs from "../lib/dayjs";

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
      <section className="overflow-hidden rounded-[28px] border-2 border-black bg-white">
        <div className="border-b-2 border-black px-5 py-5">
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

        <div className="space-y-3 bg-stone-50 p-4">
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
                className={`w-full rounded-2xl border-2 px-4 py-4 text-left transition-colors ${
                  isSelected
                    ? "border-black bg-amber-100"
                    : "border-black bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold leading-none">
                      {dayjs(date).format("DD MMM YYYY")}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {dayjs(date).format("dddd, DD MMMM YYYY")}
                    </p>
                  </div>
                  <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold">
                    {done} amal
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border-2 border-black bg-stone-100 px-2.5 py-1 text-[11px] font-semibold">
                    Sholat {sholatDone}/5
                  </span>
                  <span className="rounded-full border-2 border-black bg-stone-100 px-2.5 py-1 text-[11px] font-semibold">
                    Quran {d.quran.pages} hal
                  </span>
                  <span className="rounded-full border-2 border-black bg-stone-100 px-2.5 py-1 text-[11px] font-semibold">
                    Sedekah Rp{d.sedekah.amount.toLocaleString("id-ID")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {detail && selected && (
        <section className="rounded-[26px] border-2 border-black bg-stone-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Detail Hari
              </p>
              <h2 className="mt-1 text-2xl font-extrabold leading-none">
                {dayjs(selected).format("DD MMMM YYYY")}
              </h2>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold"
            >
              Tutup
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <h3 className="text-base font-bold">Sholat Wajib</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(detail.sholat).map(([key, value]) => {
                  const tone =
                    value === "done"
                      ? "bg-emerald-400 text-white border-emerald-700"
                      : value === "halangan"
                        ? "bg-amber-300 text-black border-amber-700"
                        : "bg-stone-100 text-gray-600 border-black";
                  const label =
                    value === "done"
                      ? "Tunaikan"
                      : value === "halangan"
                        ? "Halangan"
                        : "Belum";

                  return (
                    <span
                      key={key}
                      className={`rounded-full border-2 px-3 py-1 text-xs font-semibold ${tone}`}
                    >
                      {sholatLabel[key]}: {label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-black bg-white p-4">
              <h3 className="text-base font-bold">Ringkasan Amalan</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-black/70 bg-stone-50 px-3 py-2">
                  <span className="font-semibold">Dzikir</span>
                  <span className="text-right text-gray-600">
                    {detail.dzikirPagi || detail.dzikirPetang
                      ? `${detail.dzikirPagi ? "Pagi" : ""}${detail.dzikirPagi && detail.dzikirPetang ? " & " : ""}${detail.dzikirPetang ? "Petang" : ""}`
                      : "Belum dicatat"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-black/70 bg-stone-50 px-3 py-2">
                  <span className="font-semibold">Quran</span>
                  <span className="text-right text-gray-600">
                    {detail.quran.pages} halaman
                    {detail.quran.done ? " - selesai" : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-black/70 bg-stone-50 px-3 py-2">
                  <span className="font-semibold">Sedekah</span>
                  <span className="text-right text-gray-600">
                    Rp{detail.sedekah.amount.toLocaleString("id-ID")}
                    {detail.sedekah.done ? " - selesai" : ""}
                  </span>
                </div>
                <div className="rounded-xl border-2 border-black/70 bg-stone-50 px-3 py-3">
                  <p className="font-semibold">Custom Kebaikan</p>
                  <p className="mt-1 text-gray-600">
                    {detail.custom
                      .filter((c) => c.done)
                      .map((c) => c.name)
                      .join(", ") || "Belum ada yang selesai"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
