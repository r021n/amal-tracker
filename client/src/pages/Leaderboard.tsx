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
  return (
    <div className="p-4 max-w-md mx-auto space-y-3 pb-24">
      <h1 className="text-xl font-semibold">Leaderboard</h1>
      {dummy.map((u, i) => (
        <div
          key={u.name}
          className="flex items-center gap-3 p-3 bg-white rounded shadow"
        >
          <div className="w-6 text-center font-medium">{i + 1}</div>
          <div className="w-10 h-10 rounded-full bg-black text-white grid place-items-center">
            {u.avatar}
          </div>
          <div className="flex-1">{u.name}</div>
          <div className="flex items-center gap-1">
            🔥<span>{u.streak}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
