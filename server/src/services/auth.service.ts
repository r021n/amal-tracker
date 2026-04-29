import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users, type User } from "../db/schema.js";

const JWT_SECRET = process.env.JWT_SECRET || "amal-tracker-secret";
const JWT_EXPIRES_IN = "7d";

/** Strip sensitive fields from user object */
function sanitizeUser(user: User) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

/**
 * Register a new user.
 * - Validates username uniqueness
 * - Hashes password
 * - Returns JWT + user data
 */
export async function register(username: string, password: string) {
  // Check if username already taken
  const existing = db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();

  if (existing) {
    throw { status: 409, code: "USERNAME_TAKEN", message: "Username sudah digunakan." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = db
    .insert(users)
    .values({ username, passwordHash })
    .returning()
    .get();

  return {
    token: generateToken(user),
    user: sanitizeUser(user),
  };
}

/**
 * Login an existing user.
 * - Verifies credentials
 * - Returns JWT + user data
 */
export async function login(username: string, password: string) {
  const user = db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();

  if (!user) {
    throw { status: 401, code: "INVALID_CREDENTIALS", message: "Username atau password salah." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw { status: 401, code: "INVALID_CREDENTIALS", message: "Username atau password salah." };
  }

  return {
    token: generateToken(user),
    user: sanitizeUser(user),
  };
}

/**
 * Get current user by ID (from JWT payload).
 */
export function getMe(userId: number) {
  const user = db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) {
    throw { status: 404, code: "USER_NOT_FOUND", message: "User tidak ditemukan." };
  }

  return { user: sanitizeUser(user) };
}
