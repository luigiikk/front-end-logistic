import type { Warehouse, Address } from "../types/warehouse";

export function resolveAddress(w: Warehouse): Partial<Address> {
  return w.address ?? {};
}
