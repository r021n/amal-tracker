import { Routes, Route, Navigate, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BottomNav from "./components/BottomNav";
import { useUserStore } from "./store/useUserStore";
import { useTaskStore } from "./store/useTaskStore";

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
  const username = useUserStore((s) => s.username);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  if (!username) return <Navigate to="/register" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function App() {
  const username = useUserStore((s) => s.username);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const fetchMe = useUserStore((s) => s.fetchMe);
  const fetchToday = useTaskStore((s) => s.fetchToday);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMe();
      fetchToday();
    }
  }, [isAuthenticated, fetchMe, fetchToday]);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-stone-100 pb-24 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <Profile />
                </PageTransition>
              }
            />
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
                to={
                  username && isAuthenticated
                    ? "/"
                    : username
                      ? "/login"
                      : "/register"
                }
                replace
              />
            }
          />
        </Routes>
      </AnimatePresence>
      {!isAuthPage && <BottomNav />}
    </div>
  );
}
