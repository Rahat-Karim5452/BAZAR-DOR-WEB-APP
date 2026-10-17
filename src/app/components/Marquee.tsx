"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

function toBanglaNumber(value: number): string {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

function getBanglaUnit(unit: string): string {
  const units: Record<string, string> = {
    kg: "কেজি",
    gram: "গ্রাম",
    liter: "লিটার",
    litre: "লিটার",
    piece: "টি",
    dozen: "ডজন",
  };
  return units[unit.toLowerCase()] ?? unit;
}

export default function PriceMarquee() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((error) => {
        console.error("Failed to load market prices:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full overflow-hidden border-y border-gray-200 bg-white">
      <Marquee direction="left" speed={40} pauseOnHover gradient={false}>
        {products.length > 0 ? (
          products.map((product) => {
            const direction = product.change?.dir;
            const percentage = product.change?.pct ?? 0;

            return (
              <div
                key={product.id}
                className="flex shrink-0 items-center gap-2 border-r border-gray-200 px-4 py-1.5 text-sm sm:px-5"
              >
                <span aria-hidden="true" className="text-base">
                  {product.image}
                </span>

                <span className="whitespace-nowrap text-gray-800">
                  <span className="font-medium">{product.nameBn}</span>{" "}
                  <span className="font-semibold">
                    {toBanglaNumber(product.today)} টাকা/
                    {getBanglaUnit(product.unit)}
                  </span>
                </span>

                {direction === "up" && (
                  <span className="flex shrink-0 items-center gap-1 whitespace-nowrap font-bold text-red-600">
                    <span aria-label="দাম বেড়েছে">▲</span>
                    <span>{toBanglaNumber(percentage)}%</span>
                  </span>
                )}

                {direction === "down" && (
                  <span className="flex shrink-0 items-center gap-1 whitespace-nowrap font-bold text-green-700">
                    <span aria-label="দাম কমেছে">▼</span>
                    <span>{toBanglaNumber(percentage)}%</span>
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className="px-5 py-3 text-sm text-gray-500">
            বাজারদরের তথ্য লোড হচ্ছে...
          </div>
        )}
      </Marquee>
    </div>
  );
}
