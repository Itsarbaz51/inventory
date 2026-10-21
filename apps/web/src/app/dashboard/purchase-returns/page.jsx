"use client";
import { CornerUpLeft } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { purchaseReturnsApi } from "@/services/inventoryApi";

export default function PurchaseReturnsPage() {
  return <ResourceListPage icon={CornerUpLeft} title="Purchase Returns" description="Manage returned purchases" queryKey="purchase-returns" queryFn={purchaseReturnsApi.getAll} resourceKey="purchaseReturns" searchPlaceholder="Search purchase returns..." columns={[{ label: "Return", key: "returnNumber" }, { label: "Purchase", value: (row) => row.purchase?.purchaseNumber }, { label: "Date", key: "returnDate", type: "date" }, { label: "Amount", key: "grandTotal", type: "currency" }, { label: "Status", key: "status" }]} />;
}
