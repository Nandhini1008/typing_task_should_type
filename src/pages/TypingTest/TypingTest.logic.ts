import { useState, useEffect, useRef } from 'react';
import type { Word } from '@/types/Word';
import { generateTestWords } from '@/utils/generateTestWords';
import { loadWordlist } from '@/services/wordlist.service';
import { useMetrics } from '@/hooks/useMetrics';
import { ttsService } from '@/services/tts.service';

export interface TypingTestState {
    words: Word[];
    currentWordIndex: number;
    currentCharIndex: number;
    correctChars: number;
    incorrectChars: number;
    extraChars: number;
    isTestComplete: boolean;
    wpm: number;
    accuracy: number;
    showWordSuggestion: boolean;
    suggestedWord: string;
}

export interface TypingTestActions {
    handleKeyPress: (key: string) => void;
    handleBackspace: () => void;
    handleSpace: () => void;
    completeTest: () => void;
    reset: () => void;
    hideSuggestion: () => void;
}

export function useTypingTest(
    wordCount: number
): {
    state: TypingTestState;
    actions: TypingTestActions;
    isLoading: boolean;
    error: string | null;
} {
    const [words, setWords] = useState<Word[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [correctChars, setCorrectChars] = useState(0);
    const [incorrectChars, setIncorrectChars] = useState(0);
    const [extraChars, setExtraChars] = useState(0);
    const [isTestComplete, setIsTestComplete] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showWordSuggestion, setShowWordSuggestion] = useState(false);
    const [suggestedWord, setSuggestedWord] = useState('');
    const errorCountRef = useRef(0);
    const lastErrorWordRef = useRef('');

    const metrics = useMetrics(correctChars, incorrectChars, startTime);

    // Load words on mount
    useEffect(() => {
        async function loadWords() {
            try {
                setIsLoading(true);
                setError(null);
                let generatedWords: string[];

                // Fetch configuration from backend API (or use default)
                const { configService } = await import('@/services/config.service');
                const config = await configService.getConfig();
                const { wordCount: configWordCount, complexity } = config;

                try {
                    // Always try to generate with Gemini first
                    const { geminiService } = await import('@/services/gemini.service');
                    generatedWords = await geminiService.generateSentences({
                        wordCount: configWordCount || wordCount,
                        complexity: complexity as 'easy' | 'medium' | 'hard',
                    });
                    console.log('Generated sentence:', geminiService.getLastGeneratedSentence());
                } catch (llmError) {
                    console.warn('Failed to generate with LLM, falling back to wordlist:', llmError);
                    // Fallback to static wordlist
                    const wordlist = await loadWordlist('english_1k');
                    generatedWords = generateTestWords(wordlist, wordCount);
                }

                const initialWords: Word[] = generatedWords.map((word, index) => ({
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
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load words');
                setIsLoading(false);
            }
        }

        loadWords();
    }, [wordCount]);


    const handleKeyPress = (key: string) => {
        if (!startTime) {
            setStartTime(Date.now());
        }

        if (isTestComplete || words.length === 0) return;

        const currentWord = words[currentWordIndex];
        if (!currentWord) return;

        const updatedWords = [...words];
        const wordChars = currentWord.characters;

        if (currentCharIndex < wordChars.length) {
            const char = wordChars[currentCharIndex]!;
            const isCorrect = char.value === key;

            if (isCorrect) {
                char.status = 'correct';
                setCorrectChars((prev) => prev + 1);

                // Check if the word was previously wrong and now corrected
                // If user is correcting after seeing the suggestion, stop audio
                if (errorCountRef.current >= 1 && showWordSuggestion) {
                    // Check if the entire word is now correct
                    const isWordFullyCorrect = wordChars
                        .slice(0, currentCharIndex + 1)
                        .every((c) => c.status === 'correct');

                    if (isWordFullyCorrect && currentCharIndex === wordChars.length - 1) {
                        // Stop audio - word has been corrected!
                        ttsService.cancel();
                        setShowWordSuggestion(false);
                        errorCountRef.current = 0;
                    }
                }
            } else {
                char.status = 'incorrect';
                setIncorrectChars((prev) => prev + 1);

                // Track errors for current word
                if (lastErrorWordRef.current !== currentWord.value) {
                    // New word - reset error count
                    errorCountRef.current = 1;
                    lastErrorWordRef.current = currentWord.value;
                } else {
                    // Same word - increment error count
                    errorCountRef.current += 1;
                }

                // Show suggestion after 1 error in current word
                if (errorCountRef.current >= 1) {
                    setShowWordSuggestion(true);
                    setSuggestedWord(currentWord.value);

                    // Announce the correct word with audio (delayed slightly to avoid overlap)
                    setTimeout(() => {
                        console.log('Playing audio for word:', currentWord.value);
                        ttsService.announceCorrectWord(currentWord.value);
                    }, 100);
                }
            }
            setCurrentCharIndex(currentCharIndex + 1);
        } else {
            // Extra character
            const extraChar = {
                value: key,
                status: 'extra' as const,
            };
            wordChars.push(extraChar);
            setExtraChars((prev) => prev + 1);
            setCurrentCharIndex(currentCharIndex + 1);
        }

        updatedWords[currentWordIndex] = currentWord;
        setWords(updatedWords);
    };

    const handleBackspace = () => {
        if (currentCharIndex === 0) return;

        const updatedWords = [...words];
        const currentWord = updatedWords[currentWordIndex]!;
        const newCharIndex = currentCharIndex - 1;
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
        setWords(updatedWords);
    };

    const handleSpace = () => {
        if (!startTime) {
            setStartTime(Date.now());
        }

        const currentWord = words[currentWordIndex];
        if (!currentWord) return;

        // Check if the current word is typed correctly
        const isWordCorrect = currentWord.characters.every((char, idx) => {
            // Check if character exists and is correct
            if (idx < currentWord.value.length) {
                return char.status === 'correct';
            }
            return false;
        });

        // Check if there are extra characters
        const hasExtraChars = currentWord.characters.length > currentWord.value.length;

        // Prevent moving to next word if there are errors or extra characters
        if (!isWordCorrect || hasExtraChars || currentCharIndex < currentWord.value.length) {
            // Don't allow progression - user must fix the word first
            return;
        }

        // Stop audio when space is pressed
        ttsService.cancel();

        // Clear spoken letters tracking for the completed word
        if (words[currentWordIndex]) {
            ttsService.clearWordTracking(words[currentWordIndex]!.value);
        }

        // Hide suggestion when moving to next word
        setShowWordSuggestion(false);
        errorCountRef.current = 0;
        lastErrorWordRef.current = '';

        const updatedWords = [...words];
        if (currentWordIndex < words.length - 1) {
            updatedWords[currentWordIndex]!.isActive = false;
            updatedWords[currentWordIndex]!.isCompleted = true;
            updatedWords[currentWordIndex + 1]!.isActive = true;

            setWords(updatedWords);
            setCurrentWordIndex(currentWordIndex + 1);
            setCurrentCharIndex(0);

            // Check if test is complete (all words typed)
            if (currentWordIndex + 1 >= wordCount) {
                completeTest();
            }
        } else {
            completeTest();
        }
    };

    const completeTest = () => {
        setIsTestComplete(true);
    };

    const reset = () => {
        setCurrentWordIndex(0);
        setCurrentCharIndex(0);
        setCorrectChars(0);
        setIncorrectChars(0);
        setExtraChars(0);
        setIsTestComplete(false);
        setStartTime(null);

        // Cancel any ongoing audio and clear all tracking
        ttsService.cancel();
        ttsService.clearAllTracking();

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
    };

    const hideSuggestion = () => {
        setShowWordSuggestion(false);
    };

    return {
        state: {
            words,
            currentWordIndex,
            currentCharIndex,
            correctChars,
            incorrectChars,
            extraChars,
            isTestComplete,
            wpm: metrics.wpm,
            accuracy: metrics.accuracy,
            showWordSuggestion,
            suggestedWord,
        },
        actions: {
            handleKeyPress,
            handleBackspace,
            handleSpace,
            completeTest,
            reset,
            hideSuggestion,
        },
        isLoading,
        error,
    };
}
