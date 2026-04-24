import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const dummy = [
  { name: "Budi", streak: 38, score: 3200, avatar: "B" },
  { name: "Aisyah", streak: 42, score: 3100, avatar: "A" },
  { name: "Citra", streak: 35, score: 2900, avatar: "C" },
  { name: "Dian", streak: 30, score: 2600, avatar: "D" },
  { name: "Eko", streak: 27, score: 2400, avatar: "E" },
  { name: "Fatimah", streak: 22, score: 2200, avatar: "F" },
  { name: "Gilang", streak: 18, score: 2000, avatar: "G" },
  { name: "Hana", streak: 15, score: 1800, avatar: "H" },
  { name: "Irfan", streak: 12, score: 1600, avatar: "I" },
  { name: "Joko", streak: 9, score: 1400, avatar: "J" },
].sort((a, b) => b.score - a.score);

const ScoreIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const StreakIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-3.5 w-3.5"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export default function Leaderboard() {
  const [data, setData] = useState(dummy);

  // ==========================================================================
  // SIMULASI PERUBAHAN RANKING (HAPUS BAGIAN INI NANTI)
  // ==========================================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = prev.map((user) => ({
          ...user,
          // Randomly change score slightly to trigger reorder
          score: user.score + Math.floor(Math.random() * 200) - 50,
        }));
        return [...newData].sort((a, b) => b.score - a.score);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  // ==========================================================================

  const topThree = data.slice(0, 3);
  const others = data.slice(3);

  const getPodiumHeight = (index: number) => {
    if (index === 0) return "h-32";
    if (index === 1) return "h-24";
    return "h-20";
  };

  const getPodiumTone = (index: number) => {
    if (index === 0) return "bg-amber-300";
    if (index === 1) return "bg-stone-200";
    return "bg-orange-200";
  };

  return (
    <div className="mx-auto max-w-md space-y-5 p-4 pb-24">
      <div className="px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Papan Peringkat
        </p>
        <h1 className="mt-2 text-3xl font-black leading-none">Amal Terbaik</h1>
        <p className="mt-2 text-sm text-gray-600">
          Lihat siapa yang memiliki skor tertinggi dan amalan paling konsisten.
        </p>
      </div>

      <div className="px-4 py-5">
        <div className="grid grid-cols-3 items-end gap-3">
          {[topThree[1], topThree[0], topThree[2]].map((user) => {
            if (!user) return null;
            const rank = data.findIndex((u) => u.name === user.name) + 1;

            return (
              <motion.div
                key={user.name}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-center"
              >
                <div className="mb-2 flex flex-col items-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-black bg-black text-lg font-black text-white">
                    {user.avatar}
                  </div>
                  <p className="mt-2 text-sm font-bold leading-tight">
                    {user.name}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border-2 border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-orange-500">
                    <StreakIcon />
                    {user.streak}
                  </span>
                </div>
                <motion.div
                  layout
                  className={`flex ${getPodiumHeight(rank - 1)} flex-col items-center justify-start gap-1 rounded-t-[22px] border-2 border-black border-b-0 ${getPodiumTone(rank - 1)} px-2 pt-3`}
                >
                  <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-black">
                    #{rank}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-black uppercase">
                    <ScoreIcon />
                    {user.score}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className=" p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold leading-none">
              Peringkat Lainnya
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Urutan berdasarkan skor tertinggi
            </p>
          </div>
          <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold">
            {dummy.length} peserta
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {others.map((u) => {
            const rank = data.findIndex((item) => item.name === u.name) + 1;

            return (
              <motion.div
                key={u.name}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex items-center gap-3 rounded-2xl border-2 border-black bg-white px-3 py-3"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-black bg-stone-100 text-sm font-black">
                  {rank}
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-black bg-black text-base font-black text-white">
                  {u.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold">{u.name}</p>
                  <p className="flex items-center gap-1 text-xs font-medium text-orange-600">
                    <StreakIcon />
                    {u.streak} hari beruntun
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-amber-200 px-3 py-1 text-sm font-black text-black">
                  <ScoreIcon />
                  {u.score}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
