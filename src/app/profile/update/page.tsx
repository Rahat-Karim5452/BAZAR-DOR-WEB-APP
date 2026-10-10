"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUser } from "@/lib/auth-client";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, isPending, refetch } = useRequireAuth();
  const [newName, setNewName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const name = newName ?? user?.name ?? "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    setSaving(true);
    const { error } = await updateUser({ name: trimmedName });
    setSaving(false);
    if (error) {
      toast.error(error.message || "নাম আপডেট করা যায়নি");
      return;
    }
    await refetch();
    toast.success("নাম সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
  }

  if (isPending || !user) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5ef] px-4 py-12">
        <div className="mx-auto max-w-md animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-gray-200" />
          <div className="h-48 rounded-xl bg-gray-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f0f5ef] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-md">
        <Link
          href="/profile"
          className="mb-6 inline-block text-sm text-gray-500 hover:text-green-700"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>

        <section className="rounded-xl border border-[#e2e9e1] bg-[#fbfcfa] p-6 shadow-sm">
          <h1 className="text-xl font-bold text-[#202820]">তথ্য আপডেট করুন</h1>
          <p className="mt-1 text-sm text-gray-500">আপনার নাম পরিবর্তন করুন।</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-[#202820]"
              >
                নাম
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                maxLength={80}
                required
                className="w-full rounded-lg border border-[#d9e0d7] bg-white px-4 py-3 text-sm text-[#202820] outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-[#07883f] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#067536] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
