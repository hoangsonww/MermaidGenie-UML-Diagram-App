// src/pages/profile.tsx
"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import useUser from "@/hooks/useUser";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileState {
  name: string;
  bio: string;
  avatarUrl: string;
}

function ProfileInner() {
  const { user, mutate } = useUser();
  const [state, setState] = useState<ProfileState>({
    name: "",
    bio: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // Initialize form with existing user data
  useEffect(() => {
    if (user) {
      setState({
        name: user.name || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  // Save updated profile
  async function save() {
    setLoading(true);
    try {
      await api.put(
        "/api/auth/me",
        { ...state },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      toast.success("Profile updated");
      mutate({ ...user, ...state }, false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Update failed",
      );
    } finally {
      setLoading(false);
    }
  }

  // Reset form to saved state
  function resetForm() {
    if (user) {
      setState({
        name: user.name || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }

  const pageTitle = user ? `${user.name}'s Profile` : "Profile";

  return (
    <>
      <Head>
        <title>{pageTitle} - MermaidGenie</title>
        <meta
          name="description"
          content="Update your personal information on MermaidGenie."
        />
      </Head>

      <section className="flex w-full justify-center py-12 px-4">
        <Card className="w-full max-w-3xl space-y-8 p-8 bg-card shadow-lg rounded-lg animate-in fade-in duration-300">
          {/* Avatar + Live Name Preview */}
          <div className="flex flex-col items-center space-y-4 mb-0">
            <Avatar className="w-28 h-28 ring-2 ring-primary">
              <AvatarImage src={state.avatarUrl} alt={state.name} />
              <AvatarFallback>{state.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <p className="text-xl font-semibold">
              {state.name || user?.name || "Your Name"}
            </p>
          </div>

          {/* Member since */}
          {user?.createdAt && (
            <p className="text-center text-sm text-muted-foreground">
              Member since{" "}
              <time dateTime={user.createdAt}>
                {new Date(user.createdAt).toLocaleDateString()}
              </time>
            </p>
          )}

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col">
              <Label htmlFor="name" className="mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={state.name}
                onChange={(e) =>
                  setState((s) => ({ ...s, name: e.target.value }))
                }
              />
            </div>

            {/* Email (read-only) */}
            <div className="flex flex-col">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted/10 cursor-not-allowed"
              />
            </div>

            {/* Bio (full width) */}
            <div className="col-span-full flex flex-col">
              <Label htmlFor="bio" className="mb-2">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="A little about yourself…"
                rows={4}
                value={state.bio}
                onChange={(e) =>
                  setState((s) => ({ ...s, bio: e.target.value }))
                }
              />
            </div>

            {/* Avatar URL (full width) */}
            <div className="col-span-full flex flex-col">
              <Label htmlFor="avatarUrl" className="mb-2">
                Avatar URL
              </Label>
              <Input
                id="avatarUrl"
                placeholder="https://…"
                value={state.avatarUrl}
                onChange={(e) =>
                  setState((s) => ({ ...s, avatarUrl: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Button variant="secondary" onClick={resetForm} disabled={loading}>
              Reset
            </Button>
            <Button onClick={save} disabled={loading}>
              {loading && (
                <Loader2 className="animate-spin mr-2 h-4 w-4 text-primary" />
              )}
              Save Changes
            </Button>
          </div>
        </Card>
      </section>
    </>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileInner />
    </AuthGuard>
  );
}
