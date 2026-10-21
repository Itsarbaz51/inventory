"use client";
import { CreditCard } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { paymentsApi } from "@/services/inventoryApi";

export default function PaymentsPage() {
  return <ResourceListPage icon={CreditCard} title="Payments" description="Track incoming and outgoing payments" queryKey="payments" queryFn={paymentsApi.getAll} resourceKey="payments" searchPlaceholder="Search payments..." columns={[{ label: "Reference", key: "referenceNumber" }, { label: "Amount", key: "amount", type: "currency" }, { label: "Method", key: "paymentMethod" }, { label: "Date", key: "paymentDate", type: "date" }, { label: "Status", key: "status" }]} />;
}
