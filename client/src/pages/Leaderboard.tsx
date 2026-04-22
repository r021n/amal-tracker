import fireIcon from "../assets/home/fire.svg";

const dummy = [
  { name: "Aisyah", streak: 42, avatar: "A" },
  { name: "Budi", streak: 38, avatar: "B" },
  { name: "Citra", streak: 35, avatar: "C" },
  { name: "Dian", streak: 30, avatar: "D" },
  { name: "Eko", streak: 27, avatar: "E" },
  { name: "Fatimah", streak: 22, avatar: "F" },
  { name: "Gilang", streak: 18, avatar: "G" },
  { name: "Hana", streak: 15, avatar: "H" },
  { name: "Irfan", streak: 12, avatar: "I" },
  { name: "Joko", streak: 9, avatar: "J" },
];

export default function Leaderboard() {
  const topThree = dummy.slice(0, 3);
  const others = dummy.slice(3);

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
      <section className="rounded-[28px] border-2 border-black bg-white">
        <div className="border-b-2 border-black px-5 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Papan Peringkat
          </p>
          <h1 className="mt-2 text-3xl font-black leading-none">
            Amal Terbaik
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Lihat siapa yang paling konsisten menjaga streak ibadahnya.
          </p>
        </div>

        <div className="bg-stone-50 px-4 py-5">
          <div className="grid grid-cols-3 items-end gap-3">
            {[topThree[1], topThree[0], topThree[2]].map((user, displayIndex) => {
              const originalIndex =
                displayIndex === 0 ? 1 : displayIndex === 1 ? 0 : 2;
              const rank = originalIndex + 1;

              return (
                <div key={user.name} className="text-center">
                  <div className="mb-2 flex flex-col items-center">
                    <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-black bg-black text-lg font-black text-white">
                      {user.avatar}
                    </div>
                    <p className="mt-2 text-sm font-bold leading-tight">
                      {user.name}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full border-2 border-black bg-white px-2.5 py-1 text-[11px] font-semibold">
                      <img
                        src={fireIcon}
                        alt=""
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />
                      {user.streak}
                    </span>
                  </div>
                  <div
                    className={`flex ${getPodiumHeight(originalIndex)} items-start justify-center rounded-t-[22px] border-2 border-black border-b-0 ${getPodiumTone(originalIndex)} px-2 pt-3`}
                  >
                    <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-black">
                      #{rank}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border-2 border-black bg-stone-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold leading-none">
              Peringkat Lainnya
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Urutan berdasarkan streak tertinggi
            </p>
          </div>
          <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-semibold">
            {dummy.length} peserta
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {others.map((u, i) => {
            const rank = i + 4;

            return (
              <div
                key={u.name}
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
                  <p className="text-xs text-gray-500">Menjaga amalan harian</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-amber-200 px-3 py-1 text-sm font-bold">
                  <img
                    src={fireIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                  {u.streak}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
