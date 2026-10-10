"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { safeCallbackUrl } from "@/lib/utils";
import SocialAuthButtons from "../components/SocialAuthButtons";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-lg border border-[#d9e0d7] bg-white px-4 py-3 text-sm text-[#202820] outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = safeCallbackUrl(searchParams.get("callbackURL"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  function showError(message: string) {
    setFormError(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const trimmedEmail = email.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      showError("সঠিক ইমেইল ঠিকানা দিন");
      return;
    }

    if (!password) {
      showError("পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);

    const { error } = await signIn.email({
      email: trimmedEmail,
      password,
      rememberMe: true,
    });

    setLoading(false);

    if (error) {
      showError(
        error.status === 401
          ? "ইমেইল বা পাসওয়ার্ড সঠিক নয়"
          : error.message || "সাইন ইন করা যায়নি",
      );
      return;
    }

    toast.success("সাইন ইন সফল হয়েছে");
    router.replace(callbackURL);
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-6 shadow-sm sm:p-8">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#202820]"
          >
            ইমেইল
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#202820]"
          >
            পাসওয়ার্ড
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="পাসওয়ার্ড লিখুন"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#07883f] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#067536] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-500">অথবা</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <SocialAuthButtons callbackURL={callbackURL} />

      <p className="mt-6 text-center text-sm text-gray-600">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/signup"
          className="font-semibold text-green-700 hover:underline"
        >
          সাইন আপ করুন
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center bg-[#f0f5ef] px-4 py-10 sm:py-14">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold text-[#202820] sm:text-3xl">
          সাইন ইন
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-white" />
        }
      >
        <SignInForm />
      </Suspense>

      <Link
        href="/"
        className="mt-6 text-sm text-gray-500 hover:text-green-700"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
