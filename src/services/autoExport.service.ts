/**
 * Auto Export Service
 * Automatically exports sentence results after each completion
 * Each sentence gets its own independent result
 */

export interface SentenceResult {
    expected_sentence: string;
    user_typed_sentence: string;
    has_errors: boolean;
    error_count: number;
    timestamp: string;
    test_id: string;
}

class AutoExportService {
    private callback: ((result: SentenceResult) => void) | null = null;

    /**
     * Register callback for when sentence is completed
     * This will be called AUTOMATICALLY after each sentence
     */
    setExportCallback(callback: (result: SentenceResult) => void) {
        this.callback = callback;
        console.log('✅ Auto-export callback registered');
    }

    /**
     * Called internally when sentence is completed
     */
    async exportSentenceResult() {
        const { useSentenceTrackingStore } = await import('@/store/sentenceTracking.store');
        const store = useSentenceTrackingStore.getState();

        // Get the latest attempt
        const latest = store.getLatestAttempt();

        if (!latest) {
            console.warn('⚠️ No sentence attempt found');
            return;
        }

        const result: SentenceResult = {
            expected_sentence: latest.expectedSentence,
            user_typed_sentence: latest.userTypedSentence,
            has_errors: latest.hasErrors,
            error_count: latest.errorCount,
            timestamp: new Date(latest.timestamp).toISOString(),
            test_id: latest.testId
        };

        // Log to console
        console.log('📊 Sentence Result:', result);

        // Call callback if registered (for Flutter integration)
        if (this.callback) {
            this.callback(result);
        }

        // Also make available globally for Flutter WebView
        if (typeof window !== 'undefined') {
            (window as any).latestSentenceResult = result;

            // Dispatch event for Flutter to listen
            window.dispatchEvent(new CustomEvent('sentenceComplete', {
                detail: result
            }));
        }

        return result;
    }

    /**
     * Download result as JSON file (optional)
     */
    downloadResult(result: SentenceResult) {
        const jsonString = JSON.stringify(result, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `sentence-result-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Get latest result (for Flutter to call)
     */
    getLatestResult(): SentenceResult | null {
        if (typeof window !== 'undefined') {
            return (window as any).latestSentenceResult || null;
        }
        return null;
    }
}

export const autoExportService = new AutoExportService();
