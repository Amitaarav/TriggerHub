"use client";

import React, { ReactNode } from "react";

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  size?: "big" | "small";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const SecondaryButton = ({
  children,
  onClick,
  size = "small",
  disabled = false,
  type = "button",
  className = "",
}: SecondaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed ${
        size === "small" ? "px-6 py-2.5 text-sm" : "px-8 py-3.5 text-base"
      } ${className}`}
    >
      {children}
    </button>
  );
};