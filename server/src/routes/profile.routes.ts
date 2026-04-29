import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as profileService from "../services/profile.service.js";

const router = Router();

// All profile routes require authentication
router.use(authMiddleware);

// ─── Validation ──────────────────────────────────────────────────────────────

const updateProfileSchema = z.object({
  name: z.string().max(100).trim().optional(),
  password: z
    .string()
    .min(4, "Password minimal 4 karakter")
    .max(100)
    .optional()
    .or(z.literal("")),
  gender: z.enum(["", "L", "P"]).optional(),
  targetSedekah: z.number().int().min(0).optional(),
  targetQuran: z.number().int().min(0).optional(),
});

// ─── Routes ──────────────────────────────────────────────────────────────────

/** GET /api/profile — Get current user profile */
router.get("/", (req: Request, res: Response) => {
  try {
    const result = profileService.getProfile(req.user!.id);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/profile — Update user profile */
router.put(
  "/",
  validate(updateProfileSchema),
  async (req: Request, res: Response) => {
    try {
      const result = await profileService.updateProfile(req.user!.id, req.body);
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

export default router;
