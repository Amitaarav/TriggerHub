"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import { Appbar } from "@/components/Appbar";
import { TriggerNode } from "@/components/workflow/TriggerNode";
import { ActionNode } from "@/components/workflow/ActionNode";
import { AddNode } from "@/components/workflow/AddNode";
import {
  WorkflowConfigModal,
  ConfigSelectionResult,
} from "@/components/workflow/WorkflowConfigModal";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { BACKEND_URL } from "@/app/config";
import authAxios from "@/utils/authAxios";
import { useAuth } from "@/context/AuthContext";
import { showError, showSuccess, showWarning, extractErrorMessage } from "@/lib/toast";
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Loader2,
} from "lucide-react";

interface ActionItem {
  id: string; // unique local ID for React Flow
  availableActionId: string;
  name: string;
  image?: string;
  metadata: Record<string, unknown>;
}

function WorkflowCanvasContent() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Mark mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect route gracefully without false redirects
  useEffect(() => {
    if (!authLoading && mounted) {
      const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token && !storedToken) {
        router.push("/login?redirect=/zap/create");
      }
    }
  }, [authLoading, token, mounted, router]);

  // Available catalogs from API
  const [availableTriggers, setAvailableTriggers] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const [availableActions, setAvailableActions] = useState<
    { id: string; name: string; image: string }[]
  >([]);

  // Workflow builder state
  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
    image?: string;
  } | null>(null);

  const [actions, setActions] = useState<ActionItem[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Modal configuration state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    isTrigger: boolean;
    stepNumber: number;
    actionLocalId?: string;
  }>({
    isOpen: false,
    isTrigger: true,
    stepNumber: 1,
  });

  // Fetch available triggers and actions
  useEffect(() => {
    const activeToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!activeToken) return;

    authAxios
      .get(`${BACKEND_URL}/api/v1/trigger/available`)
      .then((res) => {
        if (res.data?.availableTriggers) {
          setAvailableTriggers(res.data.availableTriggers);
        }
      })
      .catch((err) => {
        // Silently log or notify without crashing canvas
        console.error("Could not fetch triggers", err);
      });

    authAxios
      .get(`${BACKEND_URL}/api/v1/action/available`)
      .then((res) => {
        if (res.data?.availableActions) {
          setAvailableActions(res.data.availableActions);
        }
      })
      .catch((err) => {
        console.error("Could not fetch actions", err);
      });
  }, [token]);

  // Node types registration
  const nodeTypes = useMemo(
    () => ({
      triggerNode: TriggerNode,
      actionNode: ActionNode,
      addNode: AddNode,
    }),
    []
  );

  // Handlers for modal
  const openTriggerConfig = useCallback(() => {
    setModalConfig({
      isOpen: true,
      isTrigger: true,
      stepNumber: 1,
    });
  }, []);

  const openActionConfig = useCallback(
    (actionLocalId: string, stepIndex: number) => {
      setModalConfig({
        isOpen: true,
        isTrigger: false,
        stepNumber: stepIndex,
        actionLocalId,
      });
    },
    []
  );

  const handleAddNewAction = useCallback(() => {
    const newId = `action-${Date.now()}`;
    const newAction: ActionItem = {
      id: newId,
      availableActionId: "",
      name: "",
      metadata: {},
    };
    setActions((prev) => [...prev, newAction]);
    setModalConfig({
      isOpen: true,
      isTrigger: false,
      stepNumber: actions.length + 2,
      actionLocalId: newId,
    });
  }, [actions.length]);

  const handleDeleteAction = useCallback((actionLocalId: string) => {
    setActions((prev) => prev.filter((a) => a.id !== actionLocalId));
  }, []);

  // Construct React Flow Nodes and Edges dynamically
  const initialNodes: Node[] = useMemo(() => {
    const flowNodes: Node[] = [];
    const centerX = 260;
    const spacingY = 170;

    // 1. Trigger Node
    flowNodes.push({
      id: "node-trigger",
      type: "triggerNode",
      position: { x: centerX, y: 40 },
      data: {
        id: selectedTrigger?.id,
        name: selectedTrigger?.name,
        image: selectedTrigger?.image,
        isConfigured: !!selectedTrigger?.id,
        onConfigure: openTriggerConfig,
      },
    });

    // 2. Action Nodes
    actions.forEach((act, index) => {
      flowNodes.push({
        id: act.id,
        type: "actionNode",
        position: { x: centerX, y: 40 + (index + 1) * spacingY },
        data: {
          index: index + 2,
          availableActionId: act.availableActionId,
          name: act.name,
          image: act.image,
          metadata: act.metadata,
          isConfigured: !!act.availableActionId,
          onConfigure: () => openActionConfig(act.id, index + 2),
          onDelete: () => handleDeleteAction(act.id),
        },
      });
    });

    // 3. Add Node at the bottom
    flowNodes.push({
      id: "node-add-step",
      type: "addNode",
      position: { x: centerX + 55, y: 40 + (actions.length + 1) * spacingY },
      data: {
        onAdd: handleAddNewAction,
      },
    });

    return flowNodes;
  }, [
    selectedTrigger,
    actions,
    openTriggerConfig,
    openActionConfig,
    handleDeleteAction,
    handleAddNewAction,
  ]);

  const initialEdges: Edge[] = useMemo(() => {
    const flowEdges: Edge[] = [];
    let prevNodeId = "node-trigger";

    actions.forEach((act) => {
      flowEdges.push({
        id: `edge-${prevNodeId}-${act.id}`,
        source: prevNodeId,
        target: act.id,
        animated: true,
        style: { stroke: "#f97316", strokeWidth: 2.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#f97316",
        },
      });
      prevNodeId = act.id;
    });

    // Edge to add node
    flowEdges.push({
      id: `edge-${prevNodeId}-add`,
      source: prevNodeId,
      target: "node-add-step",
      style: { stroke: "#cbd5e1", strokeWidth: 2, strokeDasharray: "5,5" },
    });

    return flowEdges;
  }, [actions]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep nodes in sync when actions/trigger state updates
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle configuration selection from Modal
  const handleModalSelect = (result: ConfigSelectionResult) => {
    if (modalConfig.isTrigger) {
      setSelectedTrigger({
        id: result.id,
        name: result.name,
        image: result.image,
      });
      showSuccess("Trigger configured", `Selected "${result.name}"`);
    } else if (modalConfig.actionLocalId) {
      setActions((prev) =>
        prev.map((a) => {
          if (a.id === modalConfig.actionLocalId) {
            return {
              ...a,
              availableActionId: result.id,
              name: result.name,
              image: result.image,
              metadata: result.metadata || {},
            };
          }
          return a;
        })
      );
      showSuccess("Action configured", `Configured "${result.name}"`);
    }
  };

  // Publish workflow to backend
  const handlePublishZap = async () => {
    if (!selectedTrigger?.id) {
      showWarning(
        "Trigger required",
        "Please select a trigger event before publishing."
      );
      return;
    }

    if (actions.length === 0) {
      showWarning(
        "Action required",
        "Add at least one action step to complete the workflow."
      );
      return;
    }

    const unconfigured = actions.some((a) => !a.availableActionId);
    if (unconfigured) {
      showWarning(
        "Incomplete action steps",
        "Please configure all action steps or remove incomplete ones."
      );
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        availableTriggerId: selectedTrigger.id,
        triggerMetadata: {},
        actions: actions.map((a) => ({
          availableActionId: a.availableActionId,
          actionMetadata: a.metadata || {},
        })),
      };

      await authAxios.post(`${BACKEND_URL}/api/v1/zap`, payload);

      showSuccess(
        "Workflow published!",
        "Your automation is now live and waiting for webhook events."
      );
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMsg = extractErrorMessage(
        err,
        "Failed to create workflow. Please check your network and try again."
      );
      showError("Publish failed", errorMsg);
    } finally {
      setIsPublishing(false);
    }
  };

  const activeAction = actions.find((a) => a.id === modalConfig.actionLocalId);

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
        <Appbar />
        <div className="mt-16 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <p className="text-sm font-semibold text-slate-600">
              Loading Workflow Builder...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      <Appbar />

      {/* Editor Sub-Header / Control Bar */}
      <div className="mt-16 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Untitled Automation
            </h1>
            <p className="text-xs text-slate-500">
              {selectedTrigger?.id ? "Draft workflow" : "Configure trigger to start"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddNewAction}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>

          <PrimaryButton
            size="small"
            isLoading={isPublishing}
            onClick={handlePublishZap}
            className="gap-2 px-5 py-2 text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isPublishing ? "Publishing..." : "Publish Workflow"}</span>
          </PrimaryButton>
        </div>
      </div>

      {/* React Flow Visual Canvas */}
      <div className="flex-1 w-full h-[calc(100vh-120px)] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.4}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          className="bg-slate-50/50"
        >
          <Background color="#cbd5e1" gap={20} size={1.2} />
          <Controls
            position="bottom-left"
            showInteractive={false}
            className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden"
          />
          <MiniMap
            position="bottom-right"
            nodeColor={(n) => (n.type === "triggerNode" ? "#ea580c" : "#1e293b")}
            className="border border-slate-200 rounded-xl overflow-hidden shadow-md bg-white/90"
          />
        </ReactFlow>

        {/* Empty Canvas Prompt Overlay if no trigger */}
        {!selectedTrigger && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-600/90 text-white px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur-sm pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click the Trigger card below to begin your automation</span>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      <WorkflowConfigModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onSelect={handleModalSelect}
        isTrigger={modalConfig.isTrigger}
        stepNumber={modalConfig.stepNumber}
        availableItems={modalConfig.isTrigger ? availableTriggers : availableActions}
        initialActionId={activeAction?.availableActionId}
        initialMetadata={activeAction?.metadata}
      />
    </div>
  );
}

export default function CreateZapPage() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasContent />
    </ReactFlowProvider>
  );
}