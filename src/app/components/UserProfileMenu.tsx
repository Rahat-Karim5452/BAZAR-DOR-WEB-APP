"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/lib/auth-client";
import { authState } from "@/lib/use-require-auth";
import Image from "next/image";

function Avatar({
  src,
  name,
  size,
}: {
  src?: string | null;
  name?: string | null;
  size: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt="প্রোফাইল ছবি"
        referrerPolicy="no-referrer"
        className={`${size} shrink-0 rounded-full border border-gray-200 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800`}
    >
      {(name || "ব").charAt(0).toUpperCase()}
    </div>
  );
}

export default function UserProfileMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    setOpen(false);
    toast.success("সাইন আউট সফল হয়েছে");
    router.replace("/");
  }

  if (isPending) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }
  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex max-w-56 items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#202820] hover:bg-green-50"
      >
        <Avatar src={user.image} name={user.name} size="h-9 w-9" />
        <span className="max-w-28 truncate">{user.name || "ব্যবহারকারী"}</span>
        <span aria-hidden="true" className="text-xs text-gray-500">
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-[100] mt-2 w-64 rounded-2xl border border-[#e2e9e1] bg-white p-3 shadow-lg">
          {/* User info */}
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <Avatar src={user.image} name={user.name} size="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#202820]">
                {user.name || "ব্যবহারকারী"}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Profile link */}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50"
          >
            👤 আমার প্রোফাইল
          </Link>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {signingOut ? "সাইন আউট হচ্ছে..." : "↩ সাইন আউট"}
          </button>
        </div>
      )}
    </div>
  );
}
