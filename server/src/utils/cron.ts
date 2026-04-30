import { Server } from "socket.io";
import { getRankings } from "../services/leaderboard.service.js";

// 5 minutes in ms
const LEADERBOARD_INTERVAL = 5 * 60 * 1000;

export function initCronJobs(io: Server) {
  // Setup interval to broadcast leaderboard
  setInterval(async () => {
    try {
      const result = await getRankings(-1, 50);
      io.emit("leaderboardUpdate", result.rankings);
    } catch (error) {
      console.error("[CRON] Gagal mengambil leaderboard:", error);
    }
  }, LEADERBOARD_INTERVAL);

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
