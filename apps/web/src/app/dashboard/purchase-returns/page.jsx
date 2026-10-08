"use client";

import { useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import StatsCards from "@/components/ui/StatsCards";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

import PurchaseReturnTable from "@/components/tables/PurchaseReturnTable";
import PurchaseReturnModal from "@/components/models/PurchaseReturnModal";
import PurchaseReturnViewModal from "@/components/models/view/PurchaseReturnViewModal";

import { usePurchaseReturns } from "@/hooks/purchaseReturns/usePurchaseReturns";
import { useCreatePurchaseReturn } from "@/hooks/purchaseReturns/useCreatePurchaseReturn";
import { useUpdatePurchaseReturn } from "@/hooks/purchaseReturns/useUpdatePurchaseReturn";
import { useDeletePurchaseReturn } from "@/hooks/purchaseReturns/useDeletePurchaseReturn";

const STATUS_OPTIONS = [
  {
    value: "",
    label: "All Statuses",
  },
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

const PurchaseReturnsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [supplierId, setSupplierId] =
    useState("");
  const [purchaseId, setPurchaseId] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedReturn, setSelectedReturn] =
    useState(null);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (status) {
      params.status = status;
    }

    if (supplierId.trim()) {
      params.supplierId =
        supplierId.trim();
    }

    if (purchaseId.trim()) {
      params.purchaseId =
        purchaseId.trim();
    }

    return params;
  }, [
    page,
    limit,
    search,
    status,
    supplierId,
    purchaseId,
  ]);

  const {
    data,
    isLoading,
    isFetching,
  } = usePurchaseReturns(queryParams);

  const createReturn =
    useCreatePurchaseReturn();

  const updateReturn =
    useUpdatePurchaseReturn();

  const deleteReturn =
    useDeletePurchaseReturn();

  const returns =
    data?.data?.purchaseReturns ||
    data?.data?.returns ||
    data?.data ||
    [];

  const pagination =
    data?.data?.pagination || {
      page,
      limit,
      total: returns.length,
      totalPages: 1,
    };

  const stats = useMemo(() => {
    const total = pagination.total ?? returns.length;

    const totalAmount = returns.reduce(
      (sum, item) =>
        sum +
        Number(item.totalAmount || 0),
      0,
    );

    const completed = returns.filter(
      (item) =>
        item.status === "COMPLETED",
    ).length;

    const draft = returns.filter(
      (item) =>
        item.status === "DRAFT",
    ).length;

    return [
      {
        title: "Purchase Returns",
        value: total,
      },
      {
        title: "Return Value",
        value: `₹${totalAmount.toLocaleString(
          "en-IN",
        )}`,
      },
      {
        title: "Completed",
        value: completed,
      },
      {
        title: "Draft",
        value: draft,
      },
    ];
  }, [returns, pagination.total]);

  const handleCreate = async (payload) => {
    await createReturn.mutateAsync(
      payload,
    );

    setModalOpen(false);
  };

  const handleUpdate = async (payload) => {
    if (!selectedReturn?.id) {
      return;
    }

    await updateReturn.mutateAsync({
      id: selectedReturn.id,
      payload,
    });

    setModalOpen(false);
    setSelectedReturn(null);
  };

  const handleDelete = async (returnData) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete return "${returnData.returnNumber}"?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteReturn.mutateAsync(
      returnData.id,
    );
  };

  const handleAdd = () => {
    setSelectedReturn(null);
    setModalOpen(true);
  };

  const handleEdit = (returnData) => {
    setSelectedReturn(returnData);
    setModalOpen(true);
  };

  const handleView = (returnData) => {
    setSelectedReturn(returnData);
    setViewOpen(true);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setSupplierId("");
    setPurchaseId("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Returns"
        description="Manage returned products from purchases."
        actionLabel="Create Purchase Return"
        onAction={handleAdd}
      />

      <StatsCards cards={stats} />

      {/* Filters */}
      <div className="rounded-xl border bg-background p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InputField
            label="Search"
            name="search"
            placeholder="Return number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <SelectField
            label="Status"
            name="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            placeholder={null}
          />

          <InputField
            label="Supplier ID"
            name="supplierId"
            placeholder="Supplier UUID"
            value={supplierId}
            onChange={(e) => {
              setSupplierId(
                e.target.value,
              );
              setPage(1);
            }}
          />

          <InputField
            label="Purchase ID"
            name="purchaseId"
            placeholder="Purchase UUID"
            value={purchaseId}
            onChange={(e) => {
              setPurchaseId(
                e.target.value,
              );
              setPage(1);
            }}
          />
        </div>

        {(search ||
          status ||
          supplierId ||
          purchaseId) && (
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
          Loading purchase returns...
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute right-3 top-3 z-10 rounded-md bg-background px-3 py-1 text-xs shadow">
              Updating...
            </div>
          )}

          <PurchaseReturnTable
            returns={returns}
            pagination={pagination}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={setPage}
            isDeleting={
              deleteReturn.isPending
            }
          />
        </div>
      )}

      {/* Create / Edit */}
      <PurchaseReturnModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedReturn(null);
        }}
        returnData={selectedReturn}
        onSubmit={
          selectedReturn
            ? handleUpdate
            : handleCreate
        }
        isLoading={
          createReturn.isPending ||
          updateReturn.isPending
        }
      />

      {/* View */}
      <PurchaseReturnViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedReturn(null);
        }}
        returnData={selectedReturn}
      />
    </div>
  );
};

export default PurchaseReturnsPage;