"use client";
import { Package } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { productsApi } from "@/services/inventoryApi";

export default function ProductsPage() {
  return (
    <ResourceListPage
      icon={Package}
      title="Products"
      description="Manage products and inventory catalog"
      queryKey="products"
      queryFn={productsApi.getAll}
      resourceKey="products"
      searchPlaceholder="Search products..."
      columns={[
        { label: "Product", key: "name" },
        { label: "SKU", key: "sku" },
        { label: "Category", value: (row) => row.category?.name },
        { label: "Selling Price", key: "sellingPrice", type: "currency" },
        { label: "Status", key: "status" },
      ]}
    />
  );
}
