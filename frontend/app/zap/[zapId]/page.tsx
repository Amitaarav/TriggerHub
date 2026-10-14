"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import { Appbar } from "@/components/Appbar";
import { TriggerNode } from "@/components/workflow/TriggerNode";
import { ActionNode } from "@/components/workflow/ActionNode";
import { BACKEND_URL, HOOKS_URL } from "@/app/config";
import authAxios from "@/utils/authAxios";
import { useAuth } from "@/context/AuthContext";
import { showCopied, showError } from "@/lib/toast";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  Copy,
  Radio,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface ZapDetail {
  id: string;
  triggerId: string;
  userId: number;
  createdAt?: string;
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
    metadata?: Record<string, unknown>;
  };
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    metadata?: Record<string, unknown>;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}

function ZapDetailContent({ zapId }: { zapId: string }) {
  const router = useRouter();
  const { token, isLoading: authLoading, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [loading, setLoading] = useState(true);
  const [zap, setZap] = useState<ZapDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Protect route
  useEffect(() => {
    if (!authLoading && mounted) {
      const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token && !storedToken) {
        router.push(`/login?redirect=/zap/${zapId}`);
      }
    }
  }, [authLoading, token, mounted, router, zapId]);

  const fetchZap = () => {
    const activeToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!activeToken) return;
    setLoading(true);
    setError(null);

    authAxios
      .get(`${BACKEND_URL}/api/v1/zap/${zapId}`)
      .then((res) => {
        setZap(res.data.zap);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.status === 404
            ? "Workflow not found"
            : "Failed to load workflow details."
        );
        showError("Could not fetch workflow", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (mounted) {
      fetchZap();
    }
  }, [zapId, token, mounted]);

  const nodeTypes = useMemo(
    () => ({
      triggerNode: TriggerNode,
      actionNode: ActionNode,
    }),
    []
  );

  // Build nodes and edges for visualization
  const { nodes, edges } = useMemo(() => {
    if (!zap) return { nodes: [], edges: [] };

    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];
    const centerX = 260;
    const spacingY = 170;

    // Trigger Node
    flowNodes.push({
      id: "node-trigger",
      type: "triggerNode",
      position: { x: centerX, y: 40 },
      data: {
        id: zap.trigger?.triggerId,
        name: zap.trigger?.type?.name || "Webhook Trigger",
        image: zap.trigger?.type?.image,
        isConfigured: true,
        onConfigure: () => {},
      },
    });

    let prevNodeId = "node-trigger";

    // Action Nodes
    zap.actions.forEach((act, idx) => {
      flowNodes.push({
        id: act.id,
        type: "actionNode",
        position: { x: centerX, y: 40 + (idx + 1) * spacingY },
        data: {
          index: idx + 2,
          availableActionId: act.actionId,
          name: act.type?.name || "Action",
          image: act.type?.image,
          metadata: act.metadata,
          isConfigured: true,
          onConfigure: () => {},
          onDelete: () => {},
        },
      });

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

    return { nodes: flowNodes, edges: flowEdges };
  }, [zap]);

  const webhookUrl = `${HOOKS_URL}/hooks/catch/${user?.id || "1"}/${zapId}`;

  const curlSnippet = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "test", "timestamp": "${new Date().toISOString()}"}'`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    showCopied("Webhook URL copied");
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    showCopied("cURL command copied");
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
        <Appbar />
        <div className="mt-16 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <p className="text-sm font-semibold text-slate-600">
              Loading Workflow Details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      <Appbar />

      {/* Control Sub-Header */}
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
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Automation Overview
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">ID: {zapId}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/zap/create")}
          className="rounded-lg bg-orange-600 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-orange-700 transition-colors"
        >
          Create New Zap
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="space-y-4 w-80 text-center">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </div>
      ) : error || !zap ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <ErrorState
            title="Workflow not available"
            message={error || "Could not retrieve the requested workflow."}
            onRetry={fetchZap}
          />
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-120px)] overflow-hidden">
          {/* Visual Canvas (2 cols) */}
          <div className="lg:col-span-2 h-full relative border-r border-slate-200">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.5}
              maxZoom={1.5}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              proOptions={{ hideAttribution: true }}
              className="bg-slate-50/70"
            >
              <Background color="#cbd5e1" gap={20} size={1.2} />
              <Controls
                position="bottom-left"
                showInteractive={false}
                className="bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden"
              />
              <MiniMap
                position="bottom-right"
                nodeColor={(n) =>
                  n.type === "triggerNode" ? "#ea580c" : "#1e293b"
                }
                className="border border-slate-200 rounded-xl overflow-hidden shadow-md bg-white/90"
              />
            </ReactFlow>
          </div>

          {/* Webhook & Execution Details Sidebar (1 col) */}
          <div className="h-full overflow-y-auto bg-white p-6 space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                Trigger Endpoint
              </h2>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Incoming Webhook</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyWebhook}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-800 break-all bg-white p-2 rounded-lg border border-slate-200">
                  {webhookUrl}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Test Webhook (cURL)
                </h2>
                <button
                  type="button"
                  onClick={handleCopyCurl}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy cURL</span>
                </button>
              </div>
              <div className="rounded-xl bg-slate-900 p-3.5 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
                <pre>{curlSnippet}</pre>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                Workflow Steps ({zap.actions.length + 1})
              </h2>
              <div className="space-y-3">
                {/* Step 1: Trigger */}
                <div className="rounded-xl border border-slate-200 p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-600">
                      Step 1 • Trigger
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {zap.trigger?.type?.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Catches external HTTP payloads and starts pipeline.
                  </p>
                </div>

                {/* Steps: Actions */}
                {zap.actions.map((act, index) => (
                  <div
                    key={act.id}
                    className="rounded-xl border border-slate-200 p-3 bg-white space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Step {index + 2} • Action
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        {act.type?.name}
                      </span>
                    </div>

                    {act.metadata && Object.keys(act.metadata).length > 0 && (
                      <div className="pt-1.5 text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {act.metadata.email && (
                          <p>To: {String(act.metadata.email)}</p>
                        )}
                        {act.metadata.body && (
                          <p className="truncate">
                            Body: {String(act.metadata.body)}
                          </p>
                        )}
                        {act.metadata.address && (
                          <p className="truncate">
                            Wallet: {String(act.metadata.address)}
                          </p>
                        )}
                        {act.metadata.amount && (
                          <p>Amount: {String(act.metadata.amount)} SOL</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ZapDetailPage({
  params,
}: {
  params: Promise<{ zapId: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <ReactFlowProvider>
      <ZapDetailContent zapId={resolvedParams.zapId} />
    </ReactFlowProvider>
  );
}
