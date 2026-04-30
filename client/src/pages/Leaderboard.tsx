import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import flashIcon from "../assets/leaderboard/flash.svg";
import starIcon from "../assets/leaderboard/star.svg";

interface LeaderboardUser {
  id: number;
  name: string;
  username: string;
  score: number;
  streak: number;
  avatar?: string;
}

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const socket: Socket = io("http://localhost:3001", {
      withCredentials: true,
    });

    socket.on("leaderboardUpdate", (users: LeaderboardUser[]) => {
      const parsedUsers = users.map((u) => ({
        ...u,
        avatar: (u.name || u.username || "?").slice(0, 1).toUpperCase(),
      }));
      setData(parsedUsers);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
            const rank = data.indexOf(user) + 1;

            return (
              <motion.div
                key={user.id || user.username}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-center"
              >
                <div className="mb-2 flex flex-col items-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-black bg-black text-lg font-black text-white">
                    {user.avatar}
                  </div>
                  <p className="mt-2 text-sm font-bold leading-tight">
                    {user.name || user.username}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border-2 border-black bg-white px-2.5 py-1 text-[11px] font-semibold text-orange-500">
                    <img src={flashIcon} alt="" className="h-3.5 w-3.5" />
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
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase">
                    <img src={starIcon} alt="" className="h-3 w-3" />
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
            {data.length} peserta
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {others.map((u) => {
            const rank = data.indexOf(u) + 1;

            return (
              <motion.div
                key={u.id || u.username}
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
                  <p className="truncate text-base font-bold">
                    {u.name || u.username}
                  </p>
                  <p className="flex items-center gap-0.5 text-xs font-medium text-orange-600">
                    <img src={flashIcon} alt="" className="h-3.5 w-3.5" />
                    {u.streak} hari beruntun
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-amber-200 px-3 py-1 text-sm font-black text-black">
                  <img src={starIcon} alt="" className="h-3 w-3" />
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
