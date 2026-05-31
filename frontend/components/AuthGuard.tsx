"use client";
import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { consumeIntentionalLogout } from "@/lib/authFlow";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // If the user just logged out, the Navbar already showed "Logged out";
      // don't stack a second toast on top of it. The shared id also collapses
      // any double-invoke (e.g. React StrictMode) into a single toast.
      if (!consumeIntentionalLogout()) {
        toast.error("Please login first", { id: "auth-status" });
      }
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user)
    return (
      <div className="flex w-full justify-center py-24">
        <LoaderCircle className="animate-spin text-primary" size={32} />
      </div>
    );

  return <>{children}</>;
}
