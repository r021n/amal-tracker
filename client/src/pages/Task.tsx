import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";

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
    { k: "s" as const, label: "Subuh" },
    { k: "d" as const, label: "Dzuhur" },
    { k: "a" as const, label: "Ashar" },
    { k: "m" as const, label: "Maghrib" },
    { k: "i" as const, label: "Isya" },
  ];

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto pb-24">
      <h1 className="text-xl font-semibold">Task Hari Ini</h1>
      <div className="bg-white p-3 rounded shadow space-y-2">
        <h2 className="font-medium">Sholat</h2>
        {sholat.map((s) => (
          <button
            key={s.k}
            onClick={() => toggleSholat(s.k)}
            className="w-full flex justify-between p-2 border rounded"
          >
            <span>{s.label}</span>
            <span>
              {today.sholat[s.k] === "done"
                ? "✓"
                : today.sholat[s.k] === "halangan"
                  ? "H"
                  : "○"}
            </span>
          </button>
        ))}
      </div>
      <div className="bg-white p-3 rounded shadow space-y-2">
        <h2 className="font-medium">Dzikir</h2>
        <button
          onClick={() => toggleDzikir("pagi")}
          className="w-full flex justify-between p-2 border rounded"
        >
          <span>Pagi</span>
          <span>{today.dzikirPagi ? "✓" : "○"}</span>
        </button>
        <button
          onClick={() => toggleDzikir("petang")}
          className="w-full flex justify-between p-2 border rounded"
        >
          <span>Petang</span>
          <span>{today.dzikirPetang ? "✓" : "○"}</span>
        </button>
      </div>
      <div className="bg-white p-3 rounded shadow space-y-2">
        <h2 className="font-medium">Baca Quran</h2>
        <input
          type="number"
          value={today.quran.pages}
          onChange={(e) => setQuranPages(Number(e.target.value))}
          className="w-full border p-2 rounded"
          placeholder="Jumlah halaman"
        />
        <button
          disabled={today.quran.pages <= 0}
          onClick={toggleQuran}
          className="w-full p-2 bg-black text-white rounded disabled:opacity-30"
        >
          {today.quran.done ? "Batal" : "Centang"}
        </button>
      </div>
      <div className="bg-white p-3 rounded shadow space-y-2">
        <h2 className="font-medium">Sedekah</h2>
        <input
          type="number"
          value={today.sedekah.amount}
          onChange={(e) => setSedekahAmount(Number(e.target.value))}
          className="w-full border p-2 rounded"
          placeholder="Nominal"
        />
        <button
          disabled={today.sedekah.amount <= 0}
          onClick={toggleSedekah}
          className="w-full p-2 bg-black text-white rounded disabled:opacity-30"
        >
          {today.sedekah.done ? "Batal" : "Centang"}
        </button>
      </div>
      <div className="bg-white p-3 rounded shadow space-y-2">
        <h2 className="font-medium">Custom Kebaikan</h2>
        {today.custom.map((c) => (
          <button
            key={c.id}
            onClick={() => toggleCustom(c.id)}
            className="w-full flex justify-between p-2 border rounded"
          >
            <span>{c.name}</span>
            <span>{c.done ? "✓" : "○"}</span>
          </button>
        ))}
        <div className="flex gap-2">
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Nama kebaikan"
          />
          <button
            onClick={() => {
              if (customName) {
                addCustom(customName);
                setCustomName("");
              }
            }}
            className="px-3 bg-black text-white rounded"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
