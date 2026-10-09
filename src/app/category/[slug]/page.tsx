"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCategories, getProductsByCategory } from "@/lib/api";
import type { Category, Product } from "@/types";

type SortOption = "default" | "low-high" | "high-low";

function bn(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      setLoading(true);
      setInvalid(false);
      setCategory(null);
      setProducts([]);

      try {
        const [categories, categoryProducts] = await Promise.all([
          getCategories(),
          getProductsByCategory(slug),
        ]);

        if (cancelled) return;

        const foundCategory = categories.find(
          (item) => item.slug === slug || item.id === slug,
        );

        if (!foundCategory || categoryProducts.length === 0) {
          setInvalid(true);
          return;
        }

        setCategory(foundCategory);
        setProducts(categoryProducts);
      } catch {
        if (!cancelled) setInvalid(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low-high") {
      result.sort((a, b) => a.today - b.today);
    } else if (sort === "high-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  return (
    <main className="min-h-[calc(100vh-200px)] bg-[#f0f5ef] px-4 py-6 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-6xl">
        {/* Category header */}
        <section className="mb-6 flex items-center gap-4 rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] px-5 py-6 sm:px-7">
          {loading ? (
            <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eff4ed] text-3xl">
              {category?.icon}
            </div>
          )}

          <div>
            {loading ? (
              <>
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-4 w-48 animate-pulse rounded bg-gray-100" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold text-[#202820]">
                  {category?.nameBn}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {bn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
                </p>
              </>
            )}
          </div>
        </section>

        {/* Sort control */}
        <section className="mb-4 flex min-h-[64px] items-center justify-end gap-3 rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] px-4 py-3 sm:px-6">
          <label htmlFor="product-sort" className="text-sm text-gray-600">
            সাজান
          </label>

          <select
            id="product-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            disabled={loading || invalid}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#202820] outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </section>

        {/* Product count */}
        {!loading && !invalid && (
          <p className="mb-4 text-sm text-gray-500">
            মোট {bn(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[138px] animate-pulse rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-4"
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="mt-5 h-4 w-1/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Invalid category / empty state */}
        {!loading && invalid && (
          <div className="rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] px-5 py-12 text-center">
            <div className="text-4xl">🛒</div>
            <h2 className="mt-3 text-xl font-bold text-[#202820]">
              কোনো পণ্য পাওয়া যায়নি
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              এই category-টি পাওয়া যায়নি অথবা এখানে কোনো পণ্য নেই।
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}

        {/* Product cards */}
        {!loading && !invalid && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {sortedProducts.map((product) => {
              const up = product.change?.dir === "up";
              const down = product.change?.dir === "down";

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="rounded-2xl border border-[#e2e9e1] bg-[#fbfcfa] p-3 transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-sm sm:p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff4ed] text-2xl">
                      {product.image || product.categoryIcon || "🛒"}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-[#202820] sm:text-base">
                        {product.nameBn}
                      </h2>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        প্রতি {product.unit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-gray-500">আজকের দাম</p>
                      <p className="mt-0.5 text-base font-extrabold text-[#202820] sm:text-lg">
                        {bn(product.today)}{" "}
                        <span className="text-xs font-normal">টাকা</span>
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                        up
                          ? "bg-red-50 text-red-600"
                          : down
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {up ? "▲" : down ? "▼" : "—"}{" "}
                      {bn(product.change?.pct ?? 0)}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
