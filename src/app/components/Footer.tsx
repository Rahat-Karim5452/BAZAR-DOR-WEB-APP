"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
        {/* Left Side */}
        <p className="text-center text-sm font-semibold text-gray-800 sm:text-left">
          বাজার দর - প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        {/* Right Side */}
        <p className="text-center text-xs leading-5 text-gray-500 sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
