import React, { useRef, useEffect, useState } from 'react';
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
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const caretPosition = useCaretPosition(
    currentWordIndex,
    currentCharIndex,
    containerRef
  );

  // Detect if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Handle mobile input
  useEffect(() => {
    if (!isMobile || !mobileInputRef.current) return;

    const input = mobileInputRef.current;
    let lastValue = '';

    const handleInput = (e: Event) => {
      if (!isActive) return;
      
      const target = e.target as HTMLInputElement;
      const newValue = target.value;

      if (newValue.length > lastValue.length) {
        // Character added
        const addedChar = newValue[newValue.length - 1];
        if (addedChar) {
          if (addedChar === ' ') {
            onSpace();
          } else {
            onKeyPress(addedChar);
          }
        }
      } else if (newValue.length < lastValue.length) {
        // Character deleted
        onBackspace();
      }

      lastValue = newValue;
      // Keep input empty to allow continuous typing
      target.value = '';
      lastValue = '';
    };

    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, [isMobile, isActive, onKeyPress, onBackspace, onSpace]);

  // Handle desktop keyboard events
  useEffect(() => {
    if (isMobile) return; // Skip on mobile

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
  }, [isMobile, isActive, onKeyPress, onBackspace, onSpace]);

  // Focus handler
  const handleFocus = () => {
    if (isMobile && mobileInputRef.current) {
      mobileInputRef.current.focus();
    } else if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    if (isActive) {
      handleFocus();
    }
  }, [isActive, isMobile]);

  return (
    <div
      className="typing-area"
      ref={containerRef}
      tabIndex={isMobile ? -1 : 0}
      role="textbox"
      aria-label="Typing test area"
      onClick={handleFocus}
    >
      {/* Hidden input for mobile keyboard */}
      {isMobile && (
        <input
          ref={mobileInputRef}
          type="text"
          className="typing-area__mobile-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-hidden="true"
        />
      )}
      
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
