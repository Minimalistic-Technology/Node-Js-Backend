interface PrizeLevel {
  level: number;
  amount: number;
  safeCheckpoint?: boolean;
}

export default function validatePrizeLadder(ladder: PrizeLevel[]) {
  if (!Array.isArray(ladder) || ladder.length === 0)
    return { success: false, error: "Prize ladder is required" };

  const levels = ladder.map((l) => l.level);
  const uniqueLevels = new Set(levels);
  if (uniqueLevels.size !== levels.length)
    return { success: false, error: "Levels must be unique" };

  const sortedLevels = [...levels].sort((a, b) => a - b);
  for (let i = 0; i < sortedLevels.length; i++) {
    if (sortedLevels[i] !== i + 1)
      return { success: false, error: "Levels must be sequential (1,2,3...)" };
  }

  const invalidAmounts = ladder.some((l) => typeof l.amount !== "number");
  if (invalidAmounts)
    return { success: false, error: "All amounts must be numeric" };

  return { success: true };
}
