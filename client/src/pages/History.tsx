import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";
import dayjs from "../lib/dayjs";

export default function History() {
  const days = useTaskStore(useShallow((s) => s.days));
  const [selected, setSelected] = useState<string | null>(null);
  const sorted = Object.keys(days).sort((a, b) => b.localeCompare(a));
  const detail = selected ? days[selected] : null;

  return (
    <div className="p-4 max-w-md mx-auto space-y-3 pb-24">
      <h1 className="text-xl font-semibold">History</h1>
      {sorted.map((date) => {
        const d = days[date];
        const done =
          Object.values(d.sholat).filter((v) => v === "done").length +
          (d.dzikirPagi ? 1 : 0) +
          (d.dzikirPetang ? 1 : 0) +
          (d.quran.done ? 1 : 0) +
          (d.sedekah.done ? 1 : 0) +
          d.custom.filter((c) => c.done).length;
        return (
          <button
            key={date}
            onClick={() => setSelected(date)}
            className="w-full text-left p-3 bg-white rounded shadow flex justify-between"
          >
            <span>{dayjs(date).format("DD MMM YYYY")}</span>
            <span className="text-sm text-gray-500">{done} amal</span>
          </button>
        );
      })}
      {detail && (
        <div className="p-3 bg-white rounded shadow space-y-2">
          <div className="flex justify-between">
            <h2 className="font-medium">
              {dayjs(selected).format("DD MMMM YYYY")}
            </h2>
            <button onClick={() => setSelected(null)}>Tutup</button>
          </div>
          <div>
            Sholat:{" "}
            {Object.entries(detail.sholat)
              .map(
                ([k, v]) =>
                  `${k.toUpperCase()}:${v === "done" ? "✓" : v === "halangan" ? "H" : "-"}`,
              )
              .join(" ")}
          </div>
          <div>
            Dzikir: {detail.dzikirPagi ? "Pagi " : ""}
            {detail.dzikirPetang ? "Petang" : ""}
          </div>
          <div>
            Quran: {detail.quran.pages} hal{" "}
            {detail.quran.done ? "(selesai)" : ""}
          </div>
          <div>
            Sedekah: Rp{detail.sedekah.amount}{" "}
            {detail.sedekah.done ? "(selesai)" : ""}
          </div>
          <div>
            Custom:{" "}
            {detail.custom
              .filter((c) => c.done)
              .map((c) => c.name)
              .join(", ") || "-"}
          </div>
        </div>
      )}
    </div>
  );
}
