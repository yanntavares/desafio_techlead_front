import { ReactNode } from 'react';
import { cn } from '@/utils/lib/tailwind-merge';

type ButtonProps = {
  label?: string;
  variant?: 'primary' | 'secondary' | 'panel' | 'hollow' | 'danger' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
};

export function Button({
  label,
  variant = 'primary',
  onClick,
  disabled,
  className,
  children,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  const styles = {
    primary: 'bg-darkest-blue/80 text-white hover:bg-darkest-blue',
    secondary: 'bg-white text-blue-600',
    panel: 'bg-darkest-blue/80 text-white text-xs lg:mx-2 lg:m md:text-base lg:text-md hover:bg-darkest-blue',
    hollow: 'border-2 border-border text-normal',
    danger: 'bg-red-700 text-white hover:bg-red-800',
    ghost: 'text-normal hover:text-black',
  };

  const disabledStyles = 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-50 hover:scale-100';

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn('px-4 py-2 rounded-lg transition', disabled ? disabledStyles : styles[variant], className)}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
    >
      {children ?? label}
    </button>
  );
}
