/**
 * Hook for settings management (wrapper around settings store)
 */
import { useSettingsStore } from '@/store/settings.store';

export function useSettings() {
    const settings = useSettingsStore();

    return {
        // State
        settings,

        // Test settings
        testMode: settings.test.mode,
        timeLimit: settings.test.timeLimit,
        wordCount: settings.test.wordCount,
        punctuation: settings.test.punctuation,
        numbers: settings.test.numbers,
        useLLM: settings.test.useLLM,
        complexity: settings.test.complexity,

        // Theme settings
        currentTheme: settings.theme.currentTheme,
        themeMode: settings.theme.mode,

        // Keyboard settings
        keyboardLayout: settings.keyboard.layout,
        showKeyboard: settings.keyboard.showKeyboard,

        // Sound settings
        soundEnabled: settings.sound.enabled,

        // Accessibility settings
        focusMode: settings.accessibility.focusMode,
        smoothCaret: settings.accessibility.smoothCaret,
        caretStyle: settings.accessibility.caretStyle,
        fontSize: settings.accessibility.fontSize,

        // Actions
        setTestMode: settings.setTestMode,
        setTimeLimit: settings.setTimeLimit,
        setWordCount: settings.setWordCount,
        setPunctuation: settings.setPunctuation,
        setNumbers: settings.setNumbers,
        setUseLLM: settings.setUseLLM,
        setComplexity: settings.setComplexity,
        setTheme: settings.setTheme,
        setThemeMode: settings.setThemeMode,
        setKeyboardLayout: settings.setKeyboardLayout,
        setShowKeyboard: settings.setShowKeyboard,
        setSoundEnabled: settings.setSoundEnabled,
        setFocusMode: settings.setFocusMode,
        setSmoothCaret: settings.setSmoothCaret,
        setCaretStyle: settings.setCaretStyle,
        setFontSize: settings.setFontSize,
        resetSettings: settings.resetSettings,
    };
}
