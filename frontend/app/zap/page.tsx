"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ZapIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/zap/create");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="text-sm font-semibold text-slate-500 animate-pulse">
        Opening Workflow Editor...
      </div>
    </div>
  );
}
