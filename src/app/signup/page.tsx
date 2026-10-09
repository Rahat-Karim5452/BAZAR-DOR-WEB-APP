"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

import { signIn, signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (name.length < 3) {
      toast.error("নাম কমপক্ষে ৩ অক্ষরের হতে হবে");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error("পাসওয়ার্ডে একটি বড় হাতের অক্ষর ও একটি সংখ্যা দিন");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        toast.error(
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।",
        );
        return;
      }

      if (data) {
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন।");
        form.reset();

        // Toast দেখানোর জন্য অল্প সময় দিয়ে Sign in page-এ পাঠানো হচ্ছে।
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
      } else {
        toast.error("সাইন আপের ফলাফল নিশ্চিত করা যায়নি। আবার চেষ্টা করুন।");
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      toast.error("সমস্যা হয়েছে। ইন্টারনেট ও সার্ভার সেটিংস পরীক্ষা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (socialLoading) return;

    setSocialLoading(true);

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message ||
            `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন করা যায়নি`,
        );
      }
    } catch (error) {
      console.error(`${provider} sign in failed:`, error);
      toast.error("Social sign-in চালু করা যায়নি। পরে আবার চেষ্টা করুন।");
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <main className="flex min-h-[580px] flex-1 flex-col items-center bg-[#f0f5ef] px-4 py-10 sm:min-h-[620px] sm:py-12">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#202820] sm:text-3xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          বিনা ঝামেলায় সাইন আপ করে পণ্যের বিস্তারিত দাম দেখুন
        </p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-5 shadow-sm sm:p-7">
        <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
          <TextField isRequired name="name">
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              নাম
            </Label>
            <Input
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none focus:border-green-600"
              placeholder="যেমন: রহিম উদ্দিন"
              autoComplete="name"
            />
            <FieldError className="mt-1 text-xs text-red-600" />
          </TextField>

          <TextField isRequired name="email" type="email">
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              ইমেইল
            </Label>
            <Input
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none focus:border-green-600"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <FieldError className="mt-1 text-xs text-red-600" />
          </TextField>

          <TextField isRequired name="password" type="password">
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              পাসওয়ার্ড
            </Label>
            <Input
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none focus:border-green-600"
              placeholder="কমপক্ষে ৮ অক্ষর"
              autoComplete="new-password"
            />
            <Description className="mt-1 text-xs text-gray-500">
              কমপক্ষে ৮ অক্ষর, একটি বড় হাতের অক্ষর ও একটি সংখ্যা দিন
            </Description>
            <FieldError className="mt-1 text-xs text-red-600" />
          </TextField>

          <TextField isRequired name="confirmPassword" type="password">
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              পাসওয়ার্ড নিশ্চিত করুন
            </Label>
            <Input
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none focus:border-green-600"
              placeholder="আবার লিখুন"
              autoComplete="new-password"
            />
            <FieldError className="mt-1 text-xs text-red-600" />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading}
            className="mt-1 h-11 w-full rounded-lg bg-[#078b45] text-sm font-semibold text-white shadow-sm transition hover:bg-[#06783c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </Button>
        </Form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e0e6df]" />
          <span className="text-xs text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-[#e0e6df]" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            isDisabled={socialLoading}
            onPress={() => handleSocialSignIn("google")}
            className="h-10 rounded-lg border border-[#e1e8df] bg-white px-3 text-sm font-medium text-[#293329] hover:bg-gray-50"
          >
            <span className="mr-2 font-bold text-[#4285F4]">G</span>
            Google দিয়ে চালিয়ে যান
          </Button>

          <Button
            type="button"
            isDisabled={socialLoading}
            onPress={() => handleSocialSignIn("github")}
            className="h-10 rounded-lg border border-[#e1e8df] bg-white px-3 text-sm font-medium text-[#293329] hover:bg-gray-50"
          >
            <span className="mr-2 font-bold">●</span>
            GitHub দিয়ে চালিয়ে যান
          </Button>
        </div>

        <p className="mt-5 text-center text-sm text-gray-600">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-medium text-[#078b45] hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="mt-5 text-sm text-gray-500 transition hover:text-[#078b45]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
