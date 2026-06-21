export type Order = {
  id: number;
  code: string;
  recipient: string;
  status: string;
  vehicle: { plate: string } | null;
};

export type Vehicle = {
  id: number;
  plate: string;
  model: string;
  total_volume: number;
  available_volume: number;
  status: string;
};
