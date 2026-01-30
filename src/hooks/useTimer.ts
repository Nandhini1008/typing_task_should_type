/**
 * Timer hook for time-based tests
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export interface TimerState {
    timeRemaining: number;
    isRunning: boolean;
    isComplete: boolean;
}

export interface TimerActions {
    start: () => void;
    pause: () => void;
    reset: () => void;
}

export function useTimer(
    initialTime: number,
    onComplete?: () => void
): [TimerState, TimerActions] {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onCompleteRef = useRef(onComplete);

    // Update onComplete ref when it changes
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    // Timer countdown logic
    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0.1) {
                    // Test complete
                    setIsRunning(false);
                    setIsComplete(true);
                    if (onCompleteRef.current) {
                        onCompleteRef.current();
                    }
                    return 0;
                }
                return prev - 0.1; // Decrement by 100ms for smooth countdown
            });
        }, 100);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const start = useCallback(() => {
        if (!isComplete) {
            setIsRunning(true);
        }
    }, [isComplete]);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setIsComplete(false);
        setTimeRemaining(initialTime);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [initialTime]);

    return [
        {
            timeRemaining,
            isRunning,
            isComplete,
        },
        {
            start,
            pause,
            reset,
        },
    ];
}
