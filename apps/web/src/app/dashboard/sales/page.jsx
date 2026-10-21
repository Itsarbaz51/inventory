"use client";
import { Receipt } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { salesApi } from "@/services/inventoryApi";

export default function SalesPage() {
  return (
    <ResourceListPage
      icon={Receipt}
      title="Sales"
      description="View sales and invoice activity"
      queryKey="sales"
      queryFn={salesApi.getAll}
      resourceKey="sales"
      searchPlaceholder="Search sales..."
      columns={[
        { label: "Invoice", key: "invoiceNumber" },
        { label: "Customer", value: (row) => row.customer?.name },
        { label: "Warehouse", value: (row) => row.warehouse?.name },
        { label: "Date", key: "saleDate", type: "date" },
        { label: "Total", key: "grandTotal", type: "currency" },
        { label: "Status", key: "status" },
      ]}
    />
  );
}
