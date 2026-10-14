"use client";

import React, { useId } from "react";

interface InputProps {
  label: string;
  placeholder?: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password" | "email" | "number";
  id?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  id,
  error,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  className = "",
}: InputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center pb-1.5 pt-2">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 select-none flex items-center gap-1"
        >
          {required && <span className="text-orange-600 font-bold" aria-hidden="true">*</span>}
          <span>{label}</span>
        </label>
      </div>

      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          required={required}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-300 hover:border-slate-400 focus:border-orange-500 focus:ring-orange-500/20"
          }`}
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};