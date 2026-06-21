export type InventoryItem = {
  id: number;
  quantity: number;
  resource: {
    id: number;
    name: string;
    category?: { name: string } | null;
  };
  warehouse: {
    id: number;
    name: string;
  } | null;
};

export type GroupedResource = {
  resource_id: number;
  resource_name: string;
  category_name: string;
  total_quantity: number;
  warehouses: {
    warehouse_id: number;
    warehouse_name: string;
    quantity: number;
  }[];
};
