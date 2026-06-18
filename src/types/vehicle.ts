export type Vehicle = {
  id: number;
  plate: string;
  model: string;
  total_volume: number;    
  available_volume: number;  
  status: string;
};

export type Status = {
  id: number;
  name: string;
  type: "order" | "vehicle" | "invoice" | "purchase_order";
  is_default?: boolean;
};

export type DocumentForm = {
  type: string;
  number?: string;
  notes?: string;
  issued_at?: string;
  expires_at?: string;
  file_url?: string;
};

export type MaintenanceForm = {
  type: string;
  description?: string;
  cost?: number | string;
  performed_at?: string;
  next_due_at?: string;
};

export type VehicleForm = {
  plate: string;
  model: string;
  total_volume: number | string; 
  status_id: number;
  documents: DocumentForm[];
  maintenances: MaintenanceForm[];
};

export const EMPTY_FORM: VehicleForm = {
  plate: "",
  model: "",
  total_volume: "",
  status_id: 0,
  documents: [],
  maintenances: [],
};