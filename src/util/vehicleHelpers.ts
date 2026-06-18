import type { Status } from "../types/vehicle";

export function getInitials(model: string) {
  return model
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function maskPlate(v: string) {
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}

export function resolveStatusId(statusName: string, statuses: Status[]): number {
  const match = statuses.find(
    (s) => s.name.toLowerCase() === statusName.toLowerCase()
  );
  return match?.id ?? 0;
}