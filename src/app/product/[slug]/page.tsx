"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductById, getProducts } from "@/lib/api";
import type { Product } from "@/types";

function bn(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

function PriceChange({ product }: { product: Product }) {
  const direction = product.change?.dir;
  const percentage = product.change?.pct ?? 0;

  return (
    <span
      className={`text-xs font-bold ${
        direction === "up"
          ? "text-red-600"
          : direction === "down"
            ? "text-green-700"
            : "text-gray-500"
      }`}
    >
      {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"}{" "}
      {bn(percentage)}%
    </span>
  );
}

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setNotFound(false);
      setProduct(null);

      try {
        const allProducts = await getProducts();
        const decodedSlug = decodeURIComponent(slug);

        const found = allProducts.find(
          (item) =>
            item.slug === decodedSlug ||
            String(item.id) === decodedSlug ||
            item.nameBn === decodedSlug,
        );

        if (!found) {
          if (!cancelled) setNotFound(true);
          return;
        }

        const details = await getProductById(found.id);

        if (!cancelled) {
          setProduct(details);
        }
      } catch (error) {
        console.error("Failed to load product:", error);

        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const markets = product?.markets ?? [];

  const minimum =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : (product?.today ?? 0);

  const maximum =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : (product?.today ?? 0);

  const average =
    markets.length > 0
      ? markets.reduce(
          (total, market) => total + (market.min + market.max) / 2,
          0,
        ) / markets.length
      : (product?.today ?? 0);

  return (
    <main className="min-h-[70vh] bg-[#f0f5ef] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-gray-600"
        >
          <Link href="/" className="hover:text-green-700">
            হোম
          </Link>
          <span>›</span>

          {product ? (
            <>
              <Link
                href={`/category/${product.category}`}
                className="hover:text-green-700"
              >
                {product.categoryNameBn}
              </Link>
              <span>›</span>
              <span>{product.nameBn}</span>
            </>
          ) : (
            <span>পণ্যের বিবরণ</span>
          )}
        </nav>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-5">
            <div className="h-32 animate-pulse rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa]" />

            <section className="rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-5">
              <div className="mb-5 h-5 w-36 animate-pulse rounded bg-gray-200" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>

              <div className="mt-6 h-56 animate-pulse rounded-xl bg-gray-100" />
            </section>
          </div>
        )}

        {/* Product not found */}
        {!loading && notFound && (
          <section className="rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] px-5 py-12 text-center">
            <div className="text-4xl">🔎</div>

            <h1 className="mt-3 text-xl font-bold text-[#202820]">
              পণ্যটি পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              পণ্যের তথ্য পাওয়া যায়নি। হোম পেজ থেকে আবার চেষ্টা করো।
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            >
              হোম পেজে ফিরে যান
            </Link>
          </section>
        )}

        {!loading && product && (
          <>
            {/* Product summary */}
            <section className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-4 sm:gap-5 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#eff4ed] text-3xl sm:h-16 sm:w-16 sm:text-4xl">
                  {product.image || product.categoryIcon || "🛒"}
                </div>

                <div className="min-w-0">
                  <h1 className="text-lg font-extrabold leading-tight text-[#202820] sm:text-2xl">
                    {product.nameBn}
                  </h1>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    প্রতি {product.unit} · {product.categoryNameBn}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-600 sm:text-sm">
                    গতকালের তুলনায় আজকের দাম{" "}
                    {product.today > product.yesterday
                      ? `বেড়েছে ${bn(product.today - product.yesterday)} টাকা`
                      : product.today < product.yesterday
                        ? `কমেছে ${bn(product.yesterday - product.today)} টাকা`
                        : "অপরিবর্তিত আছে"}
                  </p>
                </div>
              </div>

              <div className="w-[88px] shrink-0 rounded-xl bg-[#f0f5ef] px-2 py-3 text-center sm:w-28 sm:px-3 sm:py-4">
                <p className="text-[10px] text-gray-500 sm:text-xs">
                  আজকের দাম
                </p>

                <p className="mt-1 text-2xl font-extrabold leading-none text-[#202820] sm:text-3xl">
                  {bn(product.today)}
                </p>

                <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                  টাকা / {product.unit}
                </p>

                <div className="mt-1">
                  <PriceChange product={product} />
                </div>
              </div>
            </section>

            {/* Price summary */}
            <section className="rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-4 sm:p-5 md:p-6">
              <h2 className="mb-4 text-base font-bold text-[#202820]">
                দামের সারসংক্ষেপ
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#e2e9e1] p-4">
                  <p className="text-xs text-gray-600">সর্বনিম্ন দাম</p>
                  <p className="mt-1 text-xl font-extrabold text-green-700">
                    {bn(minimum)}{" "}
                    <span className="text-xs font-normal">টাকা</span>
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    সর্বনিম্ন দামের বাজার
                  </p>
                </div>

                <div className="rounded-xl border border-[#e2e9e1] p-4">
                  <p className="text-xs text-gray-600">সর্বাধিক দাম</p>
                  <p className="mt-1 text-xl font-extrabold text-red-600">
                    {bn(maximum)}{" "}
                    <span className="text-xs font-normal">টাকা</span>
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    সর্বোচ্চ দামের বাজার
                  </p>
                </div>

                <div className="rounded-xl border border-[#e2e9e1] p-4">
                  <p className="text-xs text-gray-600">গড় দাম</p>
                  <p className="mt-1 text-xl font-extrabold text-green-700">
                    {bn(average)}{" "}
                    <span className="text-xs font-normal">টাকা</span>
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    বাজারের দামের আনুমানিক গড়
                  </p>
                </div>
              </div>

              {/* Market price table */}
              <h2 className="mb-3 mt-7 text-base font-bold text-[#202820]">
                বাজারভিত্তিক আজকের দাম
              </h2>

              {markets.length === 0 ? (
                <p className="rounded-xl bg-[#f0f5ef] p-4 text-sm text-gray-600">
                  এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#e2e9e1]">
                  <table className="w-full min-w-[580px] border-collapse text-left text-xs sm:text-sm">
                    <thead className="bg-[#fbfcfa] text-gray-500">
                      <tr>
                        <th className="px-3 py-3 font-medium sm:px-4">বাজার</th>
                        <th className="px-3 py-3 font-medium sm:px-4">বিভাগ</th>
                        <th className="px-3 py-3 text-right font-medium sm:px-4">
                          সর্বনিম্ন
                        </th>
                        <th className="px-3 py-3 text-right font-medium sm:px-4">
                          সর্বাধিক
                        </th>
                        <th className="px-3 py-3 text-right font-medium sm:px-4">
                          গড়
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {markets.map((market, index) => (
                        <tr
                          key={`${market.market}-${market.division}-${index}`}
                          className={
                            index % 2 === 0 ? "bg-[#fbfcfa]" : "bg-[#f0f5ef]"
                          }
                        >
                          <td className="border-t border-[#dfe5dc] px-3 py-3 text-[#202820] sm:px-4">
                            {market.market}
                          </td>

                          <td className="border-t border-[#dfe5dc] px-3 py-3 text-gray-600 sm:px-4">
                            {market.division}
                          </td>

                          <td className="border-t border-[#dfe5dc] px-3 py-3 text-right sm:px-4">
                            {bn(market.min)} টাকা
                          </td>

                          <td className="border-t border-[#dfe5dc] px-3 py-3 text-right sm:px-4">
                            {bn(market.max)} টাকা
                          </td>

                          <td className="border-t border-[#dfe5dc] px-3 py-3 text-right font-semibold text-[#202820] sm:px-4">
                            {bn((market.min + market.max) / 2)} টাকা
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
