"use client";
import { Undo2 } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { salesReturnsApi } from "@/services/inventoryApi";

export default function SalesReturnsPage() {
  return <ResourceListPage icon={Undo2} title="Sales Returns" description="Manage returned sales" queryKey="sales-returns" queryFn={salesReturnsApi.getAll} resourceKey="salesReturns" searchPlaceholder="Search sales returns..." columns={[{ label: "Return", key: "returnNumber" }, { label: "Sale", value: (row) => row.sale?.invoiceNumber }, { label: "Date", key: "returnDate", type: "date" }, { label: "Amount", key: "grandTotal", type: "currency" }, { label: "Status", key: "status" }]} />;
}
