// Real-time metrics types
export interface Metrics {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    elapsedTime: number; // in seconds
}

export interface MetricsHistory {
    timestamp: number;
    wpm: number;
    rawWpm: number;
    accuracy: number;
}
