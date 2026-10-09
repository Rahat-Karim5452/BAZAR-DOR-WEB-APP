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

export function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>(API_ENDPOINTS.categories);
}

export function getProducts(): Promise<Product[]> {
  return fetchAPI<Product[]>(API_ENDPOINTS.products);
}
export function getProductById(id: number | string): Promise<ProductDetail> {
  return fetchAPI<ProductDetail>(API_ENDPOINTS.product(id));
}
export function getProductsByCategory(category: string): Promise<Product[]> {
  return fetchAPI<Product[]>(
    `${API_ENDPOINTS.products}?category=${encodeURIComponent(category)}`,
  );
}
