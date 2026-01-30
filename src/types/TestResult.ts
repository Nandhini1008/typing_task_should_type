// Type definitions for test results
export interface CharacterStats {
    correct: number;
    incorrect: number;
    extra: number;
    missed: number;
}

export interface TestResult {
    id: string;
    wpm: number;
    rawWpm: number;
    accuracy: number;
    consistency: number;
    mode: 'time' | 'words' | 'quote';
    modeValue: number; // e.g., 30 for 30s time test, 50 for 50 words
    duration: number; // actual test duration in seconds
    charactersTyped: number;
    characterStats: CharacterStats;
    timestamp: number;
    language: string;
}

export interface TestHistory {
    results: TestResult[];
    personalBests: {
        wpm: TestResult | null;
        accuracy: TestResult | null;
    };
}
