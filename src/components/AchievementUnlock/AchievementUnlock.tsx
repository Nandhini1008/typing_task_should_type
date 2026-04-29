import React, { useEffect, useState } from 'react';
import './AchievementUnlock.scss';

interface AchievementUnlockProps {
  achievement: {
    icon: string;
    name: string;
    description: string;
  } | null;
  onComplete: () => void;
}

export const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  achievement,
  onComplete,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);

  if (!achievement || !visible) return null;

  return (
    <div className="achievement-unlock">
      <div className="achievement-unlock__glow"></div>
      <div className="achievement-unlock__content">
        <div className="achievement-unlock__header">
          <span className="achievement-unlock__trophy">🏆</span>
          <span className="achievement-unlock__text">
            ACHIEVEMENT UNLOCKED!
          </span>
        </div>
        <div className="achievement-unlock__body">
          <div className="achievement-unlock__icon">{achievement.icon}</div>
          <div className="achievement-unlock__details">
            <h3 className="achievement-unlock__name">{achievement.name}</h3>
            <p className="achievement-unlock__description">
              {achievement.description}
            </p>
          </div>
        </div>
      </div>
      <div className="achievement-unlock__particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
