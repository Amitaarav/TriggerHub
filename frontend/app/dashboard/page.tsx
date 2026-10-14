"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Appbar } from "@/components/Appbar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { BACKEND_URL, HOOKS_URL } from "../config";
import authAxios from "@/utils/authAxios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { showCopied, showError } from "@/lib/toast";
import { ZapCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  Plus,
  Search,
  Copy,
  ArrowRight,
  ExternalLink,
  Zap,
  Radio,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface ZapItem {
  id: string;
  triggerId: string;
  userId: number;
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
  createdAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, isLoading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<ZapItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Route protection
  useEffect(() => {
    if (!authLoading) {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token && !stored) {
        router.push("/login?redirect=/dashboard");
      }
    }
  }, [authLoading, token, router]);

  const fetchZaps = useCallback(() => {
    const activeToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!activeToken) return;
    setLoading(true);
    setError(null);

    authAxios
      .get(`${BACKEND_URL}/api/v1/zap`)
      .then((res) => {
        setZaps(res.data.zaps || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Failed to load workflows. Please try again."
        );
        showError("Could not load workflows", err);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    fetchZaps();
  }, [fetchZaps]);

  // Filter zaps by query
  const filteredZaps = useMemo(() => {
    if (!searchQuery.trim()) return zaps;
    const q = searchQuery.toLowerCase().trim();

    return zaps.filter((z) => {
      const matchId = z.id.toLowerCase().includes(q);
      const matchTrigger = z.trigger?.type?.name.toLowerCase().includes(q);
      const matchAction = z.actions?.some((a) =>
        a.type?.name.toLowerCase().includes(q)
      );
      return matchId || matchTrigger || matchAction;
    });
  }, [zaps, searchQuery]);

  const handleCopyWebhook = (zapId: string) => {
    const webhookUrl = `${HOOKS_URL}/hooks/catch/${user?.id || "1"}/${zapId}`;
    navigator.clipboard.writeText(webhookUrl);
    showCopied("Webhook URL copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Appbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Workflows
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your event triggers, automated actions, and incoming webhooks.
            </p>
          </div>

          <PrimaryButton
            size="small"
            onClick={() => router.push("/zap/create")}
            className="gap-2 shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Zap</span>
          </PrimaryButton>
        </div>

        {/* Metric Cards Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Zaps
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : zaps.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Webhooks
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Radio className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading ? "..." : zaps.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Average Actions
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Sliders className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {loading
                ? "..."
                : zaps.length === 0
                ? "0"
                : (
                    zaps.reduce((acc, z) => acc + (z.actions?.length || 0), 0) /
                    zaps.length
                  ).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs"
            />
          </div>

          <p className="text-xs font-semibold text-slate-500">
            Showing {filteredZaps.length} of {zaps.length} automations
          </p>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="space-y-4">
            <ZapCardSkeleton />
            <ZapCardSkeleton />
            <ZapCardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load your workflows"
            message={error}
            onRetry={fetchZaps}
          />
        ) : zaps.length === 0 ? (
          <EmptyState
            title="No workflows created yet"
            description="Automate repetitive tasks in seconds. Create your first Zap to connect your favorite triggers and actions."
            actionLabel="Create your first Zap"
            onAction={() => router.push("/zap/create")}
          />
        ) : filteredZaps.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-base font-bold text-slate-800">
              No matching workflows found
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search keyword &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredZaps.map((z) => {
              const webhookUrl = `${HOOKS_URL}/hooks/catch/${user?.id || "1"}/${z.id}`;
              return (
                <div
                  key={z.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Visual Flow Indicator */}
                    <div className="flex items-center gap-3">
                      {/* Trigger Icon */}
                      <div className="flex items-center gap-2">
                        <div
                          title={`Trigger: ${z.trigger?.type?.name || "Webhook"}`}
                          className="relative h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center shadow-2xs"
                        >
                          {z.trigger?.type?.image ? (
                            <Image
                              src={z.trigger.type.image}
                              alt={z.trigger.type.name}
                              width={32}
                              height={32}
                              unoptimized
                              className="object-contain rounded-md"
                            />
                          ) : (
                            <Zap className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                          {z.trigger?.type?.name || "Trigger"}
                        </span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

                      {/* Actions Sequence */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {z.actions.map((act, index) => (
                          <div key={act.id} className="flex items-center gap-2">
                            <div
                              title={`Action: ${act.type?.name || "Action"}`}
                              className="relative h-11 w-11 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center shadow-2xs"
                            >
                              {act.type?.image ? (
                                <Image
                                  src={act.type.image}
                                  alt={act.type.name}
                                  width={32}
                                  height={32}
                                  unoptimized
                                  className="object-contain rounded-md"
                                />
                              ) : (
                                <span className="text-xs font-bold text-slate-600">
                                  #{index + 1}
                                </span>
                              )}
                            </div>
                            {index < z.actions.length - 1 && (
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions and Detail link */}
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => router.push(`/zap/${z.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800 transition-colors shadow-2xs"
                      >
                        <span>Inspect Flow</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata and Webhook Row */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span>
                        <strong className="text-slate-700">Zap ID:</strong>{" "}
                        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-800 font-mono">
                          {z.id}
                        </code>
                      </span>
                      <span>
                        <strong className="text-slate-700">Status:</strong>{" "}
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      </span>
                    </div>

                    {/* Webhook copy control */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                      <span className="font-mono text-[11px] text-slate-600 truncate max-w-[240px] sm:max-w-xs">
                        {webhookUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyWebhook(z.id)}
                        className="p-1 text-slate-500 hover:text-orange-600 rounded transition-colors"
                        title="Copy Webhook URL"
                        aria-label="Copy Webhook URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
