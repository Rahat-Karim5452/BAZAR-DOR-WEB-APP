"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut, updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UserProfileMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [dropdown, setDropdown] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;
  const currentName = user?.name || "ব্যবহারকারী";

  // নাম পরিবর্তন
  async function handleSaveName() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("নাম লিখুন");
      return;
    }

    try {
      setSaving(true);

      const result = await updateUser({ name: trimmedName });

      if (result?.error) {
        toast.error(result.error.message || "নাম পরিবর্তন করা যায়নি");
        return;
      }

      toast.success("নাম পরিবর্তন সফল হয়েছে");
      setEditing(false);
      setDropdown(false);
      router.refresh();
    } catch (error) {
      console.error("Name update error:", error);
      toast.error("নাম পরিবর্তন করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  // সাইন আউট
  async function handleSignOut() {
    try {
      setLoggingOut(true);

      const result = await signOut();

      if (result?.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি");
        return;
      }

      setDropdown(false);
      toast.success("সাইন আউট সফল হয়েছে");
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
    } finally {
      setLoggingOut(false);
    }
  }

  if (isPending) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />;
  }

  // Login না করা থাকলে
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDropdown((prev) => !prev)}
        aria-expanded={dropdown}
        aria-haspopup="true"
        className="flex max-w-48 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50"
      >
        <span className="max-w-36 truncate">{currentName}</span>
        <span aria-hidden="true">{dropdown ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown menu */}
      {dropdown && (
        <div className="absolute right-0 z-[100] mt-2 w-60 overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {!editing ? (
            <>
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {currentName}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setName(currentName);
                  setEditing(true);
                }}
                className="w-full rounded-md px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-green-50"
              >
                নাম পরিবর্তন করুন
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={loggingOut}
                className="w-full rounded-md px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                {loggingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
              </button>
            </>
          ) : (
            <div className="p-2">
              <p className="mb-3 text-sm font-semibold text-gray-800">
                নাম পরিবর্তন করুন
              </p>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleSaveName();
                  }
                }}
                placeholder="আপনার নতুন নাম লিখুন"
                maxLength={80}
                autoFocus
                className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  বাতিল করুন
                </button>

                <button
                  type="button"
                  onClick={() => void handleSaveName()}
                  disabled={saving}
                  className="rounded-md bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800 disabled:opacity-50"
                >
                  {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
