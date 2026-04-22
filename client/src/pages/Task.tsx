import { useMemo, useState } from "react";
import dayjs from "../lib/dayjs";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";

function CircleStatus({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid h-8 w-8 place-items-center rounded-full border-4 text-sm font-bold min-w-8 shrink-0 ${
        checked
          ? "bg-black text-white border-black"
          : "bg-white text-black border-gray-300"
      }`}
    >
      {checked ? "✓" : ""}
    </span>
  );
}

const sholat = [
  { k: "s" as const, label: "Subuh", icon: "🌅" },
  { k: "d" as const, label: "Dzuhur", icon: "☀️" },
  { k: "a" as const, label: "Ashar", icon: "🌤️" },
  { k: "m" as const, label: "Maghrib", icon: "🌇" },
  { k: "i" as const, label: "Isya", icon: "🌙" },
];

const sedekahOptions = [1000, 2000, 5000, 10000, 20000, 50000, 100000];

export default function Task() {
  const today = useTaskStore(useShallow((s) => s.getToday()));
  const setSholatStatus = useTaskStore((s) => s.setSholatStatus);
  const setAllSholat = useTaskStore((s) => s.setAllSholat);
  const toggleDzikir = useTaskStore((s) => s.toggleDzikir);
  const setAllDzikir = useTaskStore((s) => s.setAllDzikir);
  const setQuranPages = useTaskStore((s) => s.setQuranPages);
  const toggleQuran = useTaskStore((s) => s.toggleQuran);
  const setSedekahAmount = useTaskStore((s) => s.setSedekahAmount);
  const toggleSedekah = useTaskStore((s) => s.toggleSedekah);
  const addCustom = useTaskStore((s) => s.addCustom);
  const toggleCustom = useTaskStore((s) => s.toggleCustom);
  const removeCustom = useTaskStore((s) => s.removeCustom);
  const [customName, setCustomName] = useState("");

  const [isSholatExpanded, setSholatExpanded] = useState(false);
  const [isDzikirExpanded, setDzikirExpanded] = useState(false);
  const [isQuranExpanded, setQuranExpanded] = useState(false);
  const [isSedekahExpanded, setSedekahExpanded] = useState(false);
  const [isCustomExpanded, setCustomExpanded] = useState(false);

  const sholatDoneCount = useMemo(
    () => sholat.filter((s) => today.sholat[s.k] !== "none").length,
    [today.sholat],
  );

  const customDoneCount = useMemo(
    () => today.custom.filter((c) => c.done).length,
    [today.custom],
  );

  const isQuranChecked = today.quran.pages > 0 && today.quran.done;
  const isSedekahChecked = today.sedekah.amount > 0 && today.sedekah.done;

  const totalChecklist = 9 + today.custom.length;
  const doneChecklist =
    sholatDoneCount +
    Number(today.dzikirPagi) +
    Number(today.dzikirPetang) +
    Number(isQuranChecked) +
    Number(isSedekahChecked) +
    customDoneCount;
  const progressPercent = Math.round(
    (doneChecklist / Math.max(1, totalChecklist)) * 100,
  );
  const progressTone =
    progressPercent >= 80
      ? "bg-emerald-300/80"
      : progressPercent >= 50
        ? "bg-amber-300/80"
        : "bg-rose-300/80";

  const hijriDate = dayjs().calendar("hijri").format("D MMMM YYYY [H]");
  const gregorianDate = dayjs().format("D MMM YYYY");

  const toggleAllSholat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sholatDoneCount === sholat.length) {
      setAllSholat("none");
    } else {
      setAllSholat("done");
    }
  };

  const toggleAllDzikir = (e: React.MouseEvent) => {
    e.stopPropagation();
    const bothDone = today.dzikirPagi && today.dzikirPetang;
    setAllDzikir(!bothDone);
  };

  return (
    <div className="p-8 max-w-md mx-auto pb-24">
      <div className="rounded-[28px] border-2 border-black bg-white">
        <div className="relative px-5 pt-7 pb-5 text-center">
          <h1 className="text-3xl font-black tracking-tight">
            IBADAH HARI INI
          </h1>
          <p className="mt-2 text-lg font-semibold text-gray-700">
            {hijriDate}
          </p>
          <p className="text-sm text-gray-500">{gregorianDate}</p>
        </div>

        <div className="px-4 pb-4">
          <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-stone-50">
            <div
              className={`absolute inset-y-0 left-0 transition-all duration-300 ${progressTone}`}
              style={{ width: `${progressPercent}%` }}
            />
            <div className="relative p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wide text-gray-600">
                  Progress Ibadah
                </p>
                <span className="rounded-full border-2 border-black/60 bg-white/70 px-2 py-0.5 text-[11px] font-semibold">
                  {progressPercent}%
                </span>
              </div>
              <p className="mt-1 text-3xl font-black leading-none text-black">
                {doneChecklist}
                <span className="ml-1 text-base font-semibold text-gray-700">
                  / {totalChecklist} checklist
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 pb-3 divide-y divide-gray-200">
          {/* SHOLAT */}
          <section className="pt-3 pb-4">
            <div
              className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
              onClick={() => setSholatExpanded(!isSholatExpanded)}
            >
              <button aria-label="Toggle All Sholat" onClick={toggleAllSholat}>
                <CircleStatus checked={sholatDoneCount === sholat.length} />
              </button>
              <h2 className="text-2xl font-bold flex-1">Sholat 5 waktu</h2>
            </div>

            {isSholatExpanded && (
              <div className="mt-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-3">
                <div className="space-y-1">
                  {sholat.map((s) => {
                    const isDone = today.sholat[s.k] === "done";
                    const isHalangan = today.sholat[s.k] === "halangan";
                    return (
                      <div
                        key={s.k}
                        className="w-full flex items-center justify-between py-2 px-1 rounded-lg"
                      >
                        <button
                          onClick={() =>
                            setSholatStatus(s.k, isDone ? "none" : "done")
                          }
                          className="flex items-center gap-3 text-lg font-medium select-none text-left"
                        >
                          <CircleStatus checked={isDone} />
                          <span>
                            {s.icon} {s.label}
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            setSholatStatus(
                              s.k,
                              isHalangan ? "none" : "halangan",
                            )
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

                <div className="mt-3 flex items-center justify-between text-sm text-gray-500 px-1">
                  <span className="font-medium">
                    {sholatDoneCount}/5 selesai
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* DZIKIR */}
          <section className="py-3">
            <div
              className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
              onClick={() => setDzikirExpanded(!isDzikirExpanded)}
            >
              <button aria-label="Toggle All Dzikir" onClick={toggleAllDzikir}>
                <CircleStatus
                  checked={today.dzikirPagi && today.dzikirPetang}
                />
              </button>
              <h2 className="text-2xl font-bold flex-1">Dzikir Pagi Petang</h2>
            </div>

            {isDzikirExpanded && (
              <div className="mt-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-3 space-y-1">
                <button
                  onClick={() => toggleDzikir("pagi")}
                  className="w-full flex items-center justify-between py-2 px-1 rounded-lg text-left"
                >
                  <div className="flex items-center gap-3 text-lg font-medium">
                    <CircleStatus checked={today.dzikirPagi} />
                    <span>Dzikir Pagi</span>
                  </div>
                </button>
                <button
                  onClick={() => toggleDzikir("petang")}
                  className="w-full flex items-center justify-between py-2 px-1 rounded-lg text-left"
                >
                  <div className="flex items-center gap-3 text-lg font-medium">
                    <CircleStatus checked={today.dzikirPetang} />
                    <span>Dzikir Petang</span>
                  </div>
                </button>
              </div>
            )}
          </section>

          {/* QURAN */}
          <section className="py-3">
            <div
              className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
              onClick={() => setQuranExpanded(!isQuranExpanded)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleQuran();
                }}
                disabled={today.quran.pages <= 0}
                className="disabled:opacity-40"
              >
                <CircleStatus checked={isQuranChecked} />
              </button>
              <h2
                className={`text-2xl font-bold ${today.quran.pages <= 0 ? "opacity-40" : ""}`}
              >
                Baca Quran
              </h2>
            </div>

            {isQuranExpanded && (
              <div className="flex items-center gap-3 px-2 mt-2">
                <button
                  onClick={() =>
                    setQuranPages(Math.max(0, today.quran.pages - 1))
                  }
                  className="h-12 w-12 rounded-xl border-2 border-black bg-gray-100 text-2xl font-bold active:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  value={today.quran.pages}
                  onChange={(e) =>
                    setQuranPages(Math.max(0, Number(e.target.value)))
                  }
                  className="flex-1 min-w-0 rounded-xl border-2 border-black/70 px-3 py-2.5 text-center text-lg font-bold"
                  placeholder="Jumlah halaman"
                  min="0"
                />
                <button
                  onClick={() => setQuranPages(today.quran.pages + 1)}
                  className="h-12 w-12 rounded-xl border-2 border-black bg-gray-100 text-2xl font-bold active:bg-gray-200"
                >
                  +
                </button>
              </div>
            )}
          </section>

          {/* SEDEKAH */}
          <section className="py-3">
            <div
              className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
              onClick={() => setSedekahExpanded(!isSedekahExpanded)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSedekah();
                }}
                disabled={today.sedekah.amount <= 0}
                className="disabled:opacity-40"
              >
                <CircleStatus checked={isSedekahChecked} />
              </button>
              <h2
                className={`text-2xl font-bold ${today.sedekah.amount <= 0 ? "opacity-40" : ""}`}
              >
                Sedekah
              </h2>
            </div>

            {isSedekahExpanded && (
              <div className="px-2 mt-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {sedekahOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSedekahAmount(amount)}
                      className={`rounded-full border-2 px-3 py-1 text-sm font-semibold transition-colors ${
                        today.sedekah.amount === amount
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white text-black hover:border-black"
                      }`}
                    >
                      {amount / 1000}k
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={today.sedekah.amount || ""}
                  onChange={(e) =>
                    setSedekahAmount(Math.max(0, Number(e.target.value)))
                  }
                  className="w-full rounded-xl border-2 border-black/70 px-4 py-2.5 font-medium"
                  placeholder="Nominal custom..."
                  min="0"
                />
              </div>
            )}
          </section>

          {/* CUSTOM */}
          <section className="py-3">
            <div
              className="w-full flex items-center gap-3 py-2 cursor-pointer select-none"
              onClick={() => setCustomExpanded(!isCustomExpanded)}
            >
              <h2 className="text-2xl font-bold px-1 text-gray-800">
                Custom Kebaikan
              </h2>
            </div>

            {isCustomExpanded && (
              <div className="py-2">
                <div className="space-y-2">
                  {today.custom.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-2 px-1 group"
                    >
                      <button
                        onClick={() => toggleCustom(c.id)}
                        className="flex-1 flex items-center gap-3 text-left py-1"
                      >
                        <CircleStatus checked={c.done} />
                        <span className="text-lg font-medium">{c.name}</span>
                      </button>
                      <button
                        onClick={() => removeCustom(c.id)}
                        className="rounded-lg px-3 py-1.5 border-2 border-transparent hover:border-rose-300 text-sm font-semibold text-rose-500 bg-white"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4 px-1">
                  <input
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="flex-1 rounded-xl border-2 border-black/70 px-3 py-2"
                    placeholder="Nama kebaikan..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customName.trim()) {
                        addCustom(customName.trim());
                        setCustomName("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (customName.trim()) {
                        addCustom(customName.trim());
                        setCustomName("");
                      }
                    }}
                    className="h-11 w-11 rounded-xl border-2 border-black bg-black text-white text-xl font-bold flex items-center justify-center shrink-0"
                    aria-label="Tambah custom kebaikan"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
