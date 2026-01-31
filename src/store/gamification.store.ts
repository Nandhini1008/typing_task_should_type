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

    // Achievements
    achievements: Achievement[];
    unlockAchievement: (achievementId: string) => void;

    // Stats
    perfectTests: number;
    totalTests: number;
    spellsCast: number; // Words typed perfectly
    recordTest: (perfect: boolean, words: number) => void;

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
        id: 'lightning_typer',
        name: '⚡ Lightning Typer',
        description: 'Type 50+ words per minute!',
        icon: '⚡'
    },
    {
        id: 'spell_master',
        name: '✨ Spell Master',
        description: 'Cast 500 perfect spells (words)!',
        icon: '✨'
    },
    {
        id: 'year_seven',
        name: '🎓 Seventh Year',
        description: 'Reach Hogwarts Year 7!',
        icon: '🎓'
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
            achievements: ACHIEVEMENTS,
            perfectTests: 0,
            totalTests: 0,
            spellsCast: 0,

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

                    // Level up if enough XP
                    while (remainingXP >= xpNeeded && newYear < 7) {
                        remainingXP -= xpNeeded;
                        newYear++;

                        // Check Year 7 achievement
                        if (newYear === 7) {
                            get().unlockAchievement('year_seven');
                        }
                    }

                    return {
                        currentYear: newYear,
                        experiencePoints: remainingXP
                    };
                });
            },

            unlockAchievement: (achievementId) => {
                set((state) => ({
                    achievements: state.achievements.map((achievement) =>
                        achievement.id === achievementId && !achievement.unlockedAt
                            ? { ...achievement, unlockedAt: Date.now() }
                            : achievement
                    )
                }));
            },

            recordTest: (perfect, words) => {
                set((state) => {
                    const newPerfectTests = perfect ? state.perfectTests + 1 : state.perfectTests;
                    const newTotalTests = state.totalTests + 1;
                    const newSpellsCast = state.spellsCast + words;

                    // Check achievements
                    if (newTotalTests === 1) {
                        get().unlockAchievement('first_spell');
                    }
                    if (newTotalTests >= 10) {
                        get().unlockAchievement('bookworm');
                    }
                    if (perfect) {
                        get().unlockAchievement('perfect_spellcaster');
                    }
                    if (newSpellsCast >= 500) {
                        get().unlockAchievement('spell_master');
                    }

                    return {
                        perfectTests: newPerfectTests,
                        totalTests: newTotalTests,
                        spellsCast: newSpellsCast
                    };
                });
            },

            reset: () =>
                set({
                    housePoints: 0,
                    totalPoints: 0,
                    currentYear: 1,
                    experiencePoints: 0,
                    achievements: ACHIEVEMENTS,
                    perfectTests: 0,
                    totalTests: 0,
                    spellsCast: 0
                })
        }),
        {
            name: 'harry-potter-gamification'
        }
    )
);
