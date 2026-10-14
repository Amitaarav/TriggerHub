"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Zap, CheckCircle2, AlertCircle, Edit2 } from "lucide-react";
import Image from "next/image";

export interface TriggerNodeData {
  id?: string;
  name?: string;
  image?: string;
  isConfigured: boolean;
  onConfigure: () => void;
  [key: string]: unknown;
}

export const TriggerNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as TriggerNodeData;
  const { name, image, isConfigured, onConfigure } = nodeData;

  return (
    <div
      onClick={onConfigure}
      className={`group relative min-w-[280px] max-w-[320px] rounded-2xl bg-white p-4 shadow-md transition-all duration-200 hover:shadow-xl cursor-pointer border-2 ${
        isConfigured
          ? "border-orange-500/80 hover:border-orange-600"
          : "border-dashed border-amber-400 hover:border-amber-500 bg-amber-50/20"
      }`}
    >
      {/* Node Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm">
            <Zap className="h-3.5 w-3.5 fill-white text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-950">
            1. Trigger
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isConfigured ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Configured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Required
            </span>
          )}
        </div>
      </div>

      {/* Node Body */}
      <div className="pt-3 pb-1 flex items-center gap-3">
        {image ? (
          <div className="relative h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shadow-xs">
            <Image
              src={image}
              alt={name || "Trigger"}
              width={32}
              height={32}
              unoptimized
              className="object-contain rounded-md"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Zap className="h-5 w-5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">
            {name || "Select a Trigger"}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {isConfigured
              ? "Starts the workflow execution"
              : "Click to choose trigger event"}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onConfigure();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 focus:opacity-100"
          aria-label="Edit trigger"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Directional Handle: Bottom Source */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-orange-600 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
});

TriggerNode.displayName = "TriggerNode";
