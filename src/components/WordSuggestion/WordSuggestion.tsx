import React from 'react';
import './WordSuggestion.scss';

export interface WordSuggestionProps {
  word: string;
  onClose: () => void;
}

export const WordSuggestion: React.FC<WordSuggestionProps> = ({ word, onClose }) => {
  return (
    <div className="word-suggestion">
      <div className="word-suggestion__content">
        <span className="word-suggestion__label">Correct word:</span>
        <span className="word-suggestion__word">{word}</span>
      </div>
      <button className="word-suggestion__close" onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  );
};
