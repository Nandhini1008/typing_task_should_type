import React, { useState, useEffect } from 'react';
import { TypingArea } from '@/components/TypingArea/TypingArea';
import { WPM } from '@/components/Metrics/WPM';
import { Accuracy } from '@/components/Metrics/Accuracy';
import { Button } from '@/components/Common/Button';
import { WordSuggestion } from '@/components/WordSuggestion/WordSuggestion';
import { AudioControl } from '@/components/AudioControl/AudioControl';
import { ProgressTracker } from '@/components/ProgressTracker/ProgressTracker';
import { ErrorExport } from '@/components/ErrorExport/ErrorExport';
import { SentenceExport } from '@/components/SentenceExport/SentenceExport';
import { SpellCombo } from '@/components/SpellCombo/SpellCombo';
import { LevelUp } from '@/components/LevelUp/LevelUp';
import { AchievementUnlock } from '@/components/AchievementUnlock/AchievementUnlock';
import { useTypingTest } from './TypingTest.logic.ts';
import { useSettings } from '@/hooks/useSettings';
import { useGamificationStore } from '@/store/gamification.store';
import './TypingTest.styles.scss';

const ENCOURAGEMENT_MESSAGES = [
  '✨ Brilliant work, young wizard!',
  "🪄 You're casting spells perfectly!",
  '⭐ Outstanding magic!',
  '🦉 Hedwig would be proud!',
  '🎯 Spectacular spellcasting!',
  "🌟 You're a natural!",
  '🏆 House points earned!',
];

export const TypingTestPage: React.FC = () => {
  const { wordCount } = useSettings();
  const [isTestStarted, setIsTestStarted] = useState(false);
  const {
    addPoints,
    addExperience,
    recordTest,
    currentCombo,
    currentYear,
    showLevelUp,
    clearLevelUp,
    pendingAchievement,
    clearPendingAchievement,
  } = useGamificationStore();

  const { state, actions, isLoading, error } = useTypingTest(wordCount);

  const handleReset = () => {
    actions.reset();
    setIsTestStarted(false);
  };

  const handleSpace = () => {
    if (!isTestStarted) {
      setIsTestStarted(true);
    }
    actions.handleSpace();
  };

  // Award points and XP when test completes
  useEffect(() => {
    if (state.isTestComplete) {
      const perfect = state.accuracy === 100;
      const points = perfect ? 50 : Math.round(state.accuracy / 2);
      const xp = Math.round(state.wpm * 5);

      addPoints(points);
      addExperience(xp);
      recordTest(perfect, state.words.length, state.wpm);
    }
  }, [
    state.isTestComplete,
    state.accuracy,
    state.wpm,
    state.words.length,
    addPoints,
    addExperience,
    recordTest,
  ]);

  if (isLoading) {
    return (
      <div className="typing-test typing-test--magical">
        <div className="typing-test__loading">
          <div className="magical-spinner">✨</div>
          <p>Preparing your magical typing quest...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="typing-test typing-test--magical">
        <div className="typing-test__error">
          <span className="error-icon">⚠️</span>
          <p>Oops! Something went wrong: {error}</p>
          <Button onClick={handleReset}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (state.isTestComplete) {
    const perfect = state.accuracy === 100;
    const randomMessage =
      ENCOURAGEMENT_MESSAGES[
        Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
      ];

    return (
      <div className="typing-test typing-test--magical">
        <ProgressTracker />

        <div className="typing-test__celebration">
          <div className="celebration__confetti">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>

          <h1 className="celebration__title">
            {perfect ? '🌟 Perfect Spell!' : '🎉 Well Done!'}
          </h1>

          <p className="celebration__message">{randomMessage}</p>

          <div className="celebration__stats">
            <div className="stat-card">
              <div className="stat-card__icon">🪄</div>
              <div className="stat-card__value">{state.wpm}</div>
              <div className="stat-card__label">Spells Per Minute</div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon">⭐</div>
              <div className="stat-card__value">{state.accuracy}%</div>
              <div className="stat-card__label">Accuracy</div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon">🏆</div>
              <div className="stat-card__value">
                {perfect ? 50 : Math.round(state.accuracy / 2)}
              </div>
              <div className="stat-card__label">Points Earned</div>
            </div>
          </div>

          <Button className="celebration__button" onClick={handleReset}>
            ✨ Cast Another Spell! ✨
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="typing-test typing-test--magical">
      {/* Gamification overlays */}
      <SpellCombo
        combo={currentCombo}
        isActive={isTestStarted && !state.isTestComplete}
      />
      <LevelUp
        year={currentYear}
        show={showLevelUp}
        onComplete={clearLevelUp}
      />
      <AchievementUnlock
        achievement={pendingAchievement}
        onComplete={clearPendingAchievement}
      />

      {state.showWordSuggestion && (
        <WordSuggestion
          word={state.suggestedWord}
          onClose={actions.hideSuggestion}
        />
      )}

      <ProgressTracker />

      <div className="typing-test__header">
        <h1 className="magical-title">
          <span className="sparkle">✨</span>
          Typing Spellbook
          <span className="sparkle">✨</span>
        </h1>

        <div className="typing-test__metrics">
          <div className="metric-card">
            <span className="metric-icon">🪄</span>
            <WPM wpm={state.wpm} />
          </div>
          <div className="metric-card">
            <span className="metric-icon">⭐</span>
            <Accuracy accuracy={state.accuracy} />
          </div>
        </div>
      </div>

      <div className="typing-test__main">
        <div className="parchment-scroll">
          <TypingArea
            words={state.words}
            currentWordIndex={state.currentWordIndex}
            currentCharIndex={state.currentCharIndex}
            onKeyPress={actions.handleKeyPress}
            onBackspace={actions.handleBackspace}
            onSpace={handleSpace}
            isActive={!state.isTestComplete}
          />
        </div>
      </div>

      <div className="typing-test__footer">
        <div className="typing-test__actions">
          <Button
            variant="secondary"
            onClick={actions.generateNewSentence}
            className="magical-button magical-button--spell"
            disabled={isLoading}
          >
            ✨ New Spell ✨
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            className="magical-button"
          >
            🔄 Start Over
          </Button>
        </div>
      </div>

      <SentenceExport />
      <ErrorExport />
      <AudioControl />
    </div>
  );
};
