import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Task from "./pages/Task";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/task" element={<Task />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
