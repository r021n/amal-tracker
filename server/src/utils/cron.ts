import { Server } from "socket.io";
import { getRankings } from "../services/leaderboard.service.js";

// 5 minutes in ms
const LEADERBOARD_INTERVAL = 5 * 60 * 1000;

export function initCronJobs(io: Server) {
  const broadcastLeaderboard = async () => {
    try {
      const result = await getRankings(-1, 50);
      io.emit("leaderboardUpdate", result.rankings);
    } catch (error) {
      console.error("[CRON] Gagal mengambil leaderboard:", error);
    }
    scheduleNext();
  };

  const scheduleNext = () => {
    const now = Date.now();
    const next = Math.ceil(now / LEADERBOARD_INTERVAL) * LEADERBOARD_INTERVAL;
    const delay = next - now || LEADERBOARD_INTERVAL;
    setTimeout(broadcastLeaderboard, delay);
  };

  // Start the cycle
  scheduleNext();

  // Send to individual upon connection
  io.on("connection", async (socket) => {
    try {
      const result = await getRankings(-1, 50);
      socket.emit("leaderboardUpdate", result.rankings);
    } catch (error) {
      console.error("[CRON] Gagal mengirim initial leaderboard", error);
    }
  });
}
