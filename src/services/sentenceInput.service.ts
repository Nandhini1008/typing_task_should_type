/**
 * Sentence Input API
 * Receives sentences from Flutter/external sources
 */

// Add this to your Flutter bridge or create an API endpoint

export interface SentenceInput {
    sentence: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    metadata?: object;
}

class SentenceInputService {
    /**
     * Set sentence from external source (Flutter)
     * Call this before user starts typing
     */
    static setSentenceFromExternal(input: SentenceInput) {
        const { useSentenceTrackingStore } = require('@/store/sentenceTracking.store');
        const store = useSentenceTrackingStore.getState();

        // Set the expected sentence
        store.setExpectedSentence(input.sentence);

        console.log('✅ Sentence set from external source:', input.sentence);

        return {
            success: true,
            sentence: input.sentence
        };
    }

    /**
     * Get the export data immediately after test
     */
    static getLatestResult() {
        const { useSentenceTrackingStore } = require('@/store/sentenceTracking.store');
        const store = useSentenceTrackingStore.getState();

        const latest = store.getLatestAttempt();

        if (!latest) {
            return null;
        }

        return {
            expected_line: latest.expectedSentence,
            user_line_without_modification: latest.userTypedSentence,
            has_errors: latest.hasErrors,
            error_count: latest.errorCount,
            timestamp: new Date(latest.timestamp).toISOString()
        };
    }
}

export default SentenceInputService;
