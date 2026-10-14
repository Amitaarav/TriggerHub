"use client";

import { Appbar } from "@/components/Appbar";
import { useState, Suspense } from "react";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import authAxios from "@/utils/authAxios";
import { useRouter, useSearchParams } from "next/navigation";
import { BACKEND_URL } from "../config";
import { useAuth } from "@/context/AuthContext";
import { showError, showSuccess, extractErrorMessage } from "@/lib/toast";
import Link from "next/link";
import { LogIn } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Please enter your email or username";
    }
    if (!password) {
      newErrors.password = "Please enter your password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await authAxios.post(`${BACKEND_URL}/api/v1/user/signin`, {
        username: email.trim(),
        password: password,
      });

      const { token, userExists } = res.data;
      login(token, userExists);

      showSuccess("Welcome back!", `Signed in successfully as ${userExists?.name || email}.`);
      router.push(redirectPath);
    } catch (err: unknown) {
      const errorMsg = extractErrorMessage(err, "Invalid email or password. Please try again.");
      setErrors({ form: errorMsg });
      showError("Login failed", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex pt-4 flex-col md:flex-row items-center justify-center gap-12">
      <div className="flex-1 max-w-md">
        <h1 className="font-extrabold text-3xl md:text-4xl text-slate-900 tracking-tight pb-6 leading-tight">
          Join millions worldwide who automate their work using TriggerHub
        </h1>
        <div className="space-y-4 text-slate-700">
          <CheckFeature label={"Create and manage your own triggers"} />
          <CheckFeature label={"Free forever for core features"} />
          <CheckFeature label={"14-days trial of premium features and apps"} />
        </div>
      </div>

      <div className="flex-1 w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-500 mt-1">
            Build and monitor your automated workflows in real-time.
          </p>
        </div>

        {errors.form && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm font-medium text-red-700"
          >
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Username"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            type="text"
            error={errors.email}
            required
            autoComplete="username"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            type="password"
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <div className="pt-2">
            <PrimaryButton
              type="submit"
              size="big"
              isLoading={isSubmitting}
              className="w-full gap-2 shadow-orange-500/20"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign in</span>
            </PrimaryButton>
          </div>

          <div className="pt-2 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Sign up for free
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Appbar />
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading sign in...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}