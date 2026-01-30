/**
 * Settings store using Zustand
 */
import { create } from 'zustand';
import type { Settings } from '@/types/Settings';
import { defaultSettings } from '@/types/Settings';
import {
    loadFromStorage,
    saveToStorage,
    StorageKeys,
} from '@/services/storage.service';
import { trackSettingsChange } from '@/services/analytics.service';

interface SettingsStore extends Settings {
    // Actions
    setTestMode: (mode: Settings['test']['mode']) => void;
    setTimeLimit: (timeLimit: number) => void;
    setWordCount: (wordCount: number) => void;
    setPunctuation: (enabled: boolean) => void;
    setNumbers: (enabled: boolean) => void;
    setUseLLM: (enabled: boolean) => void;
    setComplexity: (complexity: Settings['test']['complexity']) => void;
    setTheme: (themeId: string) => void;
    setThemeMode: (mode: 'dark' | 'light') => void;
    setKeyboardLayout: (layout: Settings['keyboard']['layout']) => void;
    setShowKeyboard: (show: boolean) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setFocusMode: (enabled: boolean) => void;
    setSmoothCaret: (enabled: boolean) => void;
    setCaretStyle: (style: Settings['accessibility']['caretStyle']) => void;
    setFontSize: (size: number) => void;
    resetSettings: () => void;
    loadSettings: () => void;
}

// Load initial settings from localStorage
const loadedSettings = loadFromStorage<Settings>(StorageKeys.SETTINGS);
const initialSettings = loadedSettings || defaultSettings;

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    ...initialSettings,

    setTestMode: (mode) => {
        set((state) => ({
            test: { ...state.test, mode },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('testMode', mode);
    },

    setTimeLimit: (timeLimit) => {
        set((state) => ({
            test: { ...state.test, timeLimit },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('timeLimit', timeLimit);
    },

    setWordCount: (wordCount) => {
        set((state) => ({
            test: { ...state.test, wordCount },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('wordCount', wordCount);
    },

    setPunctuation: (enabled) => {
        set((state) => ({
            test: { ...state.test, punctuation: enabled },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('punctuation', enabled);
    },

    setNumbers: (enabled) => {
        set((state) => ({
            test: { ...state.test, numbers: enabled },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('numbers', enabled);
    },

    setUseLLM: (enabled) => {
        set((state) => ({
            test: { ...state.test, useLLM: enabled },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('useLLM', enabled);
    },

    setComplexity: (complexity) => {
        set((state) => ({
            test: { ...state.test, complexity },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('complexity', complexity);
    },

    setTheme: (themeId) => {
        set((state) => ({
            theme: { ...state.theme, currentTheme: themeId },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('theme', themeId);
    },

    setThemeMode: (mode) => {
        set((state) => ({
            theme: { ...state.theme, mode },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('themeMode', mode);
    },

    setKeyboardLayout: (layout) => {
        set((state) => ({
            keyboard: { ...state.keyboard, layout },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('keyboardLayout', layout);
    },

    setShowKeyboard: (show) => {
        set((state) => ({
            keyboard: { ...state.keyboard, showKeyboard: show },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('showKeyboard', show);
    },

    setSoundEnabled: (enabled) => {
        set((state) => ({
            sound: { ...state.sound, enabled },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('soundEnabled', enabled);
    },

    setFocusMode: (enabled) => {
        set((state) => ({
            accessibility: { ...state.accessibility, focusMode: enabled },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('focusMode', enabled);
    },

    setSmoothCaret: (enabled) => {
        set((state) => ({
            accessibility: { ...state.accessibility, smoothCaret: enabled },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('smoothCaret', enabled);
    },

    setCaretStyle: (style) => {
        set((state) => ({
            accessibility: { ...state.accessibility, caretStyle: style },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('caretStyle', style);
    },

    setFontSize: (size) => {
        set((state) => ({
            accessibility: { ...state.accessibility, fontSize: size },
        }));
        saveToStorage(StorageKeys.SETTINGS, get());
        trackSettingsChange('fontSize', size);
    },

    resetSettings: () => {
        set(defaultSettings);
        saveToStorage(StorageKeys.SETTINGS, defaultSettings);
        trackSettingsChange('reset', true);
    },

    loadSettings: () => {
        const loaded = loadFromStorage<Settings>(StorageKeys.SETTINGS);
        if (loaded) {
            set(loaded);
        }
    },
}));
