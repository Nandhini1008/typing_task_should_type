/**
 * Calculate Words Per Minute (WPM)
 * Standard: 5 characters = 1 word
 * @param characters - Number of characters typed
 * @param timeInSeconds - Time elapsed in seconds
 * @returns WPM (rounded to 2 decimal places)
 */
export function calculateWPM(
    characters: number,
    timeInSeconds: number
): number {
    if (timeInSeconds === 0) return 0;

    const minutes = timeInSeconds / 60;
    const words = characters / 5;
    const wpm = words / minutes;

    return Math.round(wpm * 100) / 100;
}

/**
 * Calculate Raw WPM (includes errors)
 * @param totalCharacters - Total characters typed (including incorrect)
 * @param timeInSeconds - Time elapsed in seconds
 * @returns Raw WPM (rounded to 2 decimal places)
 */
export function calculateRawWPM(
    totalCharacters: number,
    timeInSeconds: number
): number {
    return calculateWPM(totalCharacters, timeInSeconds);
}
