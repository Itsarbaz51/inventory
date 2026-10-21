"use client";
import { ArrowLeftRight } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { stockMovementsApi } from "@/services/inventoryApi";

export default function StockMovementsPage() {
  return <ResourceListPage icon={ArrowLeftRight} title="Stock Movements" description="Audit inventory movement history" queryKey="stock-movements" queryFn={stockMovementsApi.getAll} resourceKey="movements" searchPlaceholder="Search stock movements..." columns={[{ label: "Product", value: (row) => row.product?.name }, { label: "Warehouse", value: (row) => row.warehouse?.name }, { label: "Type", key: "type" }, { label: "Quantity", key: "quantity" }, { label: "Date", key: "createdAt", type: "date" }]} />;
}
