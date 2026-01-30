/**
 * Test state store using Zustand
 */
import { create } from 'zustand';
import type { Word } from '@/types/Word';
import type { TestResult } from '@/types/TestResult';

export type TestStatus = 'idle' | 'ready' | 'running' | 'completed';

interface TestStore {
    // State
    status: TestStatus;
    words: Word[];
    currentWordIndex: number;
    currentCharIndex: number;
    input: string;
    startTime: number | null;
    endTime: number | null;
    result: TestResult | null;

    // Actions
    setWords: (words: Word[]) => void;
    setStatus: (status: TestStatus) => void;
    setCurrentWordIndex: (index: number) => void;
    setCurrentCharIndex: (index: number) => void;
    setInput: (input: string) => void;
    startTest: () => void;
    completeTest: (result: TestResult) => void;
    resetTest: () => void;
}

const initialState = {
    status: 'idle' as TestStatus,
    words: [],
    currentWordIndex: 0,
    currentCharIndex: 0,
    input: '',
    startTime: null,
    endTime: null,
    result: null,
};

export const useTestStore = create<TestStore>((set) => ({
    ...initialState,

    setWords: (words) => set({ words, status: 'ready' }),

    setStatus: (status) => set({ status }),

    setCurrentWordIndex: (index) => set({ currentWordIndex: index }),

    setCurrentCharIndex: (index) => set({ currentCharIndex: index }),

    setInput: (input) => set({ input }),

    startTest: () =>
        set({
            status: 'running',
            startTime: Date.now(),
        }),

    completeTest: (result) =>
        set({
            status: 'completed',
            endTime: Date.now(),
            result,
        }),

    resetTest: () => set(initialState),
}));
