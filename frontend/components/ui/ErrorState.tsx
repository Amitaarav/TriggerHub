"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { LinkButton } from "@/components/buttons/LinkButton";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "We couldn't load the requested data. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-10 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-3">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-red-950">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-red-700">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <LinkButton
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try again</span>
          </LinkButton>
        </div>
      )}
    </div>
  );
};
