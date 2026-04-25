import { NavLink } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import TaskModal from "./TaskModal";

import homeIcon from "../assets/bottom_navbar/home.svg";
import historyIcon from "../assets/bottom_navbar/history.svg";
import trophyIcon from "../assets/bottom_navbar/trophy.svg";
import profileIcon from "../assets/bottom_navbar/profile.svg";
import plusIcon from "../assets/bottom_navbar/plus.svg";

const tabs = [
  {
    to: "/",
    icon: homeIcon,
  },
  {
    to: "/leaderboard",
    icon: trophyIcon,
  },
  { to: "/task", fab: true },
  {
    to: "/history",
    icon: historyIcon,
  },
  {
    to: "/profile",
    icon: profileIcon,
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
                  <img src={plusIcon} alt="" className="h-6 w-6 brightness-0" />
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
                    <img
                      src={t.icon}
                      alt=""
                      className={`h-5 w-5 transition-all duration-300 ${
                        isActive
                          ? "brightness-0 scale-110"
                          : "opacity-25 grayscale"
                      }`}
                    />
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
