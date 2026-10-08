"use client";

import { useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import StatsCards from "@/components/ui/StatsCards";
import InputField from "@/components/ui/InputField";

import PurchaseItemTable from "@/components/tables/PurchaseItemTable";
import PurchaseItemModal from "@/components/models/PurchaseItemModal";
import PurchaseItemViewModal from "@/components/models/view/PurchaseItemViewModal";

import { usePurchaseItems } from "@/hooks/purchaseItems/usePurchaseItems";
import { useCreatePurchaseItem } from "@/hooks/purchaseItems/useCreatePurchaseItem";
import { useUpdatePurchaseItem } from "@/hooks/purchaseItems/useUpdatePurchaseItem";
import { useDeletePurchaseItem } from "@/hooks/purchaseItems/useDeletePurchaseItem";

const PurchaseItemsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const [purchaseId, setPurchaseId] =
    useState("");

  const [productId, setProductId] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState(null);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
    };

    if (purchaseId.trim()) {
      params.purchaseId = purchaseId.trim();
    }

    if (productId.trim()) {
      params.productId = productId.trim();
    }

    return params;
  }, [page, limit, purchaseId, productId]);

  const {
    data,
    isLoading,
    isFetching,
  } = usePurchaseItems(queryParams);

  const createPurchaseItem =
    useCreatePurchaseItem();

  const updatePurchaseItem =
    useUpdatePurchaseItem();

  const deletePurchaseItem =
    useDeletePurchaseItem();

  const items =
    data?.data?.purchaseItems ||
    data?.data?.items ||
    data?.data ||
    [];

  const pagination =
    data?.data?.pagination || {
      page,
      limit,
      total: items.length,
      totalPages: 1,
    };

  const stats = useMemo(() => {
    const totalItems = items.length;

    const totalQuantity = items.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0,
    );

    const receivedQuantity = items.reduce(
      (sum, item) =>
        sum +
        Number(item.receivedQuantity || 0),
      0,
    );

    const totalValue = items.reduce(
      (sum, item) =>
        sum + Number(item.total || 0),
      0,
    );

    return [
      {
        title: "Purchase Items",
        value: pagination.total ?? totalItems,
      },
      {
        title: "Total Quantity",
        value: totalQuantity,
      },
      {
        title: "Received Quantity",
        value: receivedQuantity,
      },
      {
        title: "Purchase Value",
        value: `₹${totalValue.toLocaleString(
          "en-IN",
        )}`,
      },
    ];
  }, [items, pagination.total]);

  const handleCreate = async (payload) => {
    await createPurchaseItem.mutateAsync(
      payload,
    );

    setModalOpen(false);
  };

  const handleUpdate = async (payload) => {
    if (!selectedItem?.id) return;

    await updatePurchaseItem.mutateAsync({
      id: selectedItem.id,
      payload,
    });

    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this purchase item?",
    );

    if (!confirmed) return;

    await deletePurchaseItem.mutateAsync(
      item.id,
    );
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleClearFilters = () => {
    setPurchaseId("");
    setProductId("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Items"
        description="Manage products and quantities added to purchases."
        actionLabel="Add Purchase Item"
        onAction={handleAdd}
      />

      <StatsCards cards={stats} />

      {/* Filters */}
      <div className="rounded-xl border bg-background p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Purchase ID"
            name="purchaseId"
            placeholder="Enter purchase UUID"
            value={purchaseId}
            onChange={(e) => {
              setPurchaseId(e.target.value);
              setPage(1);
            }}
          />

          <InputField
            label="Product ID"
            name="productId"
            placeholder="Enter product UUID"
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {(purchaseId || productId) && (
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

      {/* Table */}
      {isLoading ? (
        <div className="rounded-xl border p-12 text-center text-muted-foreground">
          Loading purchase items...
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute right-3 top-3 z-10 rounded-md bg-background px-3 py-1 text-xs shadow">
              Updating...
            </div>
          )}

          <PurchaseItemTable
            items={items}
            pagination={pagination}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={setPage}
            isDeleting={
              deletePurchaseItem.isPending
            }
          />
        </div>
      )}

      {/* Create / Edit */}
      <PurchaseItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSubmit={
          selectedItem
            ? handleUpdate
            : handleCreate
        }
        isLoading={
          createPurchaseItem.isPending ||
          updatePurchaseItem.isPending
        }
      />

      {/* View */}
      <PurchaseItemViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
    </div>
  );
};

export default PurchaseItemsPage;