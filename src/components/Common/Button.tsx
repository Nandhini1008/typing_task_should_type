import React from 'react';
import { clsx } from 'clsx';
import './Button.scss';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx('button', `button--${variant}`, `button--${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
};
