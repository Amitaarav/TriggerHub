"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  size?: "big" | "small";
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const PrimaryButton = ({
  children,
  onClick,
  size = "small",
  disabled = false,
  isLoading = false,
  type = "button",
  className = "",
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-bold rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none ${
        size === "small" ? "text-sm px-6 py-2.5" : "text-base px-8 py-3.5"
      } ${className}`}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      <span>{children}</span>
    </button>
  );
};