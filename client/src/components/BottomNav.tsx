import { NavLink } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import TaskModal from "./TaskModal";

const tabs = [
  {
    to: "/",
    icon: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />,
  },
  {
    to: "/leaderboard",
    icon: (
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 10.63 21 8.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    ),
  },
  { to: "/task", fab: true },
  {
    to: "/history",
    icon: (
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 14.12l-5.23-3.15V7h1.5v5.21l4.5 2.67-.77 1.24z" />
    ),
  },
  {
    to: "/profile",
    icon: (
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    ),
  },
];

export default function BottomNav() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-black bg-white/90 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-md items-center justify-around px-4">
          {tabs.map((t) =>
            t.fab ? (
              <button
                key="fab"
                onClick={() => setIsTaskModalOpen(true)}
                className="absolute -top-6 left-1/2 -translate-x-1/2"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-black bg-white text-black transition-transform active:scale-95 shadow-md">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-black">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
              </button>
            ) : (
              <NavLink
                key={t.to}
                to={t.to}
                className="relative flex h-full w-14 flex-col items-center justify-center"
              >
                {({ isActive }) => (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-6 w-6 transition-all duration-300 ${
                        isActive ? "fill-black scale-110" : "fill-gray-300"
                      }`}
                    >
                      {t.icon}
                    </svg>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute bottom-2 h-1 w-4 rounded-full bg-black"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}
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
