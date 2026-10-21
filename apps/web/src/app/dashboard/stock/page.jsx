"use client";
import { Boxes } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { warehouseStockApi } from "@/services/inventoryApi";

export default function StockPage() {
  return <ResourceListPage icon={Boxes} title="Stock" description="View warehouse-wise stock" queryKey="warehouse-stock" queryFn={warehouseStockApi.getAll} resourceKey="stocks" searchPlaceholder="Search stock..." columns={[{ label: "Product", value: (row) => row.product?.name }, { label: "Warehouse", value: (row) => row.warehouse?.name }, { label: "Available", key: "availableQuantity" }, { label: "Reserved", key: "reservedQuantity" }, { label: "Updated", key: "updatedAt", type: "date" }]} />;
}
