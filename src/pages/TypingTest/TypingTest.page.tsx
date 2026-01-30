import React, { useState } from 'react';
import { TypingArea } from '@/components/TypingArea/TypingArea';
import { WPM } from '@/components/Metrics/WPM';
import { Accuracy } from '@/components/Metrics/Accuracy';
import { Button } from '@/components/Common/Button';
import { WordSuggestion } from '@/components/WordSuggestion/WordSuggestion';
import { AudioControl } from '@/components/AudioControl/AudioControl';
import { useTypingTest } from './TypingTest.logic.ts';
import { useSettings } from '@/hooks/useSettings';
import './TypingTest.styles.scss';

export const TypingTestPage: React.FC = () => {
  const { wordCount } = useSettings();
  const [isTestStarted, setIsTestStarted] = useState(false);

  const {
    state,
    actions,
    isLoading,
    error,
  } = useTypingTest(wordCount);

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

  if (isLoading) {
    return (
      <div className="typing-test">
        <div className="typing-test__loading">Loading test...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="typing-test">
        <div className="typing-test__error">Error: {error}</div>
      </div>
    );
  }

  if (state.isTestComplete) {
    return (
      <div className="typing-test">
        <div className="typing-test__results">
          <h2 className="typing-test__results-title">Test Complete!</h2>
          <div className="typing-test__results-stats">
            <WPM wpm={state.wpm} />
            <Accuracy accuracy={state.accuracy} />
          </div>
          <Button onClick={handleReset}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="typing-test">
      {state.showWordSuggestion && (
        <WordSuggestion 
          word={state.suggestedWord} 
          onClose={actions.hideSuggestion} 
        />
      )}
      
      <div className="typing-test__header">
        <div className="typing-test__metrics">
          <WPM wpm={state.wpm} />
          <Accuracy accuracy={state.accuracy} />
        </div>
      </div>

      <div className="typing-test__main">
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

      <div className="typing-test__footer">
        <Button variant="ghost" onClick={handleReset}>
          Reset
        </Button>
      </div>
      
      <AudioControl />
    </div>
  );
};
