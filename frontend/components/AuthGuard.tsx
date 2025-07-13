"use client";
import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login first");
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
