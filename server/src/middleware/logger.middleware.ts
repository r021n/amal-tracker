import type { Request, Response, NextFunction } from "express";

/**
 * Memory-efficient logging middleware that records request details
 * and response status after the request is finished.
 */
export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();
  const { method, url } = req;

  // Wait for the response to finish before logging
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    // Simple colored log using standard console to keep it lightweight
    const color = status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";
    const reset = "\x1b[0m";
    
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} ${color}${status}${reset} - ${duration}ms`,
    );
  });

  next();
}
