import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "amal-tracker-secret";

interface JwtPayload {
  userId: number;
  username: string;
}

/**
 * Middleware that verifies the JWT token from the Authorization header.
 * Sets req.user with { id, username } on success.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Token tidak ditemukan. Silakan login terlebih dahulu.",
      },
    });
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.userId, username: decoded.username };
    next();
  } catch {
    res.status(401).json({
      error: {
        code: "INVALID_TOKEN",
        message: "Token tidak valid atau sudah kedaluwarsa.",
      },
    });
  }
}
