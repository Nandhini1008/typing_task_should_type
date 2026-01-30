// Test mode configurations
import type { TestMode } from '@/types/Settings';

export interface ModeConfig {
    id: string;
    name: string;
    type: TestMode;
    value: number;
    label: string;
}

export const TIME_MODES: ModeConfig[] = [
    { id: 'time-15', name: '15s', type: 'time', value: 15, label: '15 seconds' },
    { id: 'time-30', name: '30s', type: 'time', value: 30, label: '30 seconds' },
    { id: 'time-60', name: '60s', type: 'time', value: 60, label: '60 seconds' },
    {
        id: 'time-120',
        name: '120s',
        type: 'time',
        value: 120,
        label: '120 seconds',
    },
];

export const WORD_MODES: ModeConfig[] = [
    { id: 'words-10', name: '10', type: 'words', value: 10, label: '10 words' },
    { id: 'words-25', name: '25', type: 'words', value: 25, label: '25 words' },
    { id: 'words-50', name: '50', type: 'words', value: 50, label: '50 words' },
    {
        id: 'words-100',
        name: '100',
        type: 'words',
        value: 100,
        label: '100 words',
    },
];

export const QUOTE_MODE: ModeConfig = {
    id: 'quote',
    name: 'quote',
    type: 'quote',
    value: 1,
    label: 'Random quote',
};

export const ALL_MODES = {
    time: TIME_MODES,
    words: WORD_MODES,
    quote: [QUOTE_MODE],
};
