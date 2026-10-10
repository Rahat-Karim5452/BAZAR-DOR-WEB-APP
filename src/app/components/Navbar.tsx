"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types";
import Logo from "../../../public/logo-icon.png";
import UserProfileMenu from "./UserProfileMenu";

function getBangladeshDate() {
  return new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });
}
function TodayDate() {
  return <>{getBangladeshDate()}</>;
}

function CategoryLinks({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  const activeSlug = pathname.startsWith("/category/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : "";

  return (
    <>
      {categories.map((category) => {
        const isActive = category.slug === activeSlug;

        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-green-700 sm:px-3 sm:text-sm ${
              isActive
                ? "border-green-700 bg-green-700 font-semibold text-white shadow-sm hover:bg-green-800"
                : "border-transparent text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-800 hover:shadow-sm"
            }`}
          >
            <span aria-hidden="true" className="text-sm">
              {category.icon}
            </span>
            <span>{category.nameBn}</span>
          </Link>
        );
      })}
    </>
  );
}

function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;

    getCategories()
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <nav
      aria-label="পণ্যের ক্যাটাগরি"
      className="mx-auto flex min-h-9 max-w-7xl items-center gap-1 overflow-x-auto px-3 py-1 sm:gap-2 sm:px-6 sm:py-1.5"
    >
      <Suspense fallback={null}>
        <CategoryLinks categories={categories} />
      </Suspense>
    </nav>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 shadow-sm backdrop-blur">
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
              <Suspense fallback={null}>
                <TodayDate />
              </Suspense>
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center">
          <UserProfileMenu />
        </div>
      </div>

      <div className="border-t border-gray-100">
        <CategoryNav />
      </div>
    </header>
  );
}
