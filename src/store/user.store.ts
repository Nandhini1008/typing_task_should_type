/**
 * User data store (test history, personal bests)
 */
import { create } from 'zustand';
import type { TestResult, TestHistory } from '@/types/TestResult';
import {
    loadFromStorage,
    saveToStorage,
    StorageKeys,
} from '@/services/storage.service';

interface UserStore {
    testHistory: TestResult[];
    personalBests: {
        wpm: TestResult | null;
        accuracy: TestResult | null;
    };

    // Actions
    addTestResult: (result: TestResult) => void;
    clearHistory: () => void;
    loadHistory: () => void;
}

const loadedHistory = loadFromStorage<TestHistory>(StorageKeys.TEST_HISTORY);
const initialHistory = loadedHistory?.results || [];
const initialBests = loadedHistory?.personalBests || {
    wpm: null,
    accuracy: null,
};

export const useUserStore = create<UserStore>((set, get) => ({
    testHistory: initialHistory,
    personalBests: initialBests,

    addTestResult: (result) => {
        const { testHistory, personalBests } = get();
        const newHistory = [result, ...testHistory].slice(0, 100); // Keep last 100

        // Update personal bests
        const newBests = { ...personalBests };
        if (!newBests.wpm || result.wpm > newBests.wpm.wpm) {
            newBests.wpm = result;
        }
        if (!newBests.accuracy || result.accuracy > newBests.accuracy.accuracy) {
            newBests.accuracy = result;
        }

        set({
            testHistory: newHistory,
            personalBests: newBests,
        });

        // Save to localStorage
        saveToStorage(StorageKeys.TEST_HISTORY, {
            results: newHistory,
            personalBests: newBests,
        });
    },

    clearHistory: () => {
        set({
            testHistory: [],
            personalBests: { wpm: null, accuracy: null },
        });
        saveToStorage(StorageKeys.TEST_HISTORY, {
            results: [],
            personalBests: { wpm: null, accuracy: null },
        });
    },

    loadHistory: () => {
        const loaded = loadFromStorage<TestHistory>(StorageKeys.TEST_HISTORY);
        if (loaded) {
            set({
                testHistory: loaded.results || [],
                personalBests: loaded.personalBests || { wpm: null, accuracy: null },
            });
        }
    },
}));
