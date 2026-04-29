import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as taskService from "../services/task.service.js";

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// ─── Validation Schemas ──────────────────────────────────────────────────────

const sholatSchema = z.object({
  key: z.enum(["s", "d", "a", "m", "i"]),
  status: z.enum(["none", "done", "halangan"]),
});

const sholatAllSchema = z.object({
  status: z.enum(["none", "done", "halangan"]),
});

const dzikirSchema = z.object({
  type: z.enum(["pagi", "petang"]),
});

const dzikirAllSchema = z.object({
  done: z.boolean(),
});

const quranSchema = z.object({
  pages: z.number().int().min(0),
});

const sedekahSchema = z.object({
  amount: z.number().int().min(0),
});

const customSchema = z.object({
  name: z.string().min(1, "Nama task tidak boleh kosong").max(200).trim(),
});

// ─── Routes ──────────────────────────────────────────────────────────────────

/** GET /api/tasks/today — Get today's task day (auto-creates if needed) */
router.get("/today", (req: Request, res: Response) => {
  try {
    const result = taskService.getOrCreateToday(req.user!.id);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/sholat — Update individual sholat status */
router.put("/sholat", validate(sholatSchema), (req: Request, res: Response) => {
  try {
    const { key, status } = req.body;
    const result = taskService.updateSholat(req.user!.id, key, status);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/sholat/all — Set all sholat at once */
router.put("/sholat/all", validate(sholatAllSchema), (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const result = taskService.updateAllSholat(req.user!.id, status);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/dzikir — Toggle individual dzikir */
router.put("/dzikir", validate(dzikirSchema), (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    const result = taskService.toggleDzikir(req.user!.id, type);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/dzikir/all — Set both dzikir at once */
router.put("/dzikir/all", validate(dzikirAllSchema), (req: Request, res: Response) => {
  try {
    const { done } = req.body;
    const result = taskService.setAllDzikir(req.user!.id, done);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/quran — Set quran pages */
router.put("/quran", validate(quranSchema), (req: Request, res: Response) => {
  try {
    const { pages } = req.body;
    const result = taskService.setQuranPages(req.user!.id, pages);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/quran/toggle — Toggle quran done status */
router.put("/quran/toggle", (req: Request, res: Response) => {
  try {
    const result = taskService.toggleQuran(req.user!.id);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/sedekah — Set sedekah amount */
router.put("/sedekah", validate(sedekahSchema), (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const result = taskService.setSedekahAmount(req.user!.id, amount);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/sedekah/toggle — Toggle sedekah done status */
router.put("/sedekah/toggle", (req: Request, res: Response) => {
  try {
    const result = taskService.toggleSedekah(req.user!.id);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** POST /api/tasks/custom — Add a custom task */
router.post("/custom", validate(customSchema), (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = taskService.addCustomTask(req.user!.id, name);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** PUT /api/tasks/custom/:id/toggle — Toggle a custom task */
router.put("/custom/:id/toggle", (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: { code: "INVALID_ID", message: "ID tidak valid." } });
      return;
    }
    const result = taskService.toggleCustomTask(req.user!.id, id);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** DELETE /api/tasks/custom/:id — Remove a custom task */
router.delete("/custom/:id", (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: { code: "INVALID_ID", message: "ID tidak valid." } });
      return;
    }
    const result = taskService.removeCustomTask(req.user!.id, id);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** GET /api/tasks/history — Get task day history */
router.get("/history", (req: Request, res: Response) => {
  try {
    const from = typeof req.query.from === "string" ? req.query.from : undefined;
    const to = typeof req.query.to === "string" ? req.query.to : undefined;
    const result = taskService.getHistory(req.user!.id, from, to);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

/** GET /api/tasks/weekly-sedekah — Get weekly sedekah total */
router.get("/weekly-sedekah", (req: Request, res: Response) => {
  try {
    const result = taskService.getWeeklySedekah(req.user!.id);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: { code: err.code || "INTERNAL_ERROR", message: err.message || "Terjadi kesalahan server." },
    });
  }
});

export default router;
