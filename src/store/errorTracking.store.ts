/**
 * Error Tracking Store
 * Silently tracks typing errors for progress monitoring and skill assessment
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TypingError {
    id: string;
    expectedWord: string;      // The word they should have typed
    typedWord: string;          // What they actually typed
    timestamp: number;          // When the error happened
    corrected: boolean;         // Did they use suggestion/helper?
    testId: string;             // Which test session
    characterErrors: {          // Detailed character-level errors
        position: number;
        expected: string;
        typed: string;
    }[];
}

export interface ErrorStats {
    totalErrors: number;
    commonMistakes: Map<string, number>;  // Word -> error count
    difficultWords: string[];              // Words with most errors
    accuracyTrend: number[];               // Accuracy over time
    improvementRate: number;               // % improvement
}

export interface ErrorTrackingState {
    // Error history
    errors: TypingError[];
    currentTestId: string;

    // Track an error
    trackError: (
        expectedWord: string,
        typedWord: string,
        corrected: boolean,
        characterErrors?: { position: number; expected: string; typed: string }[]
    ) => void;

    // Start new test session
    startNewTest: () => void;

    // Get statistics
    getErrorStats: () => ErrorStats;
    getCommonMistakes: (limit?: number) => { word: string; count: number }[];
    getDifficultWords: (limit?: number) => string[];
    getRecentErrors: (count?: number) => TypingError[];

    // Export data
    exportToJSON: () => void;
    getExportData: () => object;

    // Clear old data
    clearOldErrors: (daysToKeep?: number) => void;
    reset: () => void;
}

export const useErrorTrackingStore = create<ErrorTrackingState>()(
    persist(
        (set, get) => ({
            errors: [],
            currentTestId: generateTestId(),

            trackError: (expectedWord, typedWord, corrected, characterErrors = []) => {
                const error: TypingError = {
                    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    expectedWord,
                    typedWord,
                    timestamp: Date.now(),
                    corrected,
                    testId: get().currentTestId,
                    characterErrors
                };

                set((state) => ({
                    errors: [...state.errors, error]
                }));

                // Keep only last 1000 errors to avoid storage bloat
                if (get().errors.length > 1000) {
                    set((state) => ({
                        errors: state.errors.slice(-1000)
                    }));
                }
            },

            startNewTest: () => {
                set({ currentTestId: generateTestId() });
            },

            getErrorStats: () => {
                const { errors } = get();

                if (errors.length === 0) {
                    return {
                        totalErrors: 0,
                        commonMistakes: new Map(),
                        difficultWords: [],
                        accuracyTrend: [],
                        improvementRate: 0
                    };
                }

                // Count mistakes per word
                const mistakeCounts = new Map<string, number>();
                errors.forEach((error) => {
                    const count = mistakeCounts.get(error.expectedWord) || 0;
                    mistakeCounts.set(error.expectedWord, count + 1);
                });

                // Calculate accuracy trend (last 10 tests)
                const testIds = [...new Set(errors.map(e => e.testId))].slice(-10);
                const accuracyTrend = testIds.map(testId => {
                    const testErrors = errors.filter(e => e.testId === testId);
                    // Approximate: assume 50 words per test
                    const accuracy = Math.max(0, 100 - (testErrors.length / 50) * 100);
                    return Math.round(accuracy);
                });

                // Calculate improvement rate
                let improvementRate = 0;
                if (accuracyTrend.length >= 2) {
                    const firstAvg = accuracyTrend.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, accuracyTrend.length);
                    const lastAvg = accuracyTrend.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, accuracyTrend.length);
                    improvementRate = Math.round(((lastAvg - firstAvg) / Math.max(firstAvg, 1)) * 100);
                }

                // Get difficult words (most errors)
                const difficultWords = Array.from(mistakeCounts.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([word]) => word);

                return {
                    totalErrors: errors.length,
                    commonMistakes: mistakeCounts,
                    difficultWords,
                    accuracyTrend,
                    improvementRate
                };
            },

            getCommonMistakes: (limit = 10) => {
                const { errors } = get();
                const mistakeCounts = new Map<string, number>();

                errors.forEach((error) => {
                    const count = mistakeCounts.get(error.expectedWord) || 0;
                    mistakeCounts.set(error.expectedWord, count + 1);
                });

                return Array.from(mistakeCounts.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, limit)
                    .map(([word, count]) => ({ word, count }));
            },

            getDifficultWords: (limit = 10) => {
                const mistakes = get().getCommonMistakes(limit);
                return mistakes.map(m => m.word);
            },

            getRecentErrors: (count = 20) => {
                return get().errors.slice(-count).reverse();
            },

            exportToJSON: () => {
                const data = get().getExportData();
                const jsonString = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                // Create download link
                const link = document.createElement('a');
                link.href = url;
                link.download = `typing-errors-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },

            getExportData: () => {
                const { errors } = get();
                const stats = get().getErrorStats();
                
                return {
                    exportDate: new Date().toISOString(),
                    summary: {
                        totalErrors: stats.totalErrors,
                        difficultWords: stats.difficultWords,
                        improvementRate: stats.improvementRate,
                        accuracyTrend: stats.accuracyTrend
                    },
                    commonMistakes: get().getCommonMistakes(20),
                    errors: errors,
                    metadata: {
                        version: '1.0',
                        exportedBy: 'Harry Potter Typing Game'
                    }
                };
            },

            clearOldErrors: (daysToKeep = 30) => {
                const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
                set((state) => ({
                    errors: state.errors.filter(e => e.timestamp > cutoffDate)
                }));
            },

            reset: () => {
                set({
                    errors: [],
                    currentTestId: generateTestId()
                });
            }
        }),
        {
            name: 'error-tracking-storage'
        }
    )
);

// Helper function to generate unique test IDs
function generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
