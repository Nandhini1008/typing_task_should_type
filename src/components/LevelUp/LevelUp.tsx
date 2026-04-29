import React, { useEffect, useState } from 'react';
import './LevelUp.scss';

interface LevelUpProps {
  year: number;
  show: boolean;
  onComplete: () => void;
}

export const LevelUp: React.FC<LevelUpProps> = ({ year, show, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  const getYearTitle = () => {
    const titles = [
      'First Year Student',
      'Second Year Student',
      'Third Year Student',
      'Fourth Year Student',
      'Fifth Year Student - O.W.L.s',
      'Sixth Year Student',
      'Seventh Year Student - N.E.W.T.s',
    ];
    return titles[year - 1] || 'Hogwarts Student';
  };

  return (
    <div className="level-up-overlay">
      <div className="level-up">
        <div className="level-up__stars">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="level-up__content">
          <div className="level-up__badge">
            <div className="badge-ring"></div>
            <div className="badge-ring badge-ring--2"></div>
            <div className="badge-number">{year}</div>
          </div>

          <h1 className="level-up__title">YEAR UP!</h1>
          <p className="level-up__subtitle">{getYearTitle()}</p>

          <div className="level-up__sparkles">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="sparkle"
                style={
                  {
                    '--angle': `${i * 30}deg`,
                    animationDelay: `${i * 0.1}s`,
                  } as React.CSSProperties
                }
              >
                ✨
              </div>
            ))}
          </div>
        </div>

        <div className="level-up__rays">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="ray"
              style={{ '--ray-angle': `${i * 22.5}deg` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
