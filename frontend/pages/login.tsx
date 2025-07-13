"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Head from "next/head";
import { Eye, EyeOff, Mail } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", {
        email,
        password: pw,
      });
      localStorage.setItem("token", data.token);
      toast.success("Logged in");
      router.push("/charts");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Authentication failed");
    }
  }

  return (
    <>
      <Head>
        <title>Login - MermaidGenie</title>
        <meta name="description" content="Login to your MermaidGenie account" />
      </Head>
      <section className="flex w-full justify-center">
        <Card className="w-full sm:max-w-md p-8 animate-in fade-in duration-300">
          <form onSubmit={submit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Login</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Welcome back! Please sign in.
              </p>
            </div>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="email"
                placeholder="Email"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="Password"
                className="pr-10"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button className="w-full group">Sign in</Button>

            <p className="text-xs text-center text-muted-foreground">
              No account?{" "}
              <Link href="/register" className="underline hover:text-primary">
                Register here
              </Link>
            </p>
          </form>
        </Card>
      </section>
    </>
  );
}
