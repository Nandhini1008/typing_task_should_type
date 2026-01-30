// Word and character state tracking types
export type CharacterStatus = 'pending' | 'correct' | 'incorrect' | 'extra';

export interface Character {
    value: string;
    status: CharacterStatus;
}

export interface Word {
    id: string;
    value: string;
    characters: Character[];
    isActive: boolean;
    isCompleted: boolean;
}

export interface TypingState {
    words: Word[];
    currentWordIndex: number;
    currentCharIndex: number;
    input: string;
    errorCount: number;
}
