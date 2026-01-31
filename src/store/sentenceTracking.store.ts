/**
 * Sentence Tracking Store
 * Tracks complete sentence attempts for Flutter app integration
 * Captures original typed text BEFORE any corrections
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SentenceAttempt {
    id: string;
    expectedSentence: string;           // Original sentence from Flutter/Gemini
    userTypedSentence: string;          // What user actually typed (with errors, NO modifications)
    timestamp: number;
    testId: string;
    hasErrors: boolean;
    errorCount: number;
}

export interface SentenceTrackingState {
    attempts: SentenceAttempt[];
    currentTestId: string;
    currentExpectedSentence: string;

    // Set the expected sentence (from Flutter/Gemini)
    setExpectedSentence: (sentence: string) => void;

    // Track the user's attempt (called when they finish typing)
    trackSentenceAttempt: (userTyped: string) => void;

    // Start new test
    startNewTest: () => void;

    // Export for Flutter
    exportSentenceComparison: () => void;
    getSentenceExportData: () => object;
    getLatestAttempt: () => SentenceAttempt | null;

    // Clear data
    reset: () => void;
}

export const useSentenceTrackingStore = create<SentenceTrackingState>()(
    persist(
        (set, get) => ({
            attempts: [],
            currentTestId: generateTestId(),
            currentExpectedSentence: '',

            setExpectedSentence: (sentence: string) => {
                set({ currentExpectedSentence: sentence });
            },

            trackSentenceAttempt: (userTyped: string) => {
                const { currentExpectedSentence, currentTestId } = get();

                // Compare and detect errors
                const hasErrors = userTyped.trim() !== currentExpectedSentence.trim();
                const errorCount = calculateErrorCount(currentExpectedSentence, userTyped);

                const attempt: SentenceAttempt = {
                    id: `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
                    expectedSentence: currentExpectedSentence,
                    userTypedSentence: userTyped,  // Raw attempt, no modifications
                    timestamp: Date.now(),
                    testId: currentTestId,
                    hasErrors,
                    errorCount
                };

                set((state) => ({
                    attempts: [...state.attempts, attempt]
                }));

                // Keep only last 100 sentences
                if (get().attempts.length > 100) {
                    set((state) => ({
                        attempts: state.attempts.slice(-100)
                    }));
                }
            },

            startNewTest: () => {
                set({
                    currentTestId: generateTestId(),
                    currentExpectedSentence: ''
                });
            },

            exportSentenceComparison: () => {
                const data = get().getSentenceExportData();
                const jsonString = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `sentence-comparison-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },

            getSentenceExportData: () => {
                const { attempts } = get();

                return {
                    exportDate: new Date().toISOString(),
                    totalAttempts: attempts.length,
                    attempts: attempts.map(attempt => ({
                        expected_line: attempt.expectedSentence,
                        user_line_without_modification: attempt.userTypedSentence,
                        has_errors: attempt.hasErrors,
                        error_count: attempt.errorCount,
                        timestamp: new Date(attempt.timestamp).toISOString()
                    })),
                    metadata: {
                        version: '1.0',
                        exportedBy: 'Harry Potter Typing Game',
                        format: 'sentence_comparison'
                    }
                };
            },

            getLatestAttempt: (): SentenceAttempt | null => {
                const { attempts } = get();
                if (attempts.length > 0) {
                    const latest = attempts[attempts.length - 1];
                    return latest !== undefined ? latest : null;
                }
                return null;
            },

            reset: () => {
                set({
                    attempts: [],
                    currentTestId: generateTestId(),
                    currentExpectedSentence: ''
                });
            }
        }),
        {
            name: 'sentence-tracking-storage'
        }
    )
);

// Helper function to generate unique test IDs
function generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Calculate error count (simple comparison)
function calculateErrorCount(expected: string, typed: string): number {
    const expectedWords = expected.trim().split(/\s+/);
    const typedWords = typed.trim().split(/\s+/);

    let errors = 0;

    // Check word count difference (extra or missing words)
    if (expectedWords.length !== typedWords.length) {
        errors += Math.abs(expectedWords.length - typedWords.length);
    }

    // Check word-by-word differences
    const minLength = Math.min(expectedWords.length, typedWords.length);
    for (let i = 0; i < minLength; i++) {
        if (expectedWords[i] !== typedWords[i]) {
            errors++;
        }
    }

    return errors;
}
