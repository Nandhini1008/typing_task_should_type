/**
 * Analytics service (client-side only, extensible for backend)
 */

import type { TestResult } from '@/types/TestResult';

export interface AnalyticsEvent {
    type: string;
    timestamp: number;
    data?: Record<string, unknown>;
}

/**
 * Track test completion
 */
export function trackTestComplete(result: TestResult): void {
    // Currently just logs to console
    // Can be extended to send to backend analytics service
    console.log('Test completed:', {
        wpm: result.wpm,
        accuracy: result.accuracy,
        mode: result.mode,
        duration: result.duration,
    });
}

/**
 * Track test start
 */
export function trackTestStart(mode: string, modeValue: number): void {
    console.log('Test started:', { mode, modeValue });
}

/**
 * Track settings change
 */
export function trackSettingsChange(setting: string, value: unknown): void {
    console.log('Settings changed:', { setting, value });
}

/**
 * Generic event tracking
 */
export function trackEvent(event: AnalyticsEvent): void {
    console.log('Event:', event);
}
