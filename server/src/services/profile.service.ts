import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { users, type User } from "../db/schema.js";

/** Strip sensitive fields from user object */
function sanitizeUser(user: User) {
  const { passwordHash, ...safe } = user;
  return safe;
}

/**
 * Get full profile data for a user.
 */
export function getProfile(userId: number) {
  const user = db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) {
    throw { status: 404, code: "USER_NOT_FOUND", message: "User tidak ditemukan." };
  }

  return { user: sanitizeUser(user) };
}

/**
 * Update user profile fields.
 * If password is changed, it gets re-hashed.
 */
export async function updateProfile(
  userId: number,
  data: {
    name?: string;
    password?: string;
    gender?: "" | "L" | "P";
    targetSedekah?: number;
    targetQuran?: number;
  },
) {
  const user = db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) {
    throw { status: 404, code: "USER_NOT_FOUND", message: "User tidak ditemukan." };
  }

  const updates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (data.name !== undefined) updates.name = data.name;
  if (data.gender !== undefined) updates.gender = data.gender;
  if (data.targetSedekah !== undefined)
    updates.targetSedekah = data.targetSedekah;
  if (data.targetQuran !== undefined) updates.targetQuran = data.targetQuran;

  if (data.password !== undefined && data.password.length > 0) {
    updates.passwordHash = await bcrypt.hash(data.password, 10);
  }

  db.update(users).set(updates).where(eq(users.id, userId)).run();

  const updatedUser = db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .get()!;

  return {
    user: sanitizeUser(updatedUser),
    passwordChanged: data.password !== undefined && data.password.length > 0,
  };
}
