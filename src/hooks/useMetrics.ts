/**
 * Hook for real-time metrics calculation
 */
import { useState, useEffect } from 'react';
import { calculateWPM } from '@/utils/calculateWPM';
import { calculateAccuracy } from '@/utils/calculateAccuracy';
import type { Metrics } from '@/types/Metrics';

export function useMetrics(
    correctChars: number,
    incorrectChars: number,
    startTime: number | null
): Metrics {
    const [metrics, setMetrics] = useState<Metrics>({
        wpm: 0,
        rawWpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        elapsedTime: 0,
    });

    useEffect(() => {
        if (!startTime) {
            setMetrics({
                wpm: 0,
                rawWpm: 0,
                accuracy: 100,
                correctChars: 0,
                incorrectChars: 0,
                totalChars: 0,
                elapsedTime: 0,
            });
            return;
        }

        const updateMetrics = () => {
            const elapsedTime = (Date.now() - startTime) / 1000;
            const totalChars = correctChars + incorrectChars;

            setMetrics({
                wpm: calculateWPM(correctChars, elapsedTime),
                rawWpm: calculateWPM(totalChars, elapsedTime),
                accuracy: calculateAccuracy(correctChars, totalChars),
                correctChars,
                incorrectChars,
                totalChars,
                elapsedTime,
            });
        };

        // Update metrics every 100ms
        const interval = setInterval(updateMetrics, 100);

        return () => clearInterval(interval);
    }, [correctChars, incorrectChars, startTime]);

    return metrics;
}
