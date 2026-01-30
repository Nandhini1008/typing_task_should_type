import React, { useEffect } from 'react';
import './AudioControl.scss';
import { ttsService } from '@/services/tts.service';

export const AudioControl: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  useEffect(() => {
    ttsService.setEnabled(audioEnabled);
  }, [audioEnabled]);

  const handleToggle = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    
    // Test audio when enabled
    if (newState) {
      setTimeout(() => {
        ttsService.speakWord('Audio enabled', 1.0);
      }, 100);
    }
  };

  return (
    <div className="audio-control">
      <button 
        className={`audio-control__button ${audioEnabled ? 'audio-control__button--on' : ''}`}
        onClick={handleToggle}
        aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
};
