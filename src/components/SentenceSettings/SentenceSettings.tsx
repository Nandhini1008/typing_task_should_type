import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { geminiService } from '@/services/gemini.service';
import './SentenceSettings.scss';

export const SentenceSettings: React.FC = () => {
  const { useLLM, complexity, wordCount, setUseLLM, setComplexity, setWordCount } = useSettings();

  const complexityOptions = [
    { value: 'easy' as const, label: 'Easy', description: 'Simple everyday words' },
    { value: 'medium' as const, label: 'Medium', description: 'Moderate vocabulary' },
    { value: 'hard' as const, label: 'Hard', description: 'Advanced terms' },
  ];

  const isConfigured = geminiService.isConfigured();

  return (
    <div className="sentence-settings">
      <h3 className="sentence-settings__title">Sentence Generation</h3>

      {/* LLM Toggle */}
      <div className="sentence-settings__row">
        <label className="sentence-settings__label">
          <input
            type="checkbox"
            checked={useLLM}
            onChange={(e) => setUseLLM(e.target.checked)}
            disabled={!isConfigured}
          />
          <span>Use AI Sentence Generation</span>
        </label>
        {!isConfigured && (
          <span className="sentence-settings__warning">
            API key not configured
          </span>
        )}
      </div>

      {/* Complexity Selector */}
      {useLLM && isConfigured && (
        <>
          <div className="sentence-settings__row">
            <span className="sentence-settings__label">Complexity:</span>
            <div className="sentence-settings__complexity">
              {complexityOptions.map((option) => (
                <button
                  key={option.value}
                  className={`sentence-settings__complexity-btn ${
                    complexity === option.value ? 'sentence-settings__complexity-btn--active' : ''
                  }`}
                  onClick={() => setComplexity(option.value)}
                  title={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Word Count */}
          <div className="sentence-settings__row">
            <label className="sentence-settings__label">
              Word Count: {wordCount}
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              className="sentence-settings__slider"
            />
          </div>
        </>
      )}
    </div>
  );
};
