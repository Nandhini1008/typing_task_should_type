/**
 * Service for loading and managing wordlists
 */

export interface WordlistMetadata {
    name: string;
    language: string;
    wordCount: number;
    path: string;
}

const WORDLISTS: Record<string, WordlistMetadata> = {
    english_1k: {
        name: 'English 1K',
        language: 'english',
        wordCount: 1000,
        path: '/wordlists/english_1k.json',
    },
    english_5k: {
        name: 'English 5K',
        language: 'english',
        wordCount: 5000,
        path: '/wordlists/english_5k.json',
    },
    custom: {
        name: 'Custom Words',
        language: 'custom',
        wordCount: 0,
        path: '/wordlists/custom_words.json',
    },
};

// Cache loaded wordlists
const wordlistCache = new Map<string, string[]>();

/**
 * Load wordlist from JSON file
 */
export async function loadWordlist(listId: string): Promise<string[]> {
    // Check cache first
    if (wordlistCache.has(listId)) {
        return wordlistCache.get(listId)!;
    }

    const metadata = WORDLISTS[listId];
    if (!metadata) {
        throw new Error(`Wordlist "${listId}" not found`);
    }

    try {
        const response = await fetch(metadata.path);
        if (!response.ok) {
            throw new Error(`Failed to load wordlist: ${response.statusText}`);
        }

        const data = await response.json();
        const words = Array.isArray(data) ? data : data.words || [];

        // Cache the wordlist
        wordlistCache.set(listId, words);

        return words;
    } catch (error) {
        console.error(`Error loading wordlist "${listId}":`, error);
        throw error;
    }
}

/**
 * Get all available wordlists
 */
export function getAvailableWordlists(): WordlistMetadata[] {
    return Object.values(WORDLISTS);
}

/**
 * Get wordlist metadata
 */
export function getWordlistMetadata(listId: string): WordlistMetadata | null {
    return WORDLISTS[listId] ?? null;
}
