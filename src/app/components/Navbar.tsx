"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types";
import Logo from "../../../public/logo-icon.png";

function getBangladeshDate() {
  return new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });
}

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;

    getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 shadow-sm backdrop-blur">
      {/* Compact Logo and Auth Section */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-1.5 sm:px-6 sm:py-2">
        <Link
          href="/"
          aria-label="বাজার দর হোম"
          className="flex min-w-0 items-center gap-2"
        >
          <div className="relative h-9 w-9 shrink-0 sm:h-11 sm:w-11">
            <Image
              src={Logo}
              alt="বাজার দর লোগো"
              fill
              priority
              sizes="44px"
              className="object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-extrabold leading-tight text-green-800 sm:text-xl">
              বাজার দর
            </h1>

            <p className="mt-0.5 text-[9px] leading-tight text-gray-500 sm:text-[11px]">
              {getBangladeshDate()}
            </p>
          </div>
        </Link>

        {/* Sign In and Sign Up */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/signin"
            className="rounded-md px-2 py-1.5 text-xs font-semibold text-green-800 transition-colors hover:bg-green-50 hover:text-green-950 focus-visible:outline-2 focus-visible:outline-green-700 sm:px-3 sm:text-sm"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-md bg-green-700 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-800 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:px-4 sm:text-sm"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      {/* Compact Category Navigation */}
      <div className="border-t border-gray-100">
        <nav
          aria-label="পণ্যের ক্যাটাগরি"
          className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-3 py-1 sm:gap-2 sm:px-6 sm:py-1.5"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-green-200 hover:bg-green-50 hover:text-green-800 hover:shadow-sm active:scale-95 focus-visible:outline-2 focus-visible:outline-green-700 sm:px-3 sm:text-sm"
            >
              <span aria-hidden="true" className="text-sm">
                {category.icon}
              </span>

              <span>{category.nameBn}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
