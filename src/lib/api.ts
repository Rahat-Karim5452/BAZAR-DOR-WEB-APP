import type { Category, Product, ProductDetail } from "@/types";

const API_BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

export const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/categories`,
  category: (id: string) => `${API_BASE_URL}/categories/${id}`,
  products: `${API_BASE_URL}/products`,
  product: (id: number | string) => `${API_BASE_URL}/products/${id}`,
} as const;

async function fetchAPI<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function uniqueById<T extends { id: number | string }>(items: T[]): T[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = String(item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
export function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>(API_ENDPOINTS.categories);
}
export async function getProducts(): Promise<Product[]> {
  const data = await fetchAPI<Product[]>(API_ENDPOINTS.products);
  return uniqueById(data);
}
export function getProductById(id: number | string): Promise<ProductDetail> {
  return fetchAPI<ProductDetail>(API_ENDPOINTS.product(id));
}
export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const data = await fetchAPI<Product[]>(
    `${API_ENDPOINTS.products}?category=${encodeURIComponent(category)}`,
  );
  return uniqueById(data);
}
