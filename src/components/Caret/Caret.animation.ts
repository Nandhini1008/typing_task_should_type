/**
 * Caret animation utilities
 */

export const getCaretAnimationDuration = (smoothCaret: boolean): number => {
    return smoothCaret ? 100 : 0; // milliseconds
};

export const getCaretEasing = (): string => {
    return 'ease-out';
};
