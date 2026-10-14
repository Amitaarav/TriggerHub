"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { Feature } from "./Feature";
import { KnowTrigger } from "./KnowTrigger";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const isLoggedIn = !!token && !!user;

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-6">
          <span>Event-Driven Microservices Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Automate as fast as <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
            you can think
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl font-normal text-slate-600 max-w-2xl mx-auto leading-relaxed">
          TriggerHub gives you automation superpowers. Connect webhooks, stream
          with Kafka, and execute Solana transfers and emails reliably with
          zero boilerplate.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isLoggedIn ? (
            <PrimaryButton
              onClick={() => router.push("/dashboard")}
              size="big"
              className="gap-2 shadow-orange-500/25"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={() => router.push("/signup")}
              size="big"
              className="gap-2 shadow-orange-500/25"
            >
              <span>Get Started free</span>
              <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          )}

          <SecondaryButton
            onClick={() => router.push(isLoggedIn ? "/zap/create" : "/login")}
            size="big"
          >
            {isLoggedIn ? "Create Workflow" : "Explore Demo"}
          </SecondaryButton>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-600">
          <Feature title="Free Forever" subtitle="for core features" />
          <Feature title="Kafka-Backed" subtitle="resilient event pipeline" />
          <Feature title="Transactional Outbox" subtitle="guaranteed delivery" />
        </div>
      </div>

      <div className="mt-16 max-w-6xl mx-auto px-4 sm:px-6">
        <KnowTrigger />
      </div>
    </div>
  );
};