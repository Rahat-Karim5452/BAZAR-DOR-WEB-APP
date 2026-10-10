"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

type Provider = "google" | "github";

export default function SocialAuthButtons({
  callbackURL = "/",
}: {
  callbackURL?: string;
}) {
  const [pending, setPending] = useState<Provider | null>(null);
  async function handleSocial(provider: Provider) {
    setPending(provider);
    const { error } = await signIn.social({ provider, callbackURL });
    if (error) {
      setPending(null);
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন করা যায়নি`,
      );
    }
  }

  const buttonClass =
    "flex items-center justify-center gap-2 rounded-lg border border-[#d9e0d7] bg-white px-3 py-2.5 text-sm font-semibold text-[#202820] transition hover:bg-[#f0f5ef] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => handleSocial("google")}
        className={buttonClass}
      >
        <span
          aria-hidden="true"
          className="text-base font-extrabold text-[#4285F4]"
        >
          G
        </span>
        {pending === "google" ? "অপেক্ষা করুন..." : "Google দিয়ে চালিয়ে যান"}
      </button>

      <button
        type="button"
        disabled={pending !== null}
        onClick={() => handleSocial("github")}
        className={buttonClass}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 text-[#202820]"
          fill="currentColor"
        >
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
        </svg>
        {pending === "github" ? "অপেক্ষা করুন..." : "GitHub দিয়ে চালিয়ে যান"}
      </button>
    </div>
  );
}
