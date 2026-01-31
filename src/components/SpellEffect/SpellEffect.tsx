/**
 * Spell Effect Component
 * Visual effects for correct typing (spell casting)
 */
import React, { useEffect, useState } from 'react';
import './SpellEffect.scss';

interface SpellEffectProps {
  x: number;
  y: number;
  type: 'correct' | 'perfect' | 'spell-cast';
}

export const SpellEffect: React.FC<SpellEffectProps> = ({ x, y, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`spell-effect spell-effect--${type}`}
      style={{ left: x, top: y }}
    >
      {type === 'correct' && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="spark"
              style={{
                transform: `rotate(${i * 45}deg)`
              }}
            />
          ))}
        </>
      )}
      
      {type === 'perfect' && (
        <>
          <div className="magic-circle"></div>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-20px)`
              }}
            >
              ⭐
            </div>
          ))}
        </>
      )}

      {type === 'spell-cast' && (
        <div className="wand-trail">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="trail-particle"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
