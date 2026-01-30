/**
 * Text-to-Speech service for audio feedback
 */

class TextToSpeechService {
    private synth: SpeechSynthesis | null = null;
    private enabled: boolean = false;
    private currentAbortController: AbortController | null = null;
    private spokenLettersMap: Map<string, Set<string>> = new Map(); // Track spoken letters per word

    constructor() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
        }
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    isEnabled(): boolean {
        return this.enabled && this.synth !== null;
    }

    /**
     * Speak a word
     */
    speakWord(word: string, rate: number = 1.0) {
        if (!this.isEnabled() || !this.synth) return;

        // Cancel any ongoing speech
        this.cancel();

        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = rate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        this.synth.speak(utterance);
    }

    /**
     * Spell a word letter by letter (ensure each letter is spoken only once)
     */
    async spellWord(word: string, delayMs: number = 50) {
        if (!this.isEnabled() || !this.synth) return;

        this.cancel();
        this.currentAbortController = new AbortController();
        const signal = this.currentAbortController.signal;

        // Initialize tracking for this word if not already done
        if (!this.spokenLettersMap.has(word)) {
            this.spokenLettersMap.set(word, new Set());
        }
        const spokenLetters = this.spokenLettersMap.get(word)!;

        try {
            // First say "Spell:"
            if (signal.aborted) return;
            await this.speakAndWait('Spell', 1.3, signal);

            if (signal.aborted) return;
            await this.wait(50, signal);

            // Then spell each letter (only once)
            for (let i = 0; i < word.length; i++) {
                if (signal.aborted) return;

                const letter = word.charAt(i);
                // Only speak the letter if it hasn't been spoken before for this word
                if (letter && !spokenLetters.has(letter)) {
                    await this.speakAndWait(letter, 1.5, signal);
                    spokenLetters.add(letter);

                    if (i < word.length - 1) {
                        if (signal.aborted) return;
                        await this.wait(delayMs, signal);
                    }
                }
            }
        } catch (error) {
            // Aborted - stop gracefully
            return;
        } finally {
            this.currentAbortController = null;
        }
    }

    /**
     * Say the correct word with spelling
     */
    async announceCorrectWord(word: string) {
        if (!this.isEnabled()) return;

        this.cancel();
        this.currentAbortController = new AbortController();
        const signal = this.currentAbortController.signal;

        try {
            // Say "The correct word is: [word]"
            if (signal.aborted) return;
            await this.speakAndWait(`The correct word is ${word}`, 1.3, signal);

            if (signal.aborted) return;
            await this.wait(100, signal);

            // Spell it
            if (signal.aborted) return;
            await this.spellWord(word);
        } catch (error) {
            // Aborted - stop gracefully
            return;
        } finally {
            this.currentAbortController = null;
        }
    }

    /**
     * Clear spoken letters tracking for a word
     */
    clearWordTracking(word: string) {
        this.spokenLettersMap.delete(word);
    }

    /**
     * Clear all spoken letters tracking
     */
    clearAllTracking() {
        this.spokenLettersMap.clear();
    }

    /**
     * Helper to speak and wait for completion
     */
    private speakAndWait(text: string, rate: number = 1.0, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.synth) {
                resolve();
                return;
            }

            if (signal?.aborted) {
                reject(new Error('Aborted'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            const abortHandler = () => {
                this.synth?.cancel();
                reject(new Error('Aborted'));
            };

            if (signal) {
                signal.addEventListener('abort', abortHandler, { once: true });
            }

            utterance.onend = () => {
                if (signal) {
                    signal.removeEventListener('abort', abortHandler);
                }
                resolve();
            };

            utterance.onerror = () => {
                if (signal) {
                    signal.removeEventListener('abort', abortHandler);
                }
                resolve();
            };

            this.synth.speak(utterance);
        });
    }

    /**
     * Helper to wait
     */
    private wait(ms: number, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            if (signal?.aborted) {
                reject(new Error('Aborted'));
                return;
            }

            const timeout = setTimeout(() => {
                if (signal) {
                    signal.removeEventListener('abort', abortHandler);
                }
                resolve();
            }, ms);

            const abortHandler = () => {
                clearTimeout(timeout);
                reject(new Error('Aborted'));
            };

            if (signal) {
                signal.addEventListener('abort', abortHandler, { once: true });
            }
        });
    }

    /**
     * Cancel any ongoing speech
     */
    cancel() {
        if (this.currentAbortController) {
            this.currentAbortController.abort();
            this.currentAbortController = null;
        }
        if (this.synth) {
            this.synth.cancel();
        }
    }
}

// Export singleton instance
export const ttsService = new TextToSpeechService();
