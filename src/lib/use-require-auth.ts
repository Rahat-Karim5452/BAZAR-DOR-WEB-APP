"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
export const authState = { signingOut: false };
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;
  useEffect(() => {
    if (isPending) return;
    if (user || authState.signingOut) return;
    toast.error("এই পেজ দেখতে আগে সাইন ইন করুন।");
    router.replace(`/signin?callbackURL=${encodeURIComponent(pathname)}`);
  }, [isPending, user, pathname, router]);

  return { user, isPending, refetch };
}
