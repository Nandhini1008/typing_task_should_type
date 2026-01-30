import React from 'react';
import { clsx } from 'clsx';
import './Toggle.scss';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label className={clsx('toggle', { 'toggle--disabled': disabled })}>
      <input
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle__slider" />
      {label && <span className="toggle__label">{label}</span>}
    </label>
  );
};
