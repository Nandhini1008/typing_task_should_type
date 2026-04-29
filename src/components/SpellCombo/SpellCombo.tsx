import React, { useEffect, useState } from 'react';
import './SpellCombo.scss';

interface SpellComboProps {
  combo: number;
  isActive: boolean;
}

export const SpellCombo: React.FC<SpellComboProps> = ({ combo, isActive }) => {
  const [showCombo, setShowCombo] = useState(false);
  const [prevCombo, setPrevCombo] = useState(0);

  useEffect(() => {
    if (combo > prevCombo && combo >= 3) {
      setShowCombo(true);
      const timer = setTimeout(() => setShowCombo(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevCombo(combo);
  }, [combo, prevCombo]);

  if (!isActive || combo < 3) return null;

  const getComboMessage = () => {
    if (combo >= 50) return '🔥 LEGENDARY WIZARD! 🔥';
    if (combo >= 30) return '⚡ SPELL MASTER! ⚡';
    if (combo >= 20) return '✨ AMAZING COMBO! ✨';
    if (combo >= 10) return '🌟 GREAT STREAK! 🌟';
    if (combo >= 5) return '💫 NICE COMBO! 💫';
    return '🪄 COMBO! 🪄';
  };

  const getComboClass = () => {
    if (combo >= 50) return 'spell-combo--legendary';
    if (combo >= 30) return 'spell-combo--master';
    if (combo >= 20) return 'spell-combo--amazing';
    if (combo >= 10) return 'spell-combo--great';
    return 'spell-combo--nice';
  };

  return (
    <div
      className={`spell-combo ${getComboClass()} ${showCombo ? 'spell-combo--pulse' : ''}`}
    >
      <div className="spell-combo__message">{getComboMessage()}</div>
      <div className="spell-combo__count">
        <span className="spell-combo__multiplier">×{combo}</span>
        <span className="spell-combo__label">COMBO</span>
      </div>
      <div className="spell-combo__particles">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{ '--angle': `${i * 45}deg` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};
