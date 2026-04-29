import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as authService from "../services/auth.service.js";

const router = Router();

// ─── Validation Schemas ──────────────────────────────────────────────────────

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username tidak boleh kosong")
    .max(50, "Username maksimal 50 karakter")
    .trim(),
  password: z
    .string()
    .min(4, "Password minimal 4 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

const loginSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong").trim(),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Register a new user account.
 */
router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const result = await authService.register(username, password);
      res.status(201).json(result);
    } catch (err: any) {
      if (err.status) {
        res.status(err.status).json({ error: { code: err.code, message: err.message } });
        return;
      }
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server." } });
    }
  },
);

/**
 * POST /api/auth/login
 * Login with existing credentials.
 */
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (err: any) {
      if (err.status) {
        res.status(err.status).json({ error: { code: err.code, message: err.message } });
        return;
      }
      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server." } });
    }
  },
);

/**
 * GET /api/auth/me
 * Get current authenticated user info.
 */
router.get("/me", authMiddleware, (req: Request, res: Response) => {
  try {
    const result = authService.getMe(req.user!.id);
    res.json(result);
  } catch (err: any) {
    if (err.status) {
      res.status(err.status).json({ error: { code: err.code, message: err.message } });
      return;
    }
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server." } });
  }
});

export default router;
