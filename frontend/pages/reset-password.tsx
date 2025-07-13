"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Head from "next/head";

export default function ResetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email");
    }
    try {
      const { data } = await api.post("/api/auth/verify-email", { email });
      if (data.exists) {
        setVerified(true);
        toast.success("Email verified. You may now reset your password.");
      } else {
        toast.error("No account found with that email");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      await api.post("/api/auth/reset-password", {
        email,
        newPassword,
      });
      toast.success("Password has been reset");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  }

  return (
    <>
      <Head>
        <title>Reset Password - MermaidGenie</title>
        <meta name="description" content="Reset your MermaidGenie password" />
      </Head>
      <section className="flex w-full justify-center">
        <Card className="w-full sm:max-w-md p-8 animate-in fade-in duration-300">
          {!verified ? (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold">Verify Email</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your email to verify your account.
                </p>
              </div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button className="w-full">Verify Email</Button>
              <p className="text-xs text-center text-muted-foreground">
                Remembered your password?{" "}
                <Link href="/login" className="underline hover:text-primary">
                  Login
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold">Reset Password</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your new password below.
                </p>
              </div>
              <Input type="email" placeholder="Email" value={email} disabled />
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="New password"
                  className="pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPw2 ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw2(!showPw2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button className="w-full">Reset Password</Button>
              <p className="text-xs text-center text-muted-foreground">
                Go back to{" "}
                <Link href="/login" className="underline hover:text-primary">
                  Login
                </Link>
              </p>
            </form>
          )}
        </Card>
      </section>
    </>
  );
}
