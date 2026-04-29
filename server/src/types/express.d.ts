import type { User } from "../db/schema.js";

declare global {
  namespace Express {
    interface Request {
      /** Populated by auth middleware after JWT verification */
      user?: Pick<User, "id" | "username">;
    }
  }
}

export {};
