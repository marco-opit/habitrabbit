/**
 * Leveling Logic for Habit Rabbit
 * 
 * Formula: Geometric progression
 * Base XP for Level 1 -> 2: 100
 * Growth Factor: 1.1 (10% increase per level)
 * 
 * Total XP for Level L:
 * XP_total(L) = 1000 * (1.1^(L-1) - 1)
 * 
 * Level L for given XP:
 * L = log1.1(XP/1000 + 1) + 1
 */

const BASE_XP = 100;
const GROWTH_FACTOR = 1.1;
const SCALE_FACTOR = BASE_XP / (GROWTH_FACTOR - 1); // 100 / 0.1 = 1000

export const calculateLevel = (totalPoints: number): number => {
    if (totalPoints <= 0) return 1;
    // L = log(XP/1000 + 1) / log(1.1) + 1
    const level = Math.log(totalPoints / SCALE_FACTOR + 1) / Math.log(GROWTH_FACTOR) + 1;
    return Math.floor(level);
};

export const getXpForLevel = (level: number): number => {
    if (level <= 1) return 0;
    // XP = 1000 * (1.1^(L-1) - 1)
    return Math.round(SCALE_FACTOR * (Math.pow(GROWTH_FACTOR, level - 1) - 1));
};

export const getProgressToNextLevel = (totalPoints: number): number => {
    const currentLevel = calculateLevel(totalPoints);
    const xpCurrentLevel = getXpForLevel(currentLevel);
    const xpNextLevel = getXpForLevel(currentLevel + 1);

    const xpInCurrentLevel = totalPoints - xpCurrentLevel;
    const xpRequiredForLevel = xpNextLevel - xpCurrentLevel;

    return xpInCurrentLevel / xpRequiredForLevel;
};

export const getPointsToNextLevel = (totalPoints: number): number => {
    const currentLevel = calculateLevel(totalPoints);
    const xpNextLevel = getXpForLevel(currentLevel + 1);
    return xpNextLevel - totalPoints;
};
