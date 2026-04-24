import { NavLink } from "react-router";
import { useState } from "react";
import TaskModal from "./TaskModal";

const tabs = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Board" },
  { to: "/task", label: "", fab: true },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
];

export default function BottomNav() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t-2 border-black z-50">
        <div className="relative flex justify-around items-center h-16 max-w-md mx-auto">
          {tabs.map((t) =>
            t.fab ? (
              <button
                key={t.to}
                onClick={() => setIsTaskModalOpen(true)}
                className="absolute -top-6 left-1/2 -translate-x-1/2"
              >
                <div className="w-14 h-14 rounded-full border-2 border-black bg-white text-black grid place-items-center text-2xl">
                  +
                </div>
              </button>
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
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </>
  );
}
