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
  company_id?: number | null;
};

export type VehicleDocument = {
  id: number;
  type: string;
  number?: string | null;
  issued_at?: string | null;
  expires_at?: string | null;
  file_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  vehicle_id: number;
};

export type VehicleMaintenance = {
  id: number;
  type: string;
  description?: string | null;
  cost?: number | null;
  mileage?: number | null;
  performed_at?: string | null;
  next_due_at?: string | null;
  performed_by?: string | null;
  created_at: string;
  updated_at: string;
  vehicle_id: number;
};

export type VehicleDetail = Omit<Vehicle, "status"> & {
  status_id: number;
  company_id: number;
  created_at: string;
  updated_at: string;
  status: {
    id: number;
    name: string;
    type: string;
    is_default: boolean;
    company_id: number | null;
  };
  documents: VehicleDocument[];
  maintenances: VehicleMaintenance[];
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
  mileage?: number | string;
  performed_at?: string;
  next_due_at?: string;
  performed_by?: string;
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