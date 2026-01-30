import React from 'react';
import './WPM.scss';

export interface WPMProps {
  wpm: number;
  raw?: number;
  showRaw?: boolean;
}

export const WPM: React.FC<WPMProps> = ({ wpm, raw, showRaw = false }) => {
  return (
    <div className="wpm-display">
      <div className="wpm-display__main">
        <span className="wpm-display__value">{Math.round(wpm)}</span>
        <span className="wpm-display__label">WPM</span>
      </div>
      {showRaw && raw !== undefined && (
        <div className="wpm-display__raw">
          <span className="wpm-display__raw-value">{Math.round(raw)}</span>
          <span className="wpm-display__raw-label">raw</span>
        </div>
      )}
    </div>
  );
};
