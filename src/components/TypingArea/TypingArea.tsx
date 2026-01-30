import React, { useRef, useEffect } from 'react';
import type { Word } from '@/types/Word';
import { Caret } from '@/components/Caret/Caret';
import { useCaretPosition } from '@/hooks/useCaretPosition';
import './TypingArea.styles.scss';

export interface TypingAreaProps {
  words: Word[];
  currentWordIndex: number;
  currentCharIndex: number;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  isActive: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  currentWordIndex,
  currentCharIndex,
  onKeyPress,
  onBackspace,
  onSpace,
  isActive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const caretPosition = useCaretPosition(
    currentWordIndex,
    currentCharIndex,
    containerRef
  );

  // Focus input on mount and handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      // Prevent default for most keys
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
        e.preventDefault();
      }

      if (e.key === 'Backspace') {
        onBackspace();
      } else if (e.key === ' ') {
        onSpace();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        onKeyPress(e.key);
      }
    };

    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onKeyPress, onBackspace, onSpace]);

  // Auto-focus on mount
  useEffect(() => {
    if (containerRef.current && isActive) {
      containerRef.current.focus();
    }
  }, [isActive]);

  return (
    <div
      className="typing-area"
      ref={containerRef}
      tabIndex={0}
      role="textbox"
      aria-label="Typing test area"
    >
      <div className="typing-area__words">
        {words.map((word, wordIndex) => (
          <div
            key={word.id}
            className={`typing-area__word ${word.isActive ? 'typing-area__word--active' : ''} ${word.isCompleted ? 'typing-area__word--completed' : ''}`}
            data-word-index={wordIndex}
          >
            {word.characters.map((char, charIndex) => (
              <span
                key={`${word.id}-${charIndex}`}
                className={`typing-area__char typing-area__char--${char.status}`}
                data-char-index={charIndex}
              >
                {char.value}
              </span>
            ))}
          </div>
        ))}
      </div>
      <Caret position={caretPosition} isActive={isActive} />
    </div>
  );
};
