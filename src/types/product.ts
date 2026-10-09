export interface ProductChange {
  dir: "up" | "down";
  pct: number;
}

export interface ProductMarket {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  image: string;
  unit: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: ProductChange;
  markets: ProductMarket[];
}

export type ProductDetail = Product;
