'use client';

import { InputHTMLAttributes, ReactNode, useState } from 'react';
import { EyeIcon, CuttedEyeIcon } from './Icons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  password?: boolean;
  icon?: ReactNode;
}

export function Input({ label, icon, password, className = '', id, ...props }: InputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[#191C1E]">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 w-full bg-white border border-border rounded-lg transition-all focus-within:ring-2 focus-within:ring-[#1E3A8A] focus-within:border-transparent ${
          props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''
        } ${className}`}
      >
        {icon && (
          <div className="text-normal flex flex-shrink-0 items-center justify-center">{icon}</div>
        )}

        <input
          id={id}
          className="w-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 disabled:cursor-not-allowed"
          {...props}
          type={password ? (visible ? 'text' : 'password') : props.type}
        />

        {password && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            className="text-normal flex flex-shrink-0 items-center justify-center"
          >
            {visible ? <CuttedEyeIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}
