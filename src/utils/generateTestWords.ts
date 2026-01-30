/**
 * Generate random words for typing test
 * @param wordList - Array of available words
 * @param count - Number of words to generate
 * @param options - Generation options (punctuation, numbers)
 * @returns Array of words
 */
export interface GenerateWordsOptions {
    punctuation?: boolean;
    numbers?: boolean;
}

const PUNCTUATION_CHARS = ['.', ',', '!', '?', ';', ':'];
const PUNCTUATION_FREQUENCY = 0.1; // 10% chance

export function generateTestWords(
    wordList: string[],
    count: number,
    options: GenerateWordsOptions = {}
): string[] {
    const { punctuation = false, numbers = false } = options;
    const words: string[] = [];

    for (let i = 0; i < count; i++) {
        let word = wordList[Math.floor(Math.random() * wordList.length)];

        // Add numbers occasionally if enabled
        if (numbers && Math.random() < 0.1) {
            word = Math.floor(Math.random() * 1000).toString();
        }

        // Add punctuation if enabled
        if (punctuation && Math.random() < PUNCTUATION_FREQUENCY) {
            const punctChar =
                PUNCTUATION_CHARS[
                Math.floor(Math.random() * PUNCTUATION_CHARS.length)
                ];
            word += punctChar;
        }

        words.push(word);
    }

    return words;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
}
