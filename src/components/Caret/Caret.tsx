import React from 'react';
import type { CaretPosition } from '@/hooks/useCaretPosition';
import { useSettingsStore } from '@/store/settings.store';
import './Caret.scss';

export interface CaretProps {
  position: CaretPosition;
  isActive: boolean;
}

export const Caret: React.FC<CaretProps> = ({ position, isActive }) => {
  const { caretStyle, smoothCaret } = useSettingsStore((state) => ({
    caretStyle: state.accessibility.caretStyle,
    smoothCaret: state.accessibility.smoothCaret,
  }));

  return (
    <div
      className={`caret caret--${caretStyle} ${smoothCaret ? 'caret--smooth' : ''} ${isActive ? 'caret--active' : ''}`}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
    />
  );
};
