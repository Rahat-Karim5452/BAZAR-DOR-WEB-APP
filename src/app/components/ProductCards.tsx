"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

function bn(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

function ProductCard({ product }: { product: Product }) {
  const up = product.change?.dir === "up";
  const down = product.change?.dir === "down";
  const pct = product.change?.pct ?? 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="block rounded-xl border border-[#e2e9e1] bg-[#fbfcfa] p-3 transition hover:border-green-200 hover:shadow-sm sm:p-3.5"
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eff4ed] text-xl sm:h-10 sm:w-10">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#202820]">
            {product.nameBn}
          </h3>
          <p className="mt-0.5 text-[10px] text-gray-500 sm:text-[11px]">
            প্রতি {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] text-gray-500">আজকের দাম</p>
          <p className="mt-0.5 text-sm font-bold text-[#202820] sm:text-base">
            {bn(product.today)} টাকা
          </p>
        </div>

        <span
          className={`mb-0.5 shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
            up
              ? "bg-red-50 text-red-600"
              : down
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {up ? "▲" : down ? "▼" : "—"} {bn(pct)}%
        </span>
      </div>
    </Link>
  );
}

function ProductGrid({
  title,
  products,
  loading,
  error,
}: {
  title: string;
  products: Product[];
  loading: boolean;
  error: boolean;
}) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#202820]">
        {title === "আজ দাম বেড়েছে" && <span className="text-red-600">▲</span>}
        {title === "আজ দাম কমেছে" && <span className="text-green-600">▼</span>}
        {title}
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-xl bg-white p-4 text-sm text-red-600">
          পণ্যের তথ্য লোড করা যায়নি।
        </p>
      ) : products.length === 0 ? (
        <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
          এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ProductCards() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const rising = products.filter((product) => product.change?.dir === "up");

  const falling = products.filter((product) => product.change?.dir === "down");

  return (
    <main className="min-h-screen bg-[#f0f5ef] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-4xl">
        <ProductGrid
          title="আজ দাম বেড়েছে"
          products={rising}
          loading={loading}
          error={error}
        />

        <ProductGrid
          title="আজ দাম কমেছে"
          products={falling}
          loading={loading}
          error={error}
        />

        <section>
          <h2 className="text-base font-bold text-[#202820]">সব পণ্য</h2>
          <p className="mb-3 mt-1 text-[11px] text-gray-500">
            মোট {bn(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <ProductGrid
            title=""
            products={products}
            loading={loading}
            error={error}
          />
        </section>
      </div>
    </main>
  );
}
