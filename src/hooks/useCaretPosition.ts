/**
 * Hook for managing caret position
 */
import { useState, useEffect, useRef, RefObject } from 'react';

export interface CaretPosition {
    left: number;
    top: number;
}

export function useCaretPosition(
    currentWordIndex: number,
    currentCharIndex: number,
    containerRef: RefObject<HTMLDivElement>
): CaretPosition {
    const [position, setPosition] = useState<CaretPosition>({ left: 0, top: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const updateCaretPosition = () => {
            const currentWordElement = containerRef.current?.querySelector(
                `[data-word-index="${currentWordIndex}"]`
            );

            if (!currentWordElement) {
                setPosition({ left: 0, top: 0 });
                return;
            }

            const currentCharElement = currentWordElement.querySelector(
                `[data-char-index="${currentCharIndex}"]`
            );

            if (currentCharElement) {
                const charRect = currentCharElement.getBoundingClientRect();
                const containerRect = containerRef.current!.getBoundingClientRect();

                setPosition({
                    left: charRect.left - containerRect.left,
                    top: charRect.top - containerRect.top,
                });
            } else {
                // Position at end of word (for space)
                const wordRect = currentWordElement.getBoundingClientRect();
                const containerRect = containerRef.current!.getBoundingClientRect();

                setPosition({
                    left: wordRect.right - containerRect.left,
                    top: wordRect.top - containerRect.top,
                });
            }
        };

        updateCaretPosition();

        // Update on window resize
        window.addEventListener('resize', updateCaretPosition);
        return () => window.removeEventListener('resize', updateCaretPosition);
    }, [currentWordIndex, currentCharIndex, containerRef]);

    return position;
}
