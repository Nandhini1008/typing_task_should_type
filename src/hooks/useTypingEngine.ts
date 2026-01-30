/**
 * Core typing engine hook
 * Handles character-by-character validation, error tracking, and test logic
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Word, Character } from '@/types/Word';
import type { TestResult } from '@/types/TestResult';
import { calculateWPM } from '@/utils/calculateWPM';
import { calculateAccuracy } from '@/utils/calculateAccuracy';
import { useTestStore } from '@/store/test.store';
import { useUserStore } from '@/store/user.store';
import { trackTestComplete } from '@/services/analytics.service';

export interface TypingEngineState {
    words: Word[];
    currentWordIndex: number;
    currentCharIndex: number;
    input: string;
    correctChars: number;
    incorrectChars: number;
    extraChars: number;
    isTestComplete: boolean;
    wpm: number;
    accuracy: number;
}

export interface TypingEngineActions {
    handleKeyPress: (key: string) => void;
    handleBackspace: () => void;
    reset: () => void;
}

export function useTypingEngine(
    testWords: string[],
    mode: 'time' | 'words' | 'quote',
    modeValue: number
): [TypingEngineState, TypingEngineActions] {
    const { startTest, completeTest, setStatus } = useTestStore();
    const { addTestResult } = useUserStore();
    const [words, setWords] = useState<Word[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [input, setInput] = useState('');
    const [correctChars, setCorrectChars] = useState(0);
    const [incorrectChars, setIncorrectChars] = useState(0);
    const [extraChars, setExtraChars] = useState(0);
    const [isTestComplete, setIsTestComplete] = useState(false);
    const startTimeRef = useRef<number | null>(null);

    // Initialize words
    useEffect(() => {
        const initialWords: Word[] = testWords.map((word, index) => ({
            id: `word-${index}`,
            value: word,
            characters: word.split('').map((char) => ({
                value: char,
                status: 'pending',
            })),
            isActive: index === 0,
            isCompleted: false,
        }));
        setWords(initialWords);
    }, [testWords]);

    // Calculate real-time metrics
    const totalChars = correctChars + incorrectChars + extraChars;
    const elapsedTime = startTimeRef.current
        ? (Date.now() - startTimeRef.current) / 1000
        : 0.01;
    const wpm = calculateWPM(correctChars, elapsedTime);
    const accuracy = calculateAccuracy(correctChars, totalChars);

    const handleKeyPress = useCallback(
        (key: string) => {
            // Start test on first keypress
            if (!startTimeRef.current) {
                startTimeRef.current = Date.now();
                startTest();
            }

            if (isTestComplete) return;

            const currentWord = words[currentWordIndex];
            if (!currentWord) return;

            const newInput = input + key;
            setInput(newInput);

            // Update character status
            const updatedWords = [...words];
            const wordChars = currentWord.characters;

            if (currentCharIndex < wordChars.length) {
                // Typing within word bounds
                const char = wordChars[currentCharIndex]!;
                if (char.value === key) {
                    char.status = 'correct';
                    setCorrectChars((prev) => prev + 1);
                } else {
                    char.status = 'incorrect';
                    setIncorrectChars((prev) => prev + 1);
                }
                setCurrentCharIndex(currentCharIndex + 1);
            } else {
                // Extra characters
                const extraChar: Character = {
                    value: key,
                    status: 'extra',
                };
                wordChars.push(extraChar);
                setExtraChars((prev) => prev + 1);
                setCurrentCharIndex(currentCharIndex + 1);
            }

            updatedWords[currentWordIndex] = currentWord;
            setWords(updatedWords);
        },
        [
            words,
            currentWordIndex,
            currentCharIndex,
            input,
            isTestComplete,
            startTest,
        ]
    );

    const handleBackspace = useCallback(() => {
        if (currentCharIndex === 0) return;

        const updatedWords = [...words];
        const currentWord = updatedWords[currentWordIndex]!;
        const newCharIndex = currentCharIndex - 1;

        // Remove last character status
        const char = currentWord.characters[newCharIndex];
        if (char) {
            if (char.status === 'correct') {
                setCorrectChars((prev) => prev - 1);
            } else if (char.status === 'incorrect') {
                setIncorrectChars((prev) => prev - 1);
            } else if (char.status === 'extra') {
                setExtraChars((prev) => prev - 1);
                currentWord.characters.pop();
            }

            if (char.status !== 'extra') {
                char.status = 'pending';
            }
        }

        setCurrentCharIndex(newCharIndex);
        setInput(input.slice(0, -1));
        setWords(updatedWords);
    }, [words, currentWordIndex, currentCharIndex, input]);

    const handleSpace = useCallback(() => {
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
            startTest();
        }

        // Move to next word
        const updatedWords = [...words];
        if (currentWordIndex < words.length - 1) {
            updatedWords[currentWordIndex]!.isActive = false;
            updatedWords[currentWordIndex]!.isCompleted = true;
            updatedWords[currentWordIndex + 1]!.isActive = true;

            setWords(updatedWords);
            setCurrentWordIndex(currentWordIndex + 1);
            setCurrentCharIndex(0);
            setInput('');

            // Check if test is complete (word mode)
            if (mode === 'words' && currentWordIndex + 1 >= modeValue) {
                completeTestHandler();
            }
        } else {
            // Last word - complete test
            completeTestHandler();
        }
    }, [words, currentWordIndex, mode, modeValue, startTest]);

    const completeTestHandler = useCallback(() => {
        if (!startTimeRef.current || isTestComplete) return;

        const duration = (Date.now() - startTimeRef.current) / 1000;

        const result: TestResult = {
            id: `test-${Date.now()}`,
            wpm,
            rawWpm: calculateWPM(totalChars, duration),
            accuracy,
            consistency: 0, // TODO: Calculate consistency
            mode,
            modeValue,
            duration,
            charactersTyped: totalChars,
            characterStats: {
                correct: correctChars,
                incorrect: incorrectChars,
                extra: extraChars,
                missed: 0, // TODO: Calculate missed
            },
            timestamp: Date.now(),
            language: 'english',
        };

        setIsTestComplete(true);
        completeTest(result);
        addTestResult(result);
        trackTestComplete(result);
    }, [
        wpm,
        accuracy,
        totalChars,
        correctChars,
        incorrectChars,
        extraChars,
        mode,
        modeValue,
        isTestComplete,
        completeTest,
        addTestResult,
    ]);

    const reset = useCallback(() => {
        setCurrentWordIndex(0);
        setCurrentCharIndex(0);
        setInput('');
        setCorrectChars(0);
        setIncorrectChars(0);
        setExtraChars(0);
        setIsTestComplete(false);
        startTimeRef.current = null;
        setStatus('ready');

        // Reset words
        const resetWords = words.map((word, index) => ({
            ...word,
            characters: word.value.split('').map((char) => ({
                value: char,
                status: 'pending' as const,
            })),
            isActive: index === 0,
            isCompleted: false,
        }));
        setWords(resetWords);
    }, [words, setStatus]);

    return [
        {
            words,
            currentWordIndex,
            currentCharIndex,
            input,
            correctChars,
            incorrectChars,
            extraChars,
            isTestComplete,
            wpm,
            accuracy,
        },
        {
            handleKeyPress,
            handleBackspace: handleBackspace,
            reset,
        },
    ];
}
