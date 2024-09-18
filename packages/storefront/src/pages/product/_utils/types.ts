export interface ProductOption {
  id: string;
  title: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number; // Assuming price is a number, adjust if needed
  purchasable: boolean;
  inStock: boolean;
  options: Record<string, string>;
}
