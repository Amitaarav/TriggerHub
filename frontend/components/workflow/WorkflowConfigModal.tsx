"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ArrowLeft, Check, Mail, Coins } from "lucide-react";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";

export interface ConfigSelectionResult {
  id: string;
  name: string;
  image?: string;
  metadata?: Record<string, unknown>;
}

interface WorkflowConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: ConfigSelectionResult) => void;
  isTrigger: boolean;
  stepNumber: number;
  availableItems: {
    id: string;
    name: string;
    image: string;
  }[];
  initialActionId?: string;
  initialMetadata?: Record<string, unknown> | null;
}

export const WorkflowConfigModal = ({
  isOpen,
  onClose,
  onSelect,
  isTrigger,
  stepNumber,
  availableItems,
  initialActionId,
  initialMetadata,
}: WorkflowConfigModalProps) => {
  const [step, setStep] = useState<0 | 1>(0);
  const [selectedActionItem, setSelectedActionItem] = useState<{
    id: string;
    name: string;
    image?: string;
  } | null>(null);

  // Email form state
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [emailError, setEmailError] = useState("");

  // Solana form state
  const [solanaAddress, setSolanaAddress] = useState("");
  const [solanaAmount, setSolanaAmount] = useState("");
  const [solanaError, setSolanaError] = useState("");

  // Reset or load initial data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (!isTrigger && initialActionId) {
      const match = availableItems.find((item) => item.id === initialActionId);
      if (match) {
        setSelectedActionItem(match);
        setStep(1);
        if (initialMetadata) {
          if (initialMetadata.email) setEmail(String(initialMetadata.email));
          if (initialMetadata.body) setBody(String(initialMetadata.body));
          if (initialMetadata.address) setSolanaAddress(String(initialMetadata.address));
          if (initialMetadata.amount) setSolanaAmount(String(initialMetadata.amount));
        }
        return;
      }
    }

    setStep(0);
    setSelectedActionItem(null);
    setEmail("");
    setBody("");
    setEmailError("");
    setSolanaAddress("");
    setSolanaAmount("");
    setSolanaError("");
  }, [isOpen, isTrigger, initialActionId, initialMetadata, availableItems]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectTriggerOrAction = (item: { id: string; name: string; image: string }) => {
    if (isTrigger) {
      onSelect({
        id: item.id,
        name: item.name,
        image: item.image,
        metadata: {},
      });
      onClose();
    } else {
      setSelectedActionItem(item);
      setStep(1);
    }
  };

  const handleEmailSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    const cleanBody = body.trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailError("Please enter a valid recipient email address.");
      return;
    }
    if (!cleanBody) {
      setEmailError("Please provide content for the email body.");
      return;
    }

    setEmailError("");
    if (selectedActionItem) {
      onSelect({
        id: selectedActionItem.id,
        name: selectedActionItem.name,
        image: selectedActionItem.image,
        metadata: {
          email: cleanEmail,
          body: cleanBody,
        },
      });
      onClose();
    }
  };

  const handleSolanaSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanAddress = solanaAddress.trim();
    const cleanAmount = solanaAmount.trim();
    const numAmount = Number(cleanAmount);

    if (!cleanAddress || cleanAddress.length < 20) {
      setSolanaError("Please enter a valid Solana wallet address (Base58).");
      return;
    }
    if (!cleanAmount || !Number.isFinite(numAmount) || numAmount <= 0) {
      setSolanaError("Amount must be a positive number of SOL (e.g. 0.05).");
      return;
    }

    setSolanaError("");
    if (selectedActionItem) {
      onSelect({
        id: selectedActionItem.id,
        name: selectedActionItem.name,
        image: selectedActionItem.image,
        metadata: {
          address: cleanAddress,
          amount: cleanAmount,
        },
      });
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors mr-1"
                aria-label="Back to service selection"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 id="modal-headline" className="text-lg font-bold text-slate-900">
                {isTrigger
                  ? `Select Trigger (Step ${stepNumber})`
                  : step === 0
                  ? `Select Action (Step ${stepNumber})`
                  : `Configure ${selectedActionItem?.name || "Action"}`}
              </h3>
              <p className="text-xs text-slate-500">
                {isTrigger
                  ? "Choose what event starts this workflow"
                  : step === 0
                  ? "Choose the app to execute next"
                  : "Set parameters for this action step"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 0 ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {availableItems.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">
                  Loading available {isTrigger ? "triggers" : "actions"}...
                </div>
              ) : (
                availableItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTriggerOrAction(item)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3.5 text-left transition-all hover:border-orange-500 hover:bg-orange-50/30 hover:shadow-sm group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-white p-1 flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={32}
                          height={32}
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-orange-950">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isTrigger ? "Event listener trigger" : "Automated action execution"}
                        </p>
                      </div>
                    </div>
                    <div className="h-6 w-6 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div>
              {/* Form for Email Action */}
              {selectedActionItem?.id === "send-email" ||
              selectedActionItem?.name.toLowerCase().includes("email") ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <span>Send Email Configuration</span>
                  </div>

                  <Input
                    label="Recipient Email Address"
                    placeholder="recipient@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    required
                  />

                  <div>
                    <label className="text-sm font-medium text-slate-700 block pb-1.5 pt-2">
                      <span className="text-orange-600 font-bold mr-1">*</span>
                      Email Body Content
                    </label>
                    <textarea
                      rows={4}
                      value={body}
                      onChange={(e) => {
                        setBody(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      placeholder="Write the message to send when this step executes..."
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      required
                    />
                  </div>

                  {emailError && (
                    <p role="alert" className="text-xs font-semibold text-red-600">
                      {emailError}
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Back
                    </button>
                    <PrimaryButton type="submit">Save Step</PrimaryButton>
                  </div>
                </form>
              ) : selectedActionItem?.id === "send-solana" ||
                selectedActionItem?.name.toLowerCase().includes("solana") ? (
                <form onSubmit={handleSolanaSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    <Coins className="w-4 h-4 text-orange-600" />
                    <span>Send Solana Configuration</span>
                  </div>

                  <Input
                    label="Recipient Public Wallet Address"
                    placeholder="e.g. 7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"
                    type="text"
                    value={solanaAddress}
                    onChange={(e) => {
                      setSolanaAddress(e.target.value);
                      if (solanaError) setSolanaError("");
                    }}
                    required
                  />

                  <Input
                    label="Amount in SOL"
                    placeholder="0.1"
                    type="number"
                    value={solanaAmount}
                    onChange={(e) => {
                      setSolanaAmount(e.target.value);
                      if (solanaError) setSolanaError("");
                    }}
                    required
                  />

                  {solanaError && (
                    <p role="alert" className="text-xs font-semibold text-red-600">
                      {solanaError}
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Back
                    </button>
                    <PrimaryButton type="submit">Save Step</PrimaryButton>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    No additional parameter configuration required for this action.
                  </p>
                  <div className="flex justify-end gap-2 pt-3">
                    <PrimaryButton
                      onClick={() => {
                        if (selectedActionItem) {
                          onSelect({
                            id: selectedActionItem.id,
                            name: selectedActionItem.name,
                            image: selectedActionItem.image,
                            metadata: {},
                          });
                          onClose();
                        }
                      }}
                    >
                      Confirm Step
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
