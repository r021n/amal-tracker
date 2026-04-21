import { NavLink } from "react-router";

const tabs = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Board" },
  { to: "/task", label: "", fab: true },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t">
      <div className="relative flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((t) =>
          t.fab ? (
            <NavLink
              key={t.to}
              to={t.to}
              className="absolute -top-6 left-1/2 -translate-x-1/2"
            >
              <div className="w-14 h-14 rounded-full border-2 border-black bg-white text-black grid place-items-center shadow-lg text-2xl">
                +
              </div>
            </NavLink>
          ) : (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `text-sm ${isActive ? "text-black font-medium" : "text-gray-400"}`
              }
            >
              {t.label}
            </NavLink>
          ),
        )}
      </div>
    </nav>
  );
}
