"use client";

import React, { ReactNode } from "react";

interface DarkButtonProps {
  children: ReactNode;
  onClick?: () => void;
  size?: "big" | "small";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const DarkButton = ({
  children,
  onClick,
  size = "small",
  disabled = false,
  type = "button",
  className = "",
}: DarkButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-900 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed ${
        size === "small" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"
      } ${className}`}
    >
      {children}
    </button>
  );
};