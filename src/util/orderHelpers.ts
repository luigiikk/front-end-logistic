import type { Product } from "../types/order";

export function maskCPF(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskZip(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

export function calcProductsVolume(products: Product[]): number {
  return products.reduce((acc, p) => {
    const unit = (p.height || 0) * (p.width || 0) * (p.length || 0);
    return acc + unit * (p.quantity || 1);
  }, 0);
}
