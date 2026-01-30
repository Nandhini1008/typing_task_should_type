/**
 * Calculate typing accuracy percentage
 * @param correctChars - Number of correct characters
 * @param totalChars - Total characters typed
 * @returns Accuracy percentage (0-100, rounded to 2 decimal places)
 */
export function calculateAccuracy(
    correctChars: number,
    totalChars: number
): number {
    if (totalChars === 0) return 100;

    const accuracy = (correctChars / totalChars) * 100;
    return Math.round(accuracy * 100) / 100;
}
