import { desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

interface RankingEntry {
  rank: number;
  username: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
}

/**
 * Get the leaderboard rankings sorted by score descending.
 * Only returns registered users (no dummy data).
 */
export function getRankings(
  currentUserId: number,
  limit: number = 10,
) {
  const allUsers = db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      score: users.score,
      streak: users.streak,
    })
    .from(users)
    .orderBy(desc(users.score))
    .all();

  const rankings: RankingEntry[] = allUsers.map((u, index) => ({
    rank: index + 1,
    username: u.username,
    name: u.name || u.username,
    avatar: (u.name || u.username).slice(0, 1).toUpperCase(),
    score: u.score,
    streak: u.streak,
  }));

  const myRank = rankings.findIndex((r) => {
    const user = allUsers.find((u) => u.username === r.username);
    return user?.id === currentUserId;
  }) + 1;

  return {
    rankings: rankings.slice(0, limit),
    myRank: myRank || null,
  };
}
