import React from 'react';
import './Timer.scss';

export interface TimerProps {
  timeRemaining: number;
  mode?: 'countdown' | 'elapsed';
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  mode = 'countdown',
}) => {
  const displayTime = Math.ceil(timeRemaining);

  return (
    <div className="timer-display">
      <span className="timer-display__value">{displayTime}s</span>
    </div>
  );
};
