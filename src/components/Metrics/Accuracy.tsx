import React from 'react';
import './Accuracy.scss';

export interface AccuracyProps {
  accuracy: number;
}

export const Accuracy: React.FC<AccuracyProps> = ({ accuracy }) => {
  return (
    <div className="accuracy-display">
      <span className="accuracy-display__value">
        {Math.round(accuracy)}%
      </span>
      <span className="accuracy-display__label">Accuracy</span>
    </div>
  );
};
