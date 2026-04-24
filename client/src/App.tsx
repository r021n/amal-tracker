import { Routes, Route, Navigate, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import BottomNav from "./components/BottomNav";
import { useUserStore } from "./store/useUserStore";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/history" element={<History />} />
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
