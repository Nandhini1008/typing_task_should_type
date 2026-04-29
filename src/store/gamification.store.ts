/**
 * Gamification Store - House Points, Achievements, Progress
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type House = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: number;
}

export interface GamificationState {
    // House selection
    selectedHouse: House | null;
    setHouse: (house: House) => void;

    // Points system
    housePoints: number;
    totalPoints: number;
    addPoints: (points: number) => void;

    // Level/Year progression (Hogwarts Year 1-7)
    currentYear: number;
    experiencePoints: number;
    addExperience: (xp: number) => void;

    // Combo/Streak system
    currentCombo: number;
    maxCombo: number;
    incrementCombo: () => void;
    resetCombo: () => void;

    // Achievements
    achievements: Achievement[];
    unlockAchievement: (achievementId: string) => void;
    pendingAchievement: Achievement | null;
    clearPendingAchievement: () => void;

    // Stats
    perfectTests: number;
    totalTests: number;
    spellsCast: number; // Words typed perfectly
    totalWordsTyped: number;
    highestWPM: number;
    recordTest: (perfect: boolean, words: number, wpm: number) => void;

    // Level up notification
    showLevelUp: boolean;
    clearLevelUp: () => void;

    // Reset
    reset: () => void;
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_spell',
        name: '🪄 First Spell Cast',
        description: 'Complete your first typing test!',
        icon: '🪄'
    },
    {
        id: 'perfect_spellcaster',
        name: '⭐ Perfect Spellcaster',
        description: 'Achieve 100% accuracy!',
        icon: '⭐'
    },
    {
        id: 'combo_master',
        name: '🔥 Combo Master',
        description: 'Reach a 20x combo streak!',
        icon: '🔥'
    },
    {
        id: 'legendary_wizard',
        name: '⚡ Legendary Wizard',
        description: 'Reach a 50x combo streak!',
        icon: '⚡'
    },
    {
        id: 'house_champion',
        name: '🏆 House Champion',
        description: 'Earn 1000 house points!',
        icon: '🏆'
    },
    {
        id: 'bookworm',
        name: '📚 Bookworm',
        description: 'Complete 10 typing tests!',
        icon: '📚'
    },
    {
        id: 'dedicated_student',
        name: '📖 Dedicated Student',
        description: 'Complete 50 typing tests!',
        icon: '📖'
    },
    {
        id: 'lightning_typer',
        name: '⚡ Lightning Typer',
        description: 'Type 50+ words per minute!',
        icon: '⚡'
    },
    {
        id: 'speed_demon',
        name: '🚀 Speed Demon',
        description: 'Type 80+ words per minute!',
        icon: '🚀'
    },
    {
        id: 'spell_master',
        name: '✨ Spell Master',
        description: 'Cast 500 perfect spells (words)!',
        icon: '✨'
    },
    {
        id: 'word_wizard',
        name: '🌟 Word Wizard',
        description: 'Type 1000 total words!',
        icon: '🌟'
    },
    {
        id: 'year_seven',
        name: '🎓 Seventh Year',
        description: 'Reach Hogwarts Year 7!',
        icon: '🎓'
    },
    {
        id: 'perfect_streak',
        name: '💯 Perfect Streak',
        description: 'Complete 5 perfect tests in a row!',
        icon: '💯'
    }
];

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            selectedHouse: null,
            housePoints: 0,
            totalPoints: 0,
            currentYear: 1,
            experiencePoints: 0,
            currentCombo: 0,
            maxCombo: 0,
            achievements: ACHIEVEMENTS,
            pendingAchievement: null,
            perfectTests: 0,
            totalTests: 0,
            spellsCast: 0,
            totalWordsTyped: 0,
            highestWPM: 0,
            showLevelUp: false,

            setHouse: (house) => set({ selectedHouse: house }),

            addPoints: (points) => {
                set((state) => {
                    const newHousePoints = state.housePoints + points;
                    const newTotalPoints = state.totalPoints + points;

                    // Check for House Champion achievement
                    if (newTotalPoints >= 1000 && !get().achievements.find(a => a.id === 'house_champion')?.unlockedAt) {
                        get().unlockAchievement('house_champion');
                    }

                    return {
                        housePoints: newHousePoints,
                        totalPoints: newTotalPoints
                    };
                });
            },

            addExperience: (xp) => {
                set((state) => {
                    const newXP = state.experiencePoints + xp;
                    const xpNeeded = state.currentYear * 500; // 500xp per year

                    let newYear = state.currentYear;
                    let remainingXP = newXP;
                    let leveledUp = false;

                    // Level up if enough XP
                    while (remainingXP >= xpNeeded && newYear < 7) {
                        remainingXP -= xpNeeded;
                        newYear++;
                        leveledUp = true;

                        // Check Year 7 achievement
                        if (newYear === 7) {
                            get().unlockAchievement('year_seven');
                        }
                    }

                    return {
                        currentYear: newYear,
                        experiencePoints: remainingXP,
                        showLevelUp: leveledUp
                    };
                });
            },

            incrementCombo: () => {
                set((state) => {
                    const newCombo = state.currentCombo + 1;
                    const newMaxCombo = Math.max(newCombo, state.maxCombo);

                    // Check combo achievements
                    if (newCombo >= 20 && !get().achievements.find(a => a.id === 'combo_master')?.unlockedAt) {
                        get().unlockAchievement('combo_master');
                    }
                    if (newCombo >= 50 && !get().achievements.find(a => a.id === 'legendary_wizard')?.unlockedAt) {
                        get().unlockAchievement('legendary_wizard');
                    }

                    return {
                        currentCombo: newCombo,
                        maxCombo: newMaxCombo
                    };
                });
            },

            resetCombo: () => set({ currentCombo: 0 }),

            unlockAchievement: (achievementId) => {
                const achievement = get().achievements.find(a => a.id === achievementId);
                if (achievement && !achievement.unlockedAt) {
                    set((state) => ({
                        achievements: state.achievements.map((a) =>
                            a.id === achievementId
                                ? { ...a, unlockedAt: Date.now() }
                                : a
                        ),
                        pendingAchievement: achievement
                    }));
                }
            },

            clearPendingAchievement: () => set({ pendingAchievement: null }),

            clearLevelUp: () => set({ showLevelUp: false }),

            recordTest: (perfect, words, wpm) => {
                set((state) => {
                    const newPerfectTests = perfect ? state.perfectTests + 1 : state.perfectTests;
                    const newTotalTests = state.totalTests + 1;
                    const newSpellsCast = state.spellsCast + words;
                    const newTotalWords = state.totalWordsTyped + words;
                    const newHighestWPM = Math.max(wpm, state.highestWPM);

                    // Check achievements
                    if (newTotalTests === 1) {
                        get().unlockAchievement('first_spell');
                    }
                    if (newTotalTests >= 10) {
                        get().unlockAchievement('bookworm');
                    }
                    if (newTotalTests >= 50) {
                        get().unlockAchievement('dedicated_student');
                    }
                    if (perfect) {
                        get().unlockAchievement('perfect_spellcaster');
                    }
                    if (newSpellsCast >= 500) {
                        get().unlockAchievement('spell_master');
                    }
                    if (newTotalWords >= 1000) {
                        get().unlockAchievement('word_wizard');
                    }
                    if (wpm >= 50) {
                        get().unlockAchievement('lightning_typer');
                    }
                    if (wpm >= 80) {
                        get().unlockAchievement('speed_demon');
                    }

                    return {
                        perfectTests: newPerfectTests,
                        totalTests: newTotalTests,
                        spellsCast: newSpellsCast,
                        totalWordsTyped: newTotalWords,
                        highestWPM: newHighestWPM
                    };
                });
            },

            reset: () =>
                set({
                    housePoints: 0,
                    totalPoints: 0,
                    currentYear: 1,
                    experiencePoints: 0,
                    currentCombo: 0,
                    maxCombo: 0,
                    achievements: ACHIEVEMENTS,
                    pendingAchievement: null,
                    perfectTests: 0,
                    totalTests: 0,
                    spellsCast: 0,
                    totalWordsTyped: 0,
                    highestWPM: 0,
                    showLevelUp: false
                })
        }),
        {
            name: 'harry-potter-gamification'
        }
    )
);
