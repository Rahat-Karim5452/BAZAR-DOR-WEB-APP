"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

const TOP_COUNT = 6;

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
      href={`/product/${product.slug}`}
      className="block rounded-xl border border-[#e2e9e1] bg-[#fbfcfa] p-3 transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-sm sm:p-3.5"
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

function SectionTitle({
  icon,
  iconClass,
  children,
}: {
  icon?: string;
  iconClass?: string;
  children: ReactNode;
}) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[#202820]">
      {icon && <span className={iconClass}>{icon}</span>}
      {children}
    </h2>
  );
}

function ProductGrid({
  products,
  loading,
  error,
  emptyText,
}: {
  products: Product[];
  loading: boolean;
  error: boolean;
  emptyText: string;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: TOP_COUNT }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-[#e2e9e1] bg-[#fbfcfa]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl bg-white p-4 text-sm text-red-600">
        পণ্যের তথ্য লোড করা যায়নি।
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductCards() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Aj dam Bereche:
  const topRisers = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, TOP_COUNT);

  // Aj Dam Komeche:
  const topFallers = products
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, TOP_COUNT);

  return (
    <main className="min-h-screen bg-[#f0f5ef] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7">
          <SectionTitle icon="▲" iconClass="text-red-600">
            আজ দাম বেড়েছে
          </SectionTitle>
          <ProductGrid
            products={topRisers}
            loading={loading}
            error={error}
            emptyText="আজ কোনো পণ্যের দাম বাড়েনি।"
          />
        </section>

        <section className="mb-7">
          <SectionTitle icon="▼" iconClass="text-green-600">
            আজ দাম কমেছে
          </SectionTitle>
          <ProductGrid
            products={topFallers}
            loading={loading}
            error={error}
            emptyText="আজ কোনো পণ্যের দাম কমেনি।"
          />
        </section>

        <section id="সব-পণ্য" className="scroll-mt-40">
          <SectionTitle>সব পণ্য</SectionTitle>
          {!loading && !error && (
            <p className="mb-3 -mt-2 text-[11px] text-gray-500">
              মোট {bn(products.length)}টি পণ্য দেখানো হচ্ছে
            </p>
          )}
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            emptyText="এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।"
          />
        </section>
      </div>
    </main>
  );
}
