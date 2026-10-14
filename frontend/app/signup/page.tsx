"use client";

import { Appbar } from "@/components/Appbar";
import { useState } from "react";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import axios from "axios";
import { showError, showSuccess, extractErrorMessage } from "@/lib/toast";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters";
    }
    if (!email.trim() || email.trim().length < 5) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username: email.trim(),
        password: password,
        name: name.trim(),
      });

      showSuccess(
        "Account created!",
        "Registration successful. Please sign in with your credentials."
      );
      router.push("/login");
    } catch (err: unknown) {
      const errorMsg = extractErrorMessage(err, "Signup failed. Please try again.");
      setErrors({ form: errorMsg });
      showError("Signup failed", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Appbar />
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
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
              <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
              <p className="text-sm text-slate-500 mt-1">
                Start automating workflows in minutes. No credit card required.
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
                label="Full Name"
                placeholder="Alex Developer"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                type="text"
                error={errors.name}
                required
                autoComplete="name"
              />

              <Input
                label="Email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                type="email"
                error={errors.email}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                type="password"
                error={errors.password}
                required
                autoComplete="new-password"
                helperText="Must contain at least 6 characters"
              />

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  size="big"
                  isLoading={isSubmitting}
                  className="w-full gap-2 shadow-orange-500/20"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Get started free</span>
                </PrimaryButton>
              </div>

              <div className="pt-2 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}