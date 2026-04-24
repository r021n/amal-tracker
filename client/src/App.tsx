import { Routes, Route, Navigate, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import BottomNav from "./components/BottomNav";
import { useUserStore } from "./store/useUserStore";


const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

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
  const location = useLocation();

  return (
    <div className="min-h-screen bg-stone-100 pb-24 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/profile"
            element={
              <PageTransition>
                <Profile />
              </PageTransition>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PageTransition>
                  <Leaderboard />
                </PageTransition>
              }
            />
            <Route
              path="/history"
              element={
                <PageTransition>
                  <History />
                </PageTransition>
              }
            />
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
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}

