"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  // Keep the requested page after sign in.
  const getCallbackURL = () => {
    const callbackURL = searchParams.get("callbackURL");

    // Only allow internal paths to prevent external redirects.
    if (
      callbackURL &&
      callbackURL.startsWith("/") &&
      !callbackURL.startsWith("//")
    ) {
      return callbackURL;
    }

    return "/";
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsLoading(true);
    const toastId = toast.loading("সাইন ইন হচ্ছে...");

    try {
      const { error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়", {
          id: toastId,
        });
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!", {
        id: toastId,
      });

      router.replace(getCallbackURL());
      router.refresh();
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করো।", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const toastId = toast.loading("Google দিয়ে সাইন ইন হচ্ছে...");

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: getCallbackURL(),
      });

      if (error) {
        toast.error(error.message || "Google সাইন ইন ব্যর্থ হয়েছে", {
          id: toastId,
        });
        return;
      }

      toast.dismiss(toastId);
    } catch {
      toast.error("Google দিয়ে সাইন ইন করা যায়নি", {
        id: toastId,
      });
    }
  };

  const handleGitHubSignIn = async () => {
    const toastId = toast.loading("GitHub দিয়ে সাইন ইন হচ্ছে...");

    try {
      const { error } = await signIn.social({
        provider: "github",
        callbackURL: getCallbackURL(),
      });

      if (error) {
        toast.error(error.message || "GitHub সাইন ইন ব্যর্থ হয়েছে", {
          id: toastId,
        });
        return;
      }

      toast.dismiss(toastId);
    } catch {
      toast.error("GitHub দিয়ে সাইন ইন করা যায়নি", {
        id: toastId,
      });
    }
  };

  return (
    <main className="flex min-h-[580px] flex-1 flex-col items-center bg-[#f0f5ef] px-4 py-10 sm:min-h-[620px] sm:py-12">
      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#202820] sm:text-3xl">
          আবার স্বাগতম
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          সাইন ইন করে নিত্যপ্রয়োজনীয় পণ্যের দাম দেখুন
        </p>
      </div>

      {/* Sign in card */}
      <div className="w-full max-w-md rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-5 shadow-sm sm:p-7">
        <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "সঠিক ইমেইল ঠিকানা লিখুন";
              }

              return null;
            }}
          >
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              ইমেইল
            </Label>

            <Input
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none transition focus:border-green-600"
              placeholder="you@example.com"
            />

            <FieldError className="mt-1 text-xs text-red-600" />
          </TextField>

          <TextField isRequired name="password">
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              পাসওয়ার্ড
            </Label>

            <Input
              type="password"
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none transition focus:border-green-600"
              placeholder="তোমার পাসওয়ার্ড লিখুন"
            />

            <FieldError className="mt-1 text-xs text-red-600" />
          </TextField>

          <Button
            type="submit"
            isDisabled={isLoading}
            className="mt-1 h-11 w-full rounded-lg bg-[#078b45] text-sm font-semibold text-white shadow-sm transition hover:bg-[#06783c] disabled:opacity-60"
          >
            {isLoading ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
          </Button>
        </Form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e0e6df]" />
          <span className="text-xs text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-[#e0e6df]" />
        </div>

        {/* Social login */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            onPress={handleGoogleSignIn}
            className="h-10 rounded-lg border border-[#e1e8df] bg-white px-3 text-sm font-medium text-[#293329] transition hover:bg-gray-50"
          >
            <span className="mr-2 font-bold text-[#4285F4]">G</span>
            Google দিয়ে চালিয়ে যান
          </Button>

          <Button
            type="button"
            onPress={handleGitHubSignIn}
            className="h-10 rounded-lg border border-[#e1e8df] bg-white px-3 text-sm font-medium text-[#293329] transition hover:bg-gray-50"
          >
            <span className="mr-2 font-bold">●</span>
            GitHub দিয়ে চালিয়ে যান
          </Button>
        </div>

        {/* Signup link */}
        <p className="mt-5 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#078b45] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      {/* Home link */}
      <Link
        href="/"
        className="mt-5 text-sm text-gray-500 transition hover:text-[#078b45]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
