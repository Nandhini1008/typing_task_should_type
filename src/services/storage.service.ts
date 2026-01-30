/**
 * LocalStorage service with type safety
 */

const STORAGE_PREFIX = 'typing-platform-';

export const StorageKeys = {
    SETTINGS: `${STORAGE_PREFIX}settings`,
    TEST_HISTORY: `${STORAGE_PREFIX}test-history`,
    PERSONAL_BESTS: `${STORAGE_PREFIX}personal-bests`,
} as const;

/**
 * Save data to localStorage
 */
export function saveToStorage<T>(key: string, data: T): void {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(key, serialized);
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
    }
}

/**
 * Load data from localStorage
 */
export function loadFromStorage<T>(key: string): T | null {
    try {
        const serialized = localStorage.getItem(key);
        if (!serialized) return null;

        return JSON.parse(serialized) as T;
    } catch (error) {
        console.error(`Error loading from localStorage (${key}):`, error);
        return null;
    }
}

/**
 * Remove data from localStorage
 */
export function removeFromStorage(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
    }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllStorage(): void {
    try {
        Object.values(StorageKeys).forEach((key) => {
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}
