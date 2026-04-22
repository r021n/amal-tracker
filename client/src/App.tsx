import { Routes, Route, Navigate, Outlet } from "react-router";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Task from "./pages/Task";
import Login from "./pages/Login";
import BottomNav from "./components/BottomNav";
import { useUserStore } from "./store/useUserStore";

function ProtectedRoute() {
  const password = useUserStore((s) => s.password);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  if (!password) return <Navigate to="/profile" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function App() {
  const password = useUserStore((s) => s.password);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-stone-100 pb-24">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/task" element={<Task />} />
        </Route>
        <Route
          path="*"
          element={
            <Navigate
              to={password && isAuthenticated ? "/" : "/login"}
              replace
            />
          }
        />
      </Routes>
      <BottomNav />
    </div>
  );
}
