"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Head from "next/head";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    bio: "",
    avatarUrl: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const up = (k: keyof typeof form, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      const { data } = await api.post("/api/auth/register", payload);
      localStorage.setItem("token", data.token);
      toast.success("Account created");
      router.push("/charts");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Register - MermaidGenie</title>
        <meta name="description" content="Create your MermaidGenie account" />
      </Head>
      <section className="flex w-full justify-center">
        <Card className="w-full sm:max-w-md p-8 animate-in fade-in duration-300">
          <form onSubmit={submit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Register</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Create your MermaidGenie account.
              </p>
            </div>

            <Input
              placeholder="Name"
              onChange={(e) => up("name", e.target.value)}
              required
              disabled={loading}
            />
            <Input
              type="email"
              placeholder="Email"
              onChange={(e) => up("email", e.target.value)}
              required
              disabled={loading}
            />

            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                className="pr-10"
                onChange={(e) => up("password", e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                disabled={loading}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showPw2 ? "text" : "password"}
                placeholder="Confirm password"
                className="pr-10"
                onChange={(e) => up("confirm", e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPw2(!showPw2)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                disabled={loading}
              >
                {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Input
              placeholder="Bio (optional)"
              onChange={(e) => up("bio", e.target.value)}
              disabled={loading}
            />
            <Input
              placeholder="Avatar URL (optional)"
              type="url"
              onChange={(e) => up("avatarUrl", e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Already registered?{" "}
              <Link href="/login" className="underline hover:text-primary">
                Login
              </Link>
            </p>
          </form>
        </Card>
      </section>
    </>
  );
}
