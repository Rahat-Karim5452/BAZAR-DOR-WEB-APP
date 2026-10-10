"use client";

import Image from "next/image";
import Hero from "../../../public/bazar-hero.png";

export default function HeroSection() {
  const today = new Date().toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  return (
    <section className="bg-[#f0f5ef] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 rounded-2xl border border-[#e5eae3] bg-[#fbfcfa] px-5 py-6 shadow-sm sm:px-8 md:grid-cols-[1.5fr_0.8fr] md:px-10 md:py-8">
        <div>
          <span className="inline-flex rounded-full bg-[#e4f2e5] px-3 py-1 text-xs font-medium text-green-800">
            {today}
          </span>

          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#202820] sm:text-3xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#697168] sm:text-[15px]">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার বাজারদর — প্রতিদিনের
            প্রয়োজনীয় পণ্যের সর্বশেষ দাম, বাজারভিত্তিক তুলনা এবং দামের
            পরিবর্তন জানুন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#07883f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#067536]"
          >
            সব পণ্য দেখুন
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="relative flex min-h-[180px] items-center justify-center md:min-h-[220px]">
          <Image
            src={Hero}
            alt="তাজা বাজারের পণ্যের ঝুড়ি"
            width={360}
            height={300}
            priority
            className="h-auto max-h-[220px] w-full max-w-[300px] object-contain sm:max-h-[260px]"
          />
        </div>
      </div>
    </section>
  );
}
