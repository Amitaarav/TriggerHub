"use client";

import React from "react";

export const Skeleton = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
      {...props}
    />
  );
};

export const ZapCardSkeleton = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-2 w-8" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
};
