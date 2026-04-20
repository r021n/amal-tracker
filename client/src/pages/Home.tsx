import { useUserStore } from "../store/useUserStore";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";

export default function Home() {
  const name = useUserStore((s) => s.name);
  const streak = useUserStore((s) => s.streak);
  const targetSedekah = useUserStore((s) => s.targetSedekah);
  const targetQuran = useUserStore((s) => s.targetQuran);
  const today = useTaskStore(useShallow((s) => s.getToday()));
  const weeklySedekah = useTaskStore((s) => s.getWeeklySedekah());

  const keys = ["s", "d", "a", "m", "i"] as const;
  const labels = { s: "S", d: "D", a: "A", m: "M", i: "I" };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">Selamat datang {name}</h1>
        <div className="flex items-center gap-1">
          🔥<span>{streak}</span>
        </div>
      </div>
      <div className="flex justify-between">
        {keys.map((k) => {
          const st = today.sholat[k];
          const color =
            st === "done"
              ? "bg-green-500"
              : st === "halangan"
                ? "bg-yellow-400"
                : "bg-white border";
          return (
            <div
              key={k}
              className={`w-12 h-12 rounded-full grid place-items-center ${color}`}
            >
              {labels[k]}
            </div>
          );
        })}
      </div>
      <div className="space-y-2">
        <div className="p-3 bg-white rounded shadow">
          <div className="flex justify-between text-sm">
            <span>Sedekah pekan</span>
            <span>
              {weeklySedekah}/{targetSedekah}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded mt-2">
            <div
              className="h-2 bg-black rounded"
              style={{
                width: `${Math.min(100, (weeklySedekah / targetSedekah) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="p-3 bg-white rounded shadow">
          <div className="flex justify-between text-sm">
            <span>Quran hari ini</span>
            <span>
              {today.quran.pages}/{targetQuran}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded mt-2">
            <div
              className="h-2 bg-black rounded"
              style={{
                width: `${Math.min(100, (today.quran.pages / targetQuran) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="p-3 bg-white rounded shadow">
        <div className="flex gap-4 mb-2">
          <button className="font-medium">Hijriah</button>
          <button className="text-gray-400">Masehi</button>
        </div>
        <div className="text-center text-red-500">Kalender view only</div>
      </div>
    </div>
  );
}
