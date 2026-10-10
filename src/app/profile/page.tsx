"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth-client";
import { authState, useRequireAuth } from "@/lib/use-require-auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isPending } = useRequireAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    authState.signingOut = true;
    setSigningOut(true);

    const { error } = await signOut();

    setSigningOut(false);

    if (error) {
      authState.signingOut = false;
      toast.error(error.message || "সাইন আউট করা যায়নি");
      return;
    }

    toast.success("সাইন আউট সফল হয়েছে");
    router.replace("/");
  }

  // Session লোড হচ্ছে বা user নেই
  if (isPending || !user) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5ef] px-4 py-12">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-gray-200" />
          <div className="h-36 rounded-xl bg-gray-200" />
        </div>
      </main>
    );
  }

  const firstLetter = (user.name || "ব").charAt(0).toUpperCase();

  return (
    <main className="min-h-[70vh] bg-[#f0f5ef] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#202820] sm:text-3xl">
            আমার প্রোফাইল
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
          </p>
        </div>

        {/* Account card */}
        <section className="mb-6 rounded-xl border border-[#e2e9e1] bg-[#fbfcfa] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
                {firstLetter}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-[#202820]">
                  {user.name || "ব্যবহারকারী"}
                </h2>
                <p className="mt-1 break-all text-sm text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="shrink-0 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {signingOut ? "সাইন আউট হচ্ছে..." : "↩ সাইন আউট"}
            </button>
          </div>
        </section>

        {/* Info card */}
        <section className="rounded-xl border border-[#e2e9e1] bg-[#fbfcfa] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#202820]">তথ্য</h2>
              <p className="mt-1 text-sm text-gray-500">
                নাম:{" "}
                <span className="font-medium text-[#202820]">
                  {user.name || "—"}
                </span>
              </p>
            </div>

            <Link
              href="/profile/update"
              className="shrink-0 rounded-lg bg-[#07883f] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#067536]"
            >
              তথ্য আপডেট করুন
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
