import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as leaderboardService from "../services/leaderboard.service.js";

const router = Router();

// All leaderboard routes require authentication
router.use(authMiddleware);

// ─── Routes ──────────────────────────────────────────────────────────────────

/** GET /api/leaderboard — Get global rankings by score */
router.get("/", (req: Request, res: Response) => {
  try {
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit as string, 10) || 10),
    );
    const result = leaderboardService.getRankings(req.user!.id, limit);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: {
        code: err.code || "INTERNAL_ERROR",
        message: err.message || "Terjadi kesalahan server.",
      },
    });
  }
});

export default router;
