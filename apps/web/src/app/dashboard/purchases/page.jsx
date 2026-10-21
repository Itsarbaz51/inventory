"use client";
import { ShoppingCart } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { purchasesApi } from "@/services/inventoryApi";

export default function PurchasesPage() {
  return (
    <ResourceListPage
      icon={ShoppingCart}
      title="Purchases"
      description="View supplier purchase activity"
      queryKey="purchases"
      queryFn={purchasesApi.getAll}
      resourceKey="purchases"
      searchPlaceholder="Search purchases..."
      columns={[
        { label: "Purchase", key: "purchaseNumber" },
        {
          label: "Supplier",
          value: (row) => row.supplier?.name || row.supplier?.companyName,
        },
        { label: "Warehouse", value: (row) => row.warehouse?.name },
        { label: "Date", key: "purchaseDate", type: "date" },
        { label: "Total", key: "grandTotal", type: "currency" },
        { label: "Status", key: "status" },
      ]}
    />
  );
}
