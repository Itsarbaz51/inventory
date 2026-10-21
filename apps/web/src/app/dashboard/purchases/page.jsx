"use client";
<<<<<<< HEAD
import { ShoppingCart } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { purchasesApi } from "@/services/inventoryApi";

export default function PurchasesPage() {
  return <ResourceListPage icon={ShoppingCart} title="Purchases" description="View supplier purchase activity" queryKey="purchases" queryFn={purchasesApi.getAll} resourceKey="purchases" searchPlaceholder="Search purchases..." columns={[{ label: "Purchase", key: "purchaseNumber" }, { label: "Supplier", value: (row) => row.supplier?.name || row.supplier?.companyName }, { label: "Warehouse", value: (row) => row.warehouse?.name }, { label: "Date", key: "purchaseDate", type: "date" }, { label: "Total", key: "grandTotal", type: "currency" }, { label: "Status", key: "status" }]} />;
}
=======

import { useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import StatsCards from "@/components/ui/StatsCards";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

import PurchaseTable from "@/components/tables/PurchaseTable";
import PurchaseModal from "@/components/models/PurchaseModal";
import PurchaseViewModal from "@/components/models/PurchaseModal";

import { usePurchases } from "@/hooks/purchases/usePurchases";
import { useCreatePurchase } from "@/hooks/purchases/useCreatePurchase";
import { useUpdatePurchase } from "@/hooks/purchases/useUpdatePurchase";
import { useDeletePurchase } from "@/hooks/purchases/useDeletePurchase";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "ORDERED", label: "Ordered" },
  {
    value: "PARTIALLY_RECEIVED",
    label: "Partially Received",
  },
  { value: "RECEIVED", label: "Received" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAYMENT_OPTIONS = [
  { value: "", label: "All Payment Statuses" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
];

const PurchasesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const [purchaseNumber, setPurchaseNumber] =
    useState("");

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] =
    useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedPurchase, setSelectedPurchase] =
    useState(null);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
    };

    // These filters depend on your backend getAll implementation.
    if (purchaseNumber.trim()) {
      params.purchaseNumber =
        purchaseNumber.trim();
    }

    if (status) {
      params.status = status;
    }

    if (paymentStatus) {
      params.paymentStatus = paymentStatus;
    }

    return params;
  }, [
    page,
    limit,
    purchaseNumber,
    status,
    paymentStatus,
  ]);

  const {
    data,
    isLoading,
    isFetching,
  } = usePurchases(queryParams);

  const createPurchase = useCreatePurchase();
  const updatePurchase = useUpdatePurchase();
  const deletePurchase = useDeletePurchase();

  const purchases =
    data?.data?.purchases ||
    data?.data ||
    [];

  const pagination =
    data?.data?.pagination || {
      page,
      limit,
      total: purchases.length,
      totalPages: 1,
    };

  const stats = useMemo(() => {
    const total = purchases.length;

    const totalAmount = purchases.reduce(
      (sum, item) =>
        sum + Number(item.grandTotal || 0),
      0,
    );

    const paidAmount = purchases.reduce(
      (sum, item) =>
        sum + Number(item.paidAmount || 0),
      0,
    );

    const dueAmount = purchases.reduce(
      (sum, item) =>
        sum + Number(item.dueAmount || 0),
      0,
    );

    return [
      {
        title: "Purchases",
        value: pagination.total ?? total,
      },
      {
        title: "Purchase Value",
        value: `₹${totalAmount.toLocaleString("en-IN")}`,
      },
      {
        title: "Paid",
        value: `₹${paidAmount.toLocaleString("en-IN")}`,
      },
      {
        title: "Due",
        value: `₹${dueAmount.toLocaleString("en-IN")}`,
      },
    ];
  }, [purchases, pagination.total]);

  const handleCreate = async (payload) => {
    await createPurchase.mutateAsync(payload);

    setModalOpen(false);
  };

  const handleUpdate = async (payload) => {
    if (!selectedPurchase?.id) return;

    await updatePurchase.mutateAsync({
      id: selectedPurchase.id,
      payload,
    });

    setModalOpen(false);
    setSelectedPurchase(null);
  };

  const handleDelete = async (purchase) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete purchase "${purchase.purchaseNumber}"?`,
    );

    if (!confirmed) return;

    await deletePurchase.mutateAsync(
      purchase.id,
    );
  };

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setModalOpen(true);
  };

  const handleView = (purchase) => {
    setSelectedPurchase(purchase);
    setViewOpen(true);
  };

  const handleAdd = () => {
    setSelectedPurchase(null);
    setModalOpen(true);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
  };

  const handleSearchChange = (e) => {
    setPurchaseNumber(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handlePaymentChange = (e) => {
    setPaymentStatus(e.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setPurchaseNumber("");
    setStatus("");
    setPaymentStatus("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Manage purchase orders and supplier purchases."
        actionLabel="Create Purchase"
        onAction={handleAdd}
      />

      <StatsCards cards={stats} />

      {/* Filters */}
      <div className="rounded-xl border bg-background p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InputField
            label="Purchase Number"
            name="purchaseNumber"
            placeholder="Search purchase number..."
            value={purchaseNumber}
            onChange={handleSearchChange}
          />

          <SelectField
            label="Status"
            name="status"
            value={status}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
            placeholder={null}
          />

          <SelectField
            label="Payment Status"
            name="paymentStatus"
            value={paymentStatus}
            onChange={handlePaymentChange}
            options={PAYMENT_OPTIONS}
            placeholder={null}
          />
        </div>

        {(purchaseNumber ||
          status ||
          paymentStatus) && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="rounded-xl border p-12 text-center text-muted-foreground">
          Loading purchases...
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute right-3 top-3 z-10 rounded-md bg-background px-3 py-1 text-xs shadow">
              Updating...
            </div>
          )}

          <PurchaseTable
            purchases={purchases}
            pagination={pagination}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            isDeleting={deletePurchase.isPending}
          />
        </div>
      )}

      {/* Create / Edit */}
      <PurchaseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPurchase(null);
        }}
        purchase={selectedPurchase}
        onSubmit={
          selectedPurchase
            ? handleUpdate
            : handleCreate
        }
        isLoading={
          createPurchase.isPending ||
          updatePurchase.isPending
        }
      />

      {/* View */}
      <PurchaseViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedPurchase(null);
        }}
        purchase={selectedPurchase}
      />
    </div>
  );
};

export default PurchasesPage;
>>>>>>> 8e1db6a2908d3179bced3d62c9ff7e07bced9985
