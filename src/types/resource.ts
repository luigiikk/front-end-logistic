export type Category = {
  id: number;
  name: string;
};

export type Resource = {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category?: { name: string };
  width?: number | null;
  height?: number | null;
  length?: number | null;
  total_quantity?: number;
};

export type ResourceForm = {
  name: string;
  description: string;
  category_id: number | "";
  width: string;
  height: string;
  length: string;
};

export const EMPTY_FORM: ResourceForm = {
  name: "",
  description: "",
  category_id: "",
  width: "",
  height: "",
  length: "",
};
