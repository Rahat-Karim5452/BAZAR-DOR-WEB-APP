import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5ef] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] px-6 py-10 text-center shadow-sm">
        <div className="text-5xl">🔎</div>

        <h1 className="mt-4 text-xl font-bold text-[#202820]">
          পেজটি পাওয়া যায়নি
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          আপনি যে ঠিকানায় এসেছেন, সেটি সঠিক নয় বা পেজটি সরিয়ে ফেলা হয়েছে।
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
