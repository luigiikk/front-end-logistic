import type { Vehicle } from "../types/allocateVehicle";

export function getInitials(model: string) {
  return model
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function volumePercent(v: Vehicle) {
  if (v.total_volume <= 0) return 0;
  return Math.min(
    100,
    Math.round(((v.total_volume - v.available_volume) / v.total_volume) * 100)
  );
}
