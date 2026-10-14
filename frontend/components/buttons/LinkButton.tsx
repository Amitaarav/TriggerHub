"use client";

import { ReactNode } from "react";

interface LinkButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const LinkButton = ({
  children,
  onClick,
  className = "",
  variant = "default",
  disabled = false,
  type = "button",
}: LinkButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded-lg text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
    ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};