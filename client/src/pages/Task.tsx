import { useMemo, useState } from "react";
import dayjs from "../lib/dayjs";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";

type SholatStatus = "none" | "done" | "halangan";

function CircleStatus({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid h-8 w-8 place-items-center rounded-full border text-sm font-semibold ${
        checked
          ? "bg-black text-white border-black"
          : "bg-white text-black border-black"
      }`}
    >
      {checked ? "✓" : ""}
    </span>
  );
}

function SholatStatusBadge({ status }: { status: SholatStatus }) {
  if (status === "done") {
    return (
      <span className="grid h-8 w-8 place-items-center rounded-full border border-black bg-black text-sm font-semibold text-white">
        ✓
      </span>
    );
  }

  if (status === "halangan") {
    return (
      <span className="grid h-8 w-8 place-items-center rounded-full border border-amber-500 bg-amber-50 text-xs font-semibold text-amber-700">
        H
      </span>
    );
  }

  return (
    <span className="grid h-8 w-8 place-items-center rounded-full border border-black bg-white text-sm font-semibold text-black" />
  );
}

export default function Task() {
  const today = useTaskStore(useShallow((s) => s.getToday()));
  const toggleSholat = useTaskStore((s) => s.toggleSholat);
  const toggleDzikir = useTaskStore((s) => s.toggleDzikir);
  const setQuranPages = useTaskStore((s) => s.setQuranPages);
  const toggleQuran = useTaskStore((s) => s.toggleQuran);
  const setSedekahAmount = useTaskStore((s) => s.setSedekahAmount);
  const toggleSedekah = useTaskStore((s) => s.toggleSedekah);
  const addCustom = useTaskStore((s) => s.addCustom);
  const toggleCustom = useTaskStore((s) => s.toggleCustom);
  const [customName, setCustomName] = useState("");

  const sholat = [
    { k: "s" as const, label: "Subuh", icon: "🌅" },
    { k: "d" as const, label: "Dzuhur", icon: "☀️" },
    { k: "a" as const, label: "Ashar", icon: "🌤️" },
    { k: "m" as const, label: "Maghrib", icon: "🌇" },
    { k: "i" as const, label: "Isya", icon: "🌙" },
  ];

  const sholatDoneCount = useMemo(
    () => sholat.filter((s) => today.sholat[s.k] !== "none").length,
    [sholat, today.sholat],
  );

  const customDoneCount = useMemo(
    () => today.custom.filter((c) => c.done).length,
    [today.custom],
  );

  const totalChecklist = 9 + today.custom.length;
  const doneChecklist =
    sholatDoneCount +
    Number(today.dzikirPagi) +
    Number(today.dzikirPetang) +
    Number(today.quran.done) +
    Number(today.sedekah.done) +
    customDoneCount;
  const progressPercent = Math.round(
    (doneChecklist / Math.max(1, totalChecklist)) * 100,
  );

  const hijriDate = dayjs().calendar("hijri").format("D MMMM YYYY [H]");
  const gregorianDate = dayjs().format("D MMM YYYY");

  const markAllSholat = () => {
    sholat.forEach((s) => {
      if (today.sholat[s.k] === "none") toggleSholat(s.k);
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <div className="rounded-[28px] border border-black bg-white">
        <div className="relative px-5 pt-7 pb-5 text-center">
          <h1 className="text-4xl font-black tracking-tight">
            IBADAH TODO LIST
          </h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            {hijriDate}
          </p>
          <p className="text-sm text-gray-500">{gregorianDate}</p>
        </div>

        <div className="h-2 border-y border-black bg-gray-200">
          <div
            className="h-full bg-red-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="px-3 pb-3 divide-y divide-gray-200">
          <section className="pt-3 pb-4">
            <button
              className="w-full flex items-center justify-between py-2"
              onClick={markAllSholat}
            >
              <div className="flex items-center gap-3">
                <CircleStatus checked={sholatDoneCount === sholat.length} />
                <h2 className="text-2xl font-bold">Sholat 5 waktu</h2>
              </div>
            </button>

            <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3">
              <div className="space-y-1">
                {sholat.map((s) => (
                  <button
                    key={s.k}
                    onClick={() => toggleSholat(s.k)}
                    className="w-full flex items-center justify-between py-2 px-1 rounded-lg hover:bg-white"
                  >
                    <span className="flex items-center gap-3 text-lg font-medium">
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </span>
                    <SholatStatusBadge status={today.sholat[s.k]} />
                  </button>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{sholatDoneCount}/5 sholat</span>
                <button
                  className="font-semibold underline"
                  onClick={markAllSholat}
                >
                  Centang semua
                </button>
              </div>
            </div>
          </section>

          <section className="py-3 space-y-3">
            <button
              onClick={() => toggleDzikir("pagi")}
              className="w-full flex items-center justify-between"
            >
              <span className="text-xl font-semibold">Dzikir Pagi</span>
              <CircleStatus checked={today.dzikirPagi} />
            </button>
            <button
              onClick={() => toggleDzikir("petang")}
              className="w-full flex items-center justify-between"
            >
              <span className="text-xl font-semibold">Dzikir Petang</span>
              <CircleStatus checked={today.dzikirPetang} />
            </button>
          </section>

          <section className="py-3 space-y-2">
            <button
              onClick={toggleQuran}
              disabled={today.quran.pages <= 0}
              className="w-full flex items-center justify-between disabled:opacity-40"
            >
              <span className="text-xl font-semibold">Baca Quran</span>
              <CircleStatus checked={today.quran.done} />
            </button>
            <input
              type="number"
              value={today.quran.pages}
              onChange={(e) => setQuranPages(Number(e.target.value))}
              className="w-full rounded-xl border border-black/70 px-3 py-2"
              placeholder="Jumlah halaman"
            />
          </section>

          <section className="py-3 space-y-2">
            <button
              onClick={toggleSedekah}
              disabled={today.sedekah.amount <= 0}
              className="w-full flex items-center justify-between disabled:opacity-40"
            >
              <span className="text-xl font-semibold">Sedekah</span>
              <CircleStatus checked={today.sedekah.done} />
            </button>
            <input
              type="number"
              value={today.sedekah.amount}
              onChange={(e) => setSedekahAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-black/70 px-3 py-2"
              placeholder="Nominal"
            />
          </section>

          <section className="py-3 space-y-3">
            <h2 className="text-xl font-semibold">Custom Kebaikan</h2>
            {today.custom.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCustom(c.id)}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
              >
                <span className="text-lg">{c.name}</span>
                <CircleStatus checked={c.done} />
              </button>
            ))}
            <div className="flex gap-2">
              <input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="flex-1 rounded-xl border border-black/70 px-3 py-2"
                placeholder="Nama kebaikan"
              />
              <button
                onClick={() => {
                  if (customName.trim()) {
                    addCustom(customName.trim());
                    setCustomName("");
                  }
                }}
                className="h-11 w-11 rounded-xl border border-black bg-black text-white text-xl"
                aria-label="Tambah custom kebaikan"
              >
                +
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
