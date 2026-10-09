"use client";

import Link from "next/link";
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

const SignUpPage = () => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const { data: resData, error } = await signUp.email({
      name: String(data.name),
      email: String(data.email),
      password: String(data.password),
    });

    if (error) {
      console.error("Sign up failed:", error);
      return;
    }

    console.log("Sign up successful:", resData);
  };

  const handleGoggleSignIn = async () => {
    const resData = await signIn.social({
      provider: "google",
    });

    console.log("after google sign in", resData);
  };

  const handleGitSignIn = async () => {
    const resData = await signIn.social({
      provider: "github",
    });

    console.log("after github sign in", resData);
  };

  return (
    <main className="flex min-h-[580px] flex-col items-center bg-[#f0f5ef] px-4 py-10 sm:min-h-[620px] sm:py-12">
      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#202820] sm:text-3xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          বিনা ঝামেলায় সাইন আপ করে সব বিস্তারিত দাম দেখুন
        </p>
      </div>

      {/* Sign up form card */}
      <div className="w-full max-w-md rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-5 shadow-sm sm:p-7">
        <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) {
                return "নাম কমপক্ষে ৩ অক্ষরের হতে হবে";
              }
              return null;
            }}
          >
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              নাম
            </Label>

            <Input
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none transition focus:border-green-600"
              placeholder="যেমন: রহিম উদ্দিন"
            />

            <FieldError className="mt-1 text-xs text-red-600" />
          </TextField>

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

          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
              }

              if (!/[A-Z]/.test(value)) {
                return "অন্তত একটি বড় হাতের অক্ষর দিন";
              }

              if (!/[0-9]/.test(value)) {
                return "অন্তত একটি সংখ্যা দিন";
              }

              return null;
            }}
          >
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              পাসওয়ার্ড
            </Label>

            <Input
              type="password"
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none transition focus:border-green-600"
              placeholder="কমপক্ষে ৮ অক্ষর"
            />

            <Description className="mt-1 text-xs text-gray-500">
              কমপক্ষে ৮ অক্ষর, একটি বড় হাতের অক্ষর ও একটি সংখ্যা দিন
            </Description>

            <FieldError className="mt-1 text-xs text-red-600" />
          </TextField>

          {/* Confirm password — visual field from the design */}
          <TextField isRequired name="confirmPassword">
            <Label className="mb-1 block text-sm font-medium text-[#293329]">
              পাসওয়ার্ড নিশ্চিত করুন
            </Label>

            <Input
              type="password"
              className="h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fbfcfa] px-3 text-sm outline-none transition focus:border-green-600"
              placeholder="আবার লিখুন"
            />
          </TextField>

          {/* Main action */}
          <Button
            type="submit"
            className="mt-1 h-11 w-full rounded-lg bg-[#078b45] text-sm font-semibold text-white shadow-sm transition hover:bg-[#06783c]"
          >
            অ্যাকাউন্ট তৈরি করুন
          </Button>
        </Form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e0e6df]" />
          <span className="text-xs text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-[#e0e6df]" />
        </div>

        {/* Social sign in */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            onPress={handleGoggleSignIn}
            className="h-10 rounded-lg border border-[#e1e8df] bg-white px-3 text-sm font-medium text-[#293329] transition hover:bg-gray-50"
          >
            <span className="mr-2 font-bold text-[#4285F4]">G</span>
            Google দিয়ে চালিয়ে যান
          </Button>

          <Button
            type="button"
            onPress={handleGitSignIn}
            className="h-10 rounded-lg border border-[#e1e8df] bg-white px-3 text-sm font-medium text-[#293329] transition hover:bg-gray-50"
          >
            <span className="mr-2 font-bold">●</span>
            GitHub দিয়ে চালিয়ে যান
          </Button>
        </div>

        {/* Sign in link */}
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

      {/* Home link */}
      <Link
        href="/"
        className="mt-5 text-sm text-gray-500 transition hover:text-[#078b45]"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
};

export default SignUpPage;
