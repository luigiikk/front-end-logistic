export type PurchaseOrderItem = {
  id: number;
  purchase_order_id: number;
  resource_id: number;
  warehouse_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  resource?: { name: string };
};
