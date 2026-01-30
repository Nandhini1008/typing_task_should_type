// Settings type definitions
export type TestMode = 'time' | 'words' | 'quote';
export type ComplexityLevel = 'easy' | 'medium' | 'hard';

export type ThemeMode = 'dark' | 'light';

export type KeyboardLayout = 'qwerty' | 'dvorak' | 'colemak';

export interface TestSettings {
    mode: TestMode;
    timeLimit: number; // seconds for time mode
    wordCount: number; // word count for words mode
    punctuation: boolean;
    numbers: boolean;
    useLLM: boolean; // Use Gemini LLM for sentence generation
    complexity: ComplexityLevel; // Difficulty level for LLM generation
}

export interface ThemeSettings {
    currentTheme: string;
    mode: ThemeMode;
    customTheme?: {
        background: string;
        text: string;
        primary: string;
        secondary: string;
        error: string;
        correct: string;
    };
}

export interface KeyboardSettings {
    layout: KeyboardLayout;
    showKeyboard: boolean;
}

export interface SoundSettings {
    enabled: boolean;
    errorSound: boolean;
    clickSound: boolean;
    volume: number;
}

export interface AccessibilitySettings {
    focusMode: boolean;
    smoothCaret: boolean;
    caretStyle: 'block' | 'line' | 'underline';
    fontSize: number;
    confidenceMode: 'off' | 'on' | 'max';
}

export interface Settings {
    test: TestSettings;
    theme: ThemeSettings;
    keyboard: KeyboardSettings;
    sound: SoundSettings;
    accessibility: AccessibilitySettings;
}

export const defaultSettings: Settings = {
    test: {
        mode: 'words',
        timeLimit: 30,
        wordCount: 25,
        punctuation: false,
        numbers: false,
        useLLM: false,
        complexity: 'medium',
    },
    theme: {
        currentTheme: 'dark-default',
        mode: 'dark',
    },
    keyboard: {
        layout: 'qwerty',
        showKeyboard: false,
    },
    sound: {
        enabled: false,
        errorSound: true,
        clickSound: false,
        volume: 0.5,
    },
    accessibility: {
        focusMode: false,
        smoothCaret: true,
        caretStyle: 'line',
        fontSize: 16,
        confidenceMode: 'off',
    },
};
