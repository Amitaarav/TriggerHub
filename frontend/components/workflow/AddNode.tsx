"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Plus } from "lucide-react";

export interface AddNodeData {
  onAdd: () => void;
  [key: string]: unknown;
}

export const AddNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as AddNodeData;
  const { onAdd } = nodeData;

  return (
    <div className="flex flex-col items-center">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white"
      />
      <button
        type="button"
        onClick={onAdd}
        className="group flex items-center gap-2 rounded-full border-2 border-dashed border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-orange-500 hover:bg-orange-50/50 hover:text-orange-600 hover:shadow"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
          <Plus className="h-3.5 w-3.5" />
        </div>
        <span>Add Next Step</span>
      </button>
    </div>
  );
});

AddNode.displayName = "AddNode";
