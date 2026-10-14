"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Play, CheckCircle2, AlertCircle, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

export interface ActionNodeData {
  index: number;
  availableActionId?: string;
  name?: string;
  image?: string;
  metadata?: Record<string, unknown> | null;
  isConfigured: boolean;
  onConfigure: () => void;
  onDelete: () => void;
  [key: string]: unknown;
}

export const ActionNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as ActionNodeData;
  const { index, name, image, metadata, isConfigured, onConfigure, onDelete } = nodeData;

  const getMetadataSummary = () => {
    if (!metadata || Object.keys(metadata).length === 0) return null;
    if (metadata.email) {
      return `To: ${metadata.email}`;
    }
    if (metadata.address && metadata.amount) {
      return `${metadata.amount} SOL → ${String(metadata.address).slice(0, 6)}...`;
    }
    return "Custom configuration";
  };

  const metaSummary = getMetadataSummary();

  return (
    <div
      onClick={onConfigure}
      className={`group relative min-w-[280px] max-w-[320px] rounded-2xl bg-white p-4 shadow-md transition-all duration-200 hover:shadow-xl cursor-pointer border-2 ${
        isConfigured
          ? "border-slate-300 hover:border-slate-500"
          : "border-dashed border-amber-400 hover:border-amber-500 bg-amber-50/20"
      }`}
    >
      {/* Directional Handle: Top Target */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-700 !w-3 !h-3 !border-2 !border-white"
      />

      {/* Node Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
            <Play className="h-3 w-3 fill-white text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {index}. Action
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
              Incomplete
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
              alt={name || "Action"}
              width={32}
              height={32}
              unoptimized
              className="object-contain rounded-md"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Play className="h-5 w-5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">
            {name || "Select an Action"}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {metaSummary || (isConfigured ? "Action configured" : "Click to configure action")}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConfigure();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Edit action"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
            aria-label="Delete action"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Directional Handle: Bottom Source */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-700 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
});

ActionNode.displayName = "ActionNode";
