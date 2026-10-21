"use client";
<<<<<<< HEAD
import { Receipt } from "lucide-react";
import ResourceListPage from "@/components/inventory/ResourceListPage";
import { salesApi } from "@/services/inventoryApi";

export default function SalesPage() {
  return <ResourceListPage icon={Receipt} title="Sales" description="View sales and invoice activity" queryKey="sales" queryFn={salesApi.getAll} resourceKey="sales" searchPlaceholder="Search sales..." columns={[{ label: "Invoice", key: "invoiceNumber" }, { label: "Customer", value: (row) => row.customer?.name }, { label: "Warehouse", value: (row) => row.warehouse?.name }, { label: "Date", key: "saleDate", type: "date" }, { label: "Total", key: "grandTotal", type: "currency" }, { label: "Status", key: "status" }]} />;
}
=======

import { useMemo, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import StatsCards from "@/components/ui/StatsCards";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

import SaleTable from "@/components/tables/SaleTable";
import SaleModal from "@/components/models/SaleModal";
import SaleViewModal from "@/components/models/view/SaleViewModal";

import { useSales } from "@/hooks/sales/useSales";
import { useCreateSale } from "@/hooks/sales/useCreateSale";
import { useUpdateSale } from "@/hooks/sales/useUpdateSale";
import { useDeleteSale } from "@/hooks/sales/useDeleteSale";

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
    value: "CONFIRMED",
    label: "Confirmed",
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

const PAYMENT_STATUS_OPTIONS = [
  {
    value: "",
    label: "All Payment Statuses",
  },
  {
    value: "UNPAID",
    label: "Unpaid",
  },
  {
    value: "PARTIAL",
    label: "Partial",
  },
  {
    value: "PAID",
    label: "Paid",
  },
];

const SalesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [paymentStatus, setPaymentStatus] =
    useState("");

  const [customerId, setCustomerId] =
    useState("");

  const [warehouseId, setWarehouseId] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedSale, setSelectedSale] =
    useState(null);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
    };

    /*
     * These query parameters are sent only if
     * your SaleController.getAll supports them.
     */

    if (search.trim()) {
      params.search = search.trim();
    }

    if (status) {
      params.status = status;
    }

    if (paymentStatus) {
      params.paymentStatus =
        paymentStatus;
    }

    if (customerId.trim()) {
      params.customerId =
        customerId.trim();
    }

    if (warehouseId.trim()) {
      params.warehouseId =
        warehouseId.trim();
    }

    return params;
  }, [
    page,
    limit,
    search,
    status,
    paymentStatus,
    customerId,
    warehouseId,
  ]);

  const {
    data,
    isLoading,
    isFetching,
  } = useSales(queryParams);

  const createSale =
    useCreateSale();

  const updateSale =
    useUpdateSale();

  const deleteSale =
    useDeleteSale();

  const sales =
    data?.data?.sales ||
    data?.data ||
    [];

  const pagination =
    data?.data?.pagination || {
      page,
      limit,
      total: sales.length,
      totalPages: 1,
    };

  const stats = useMemo(() => {
    const total =
      pagination.total ?? sales.length;

    const totalAmount = sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.grandTotal || 0),
      0,
    );

    const paidAmount = sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.paidAmount || 0),
      0,
    );

    const dueAmount = sales.reduce(
      (sum, sale) =>
        sum +
        Number(sale.dueAmount || 0),
      0,
    );

    return [
      {
        title: "Sales",
        value: total,
      },
      {
        title: "Sales Value",
        value: `₹${totalAmount.toLocaleString(
          "en-IN",
        )}`,
      },
      {
        title: "Collected",
        value: `₹${paidAmount.toLocaleString(
          "en-IN",
        )}`,
      },
      {
        title: "Due",
        value: `₹${dueAmount.toLocaleString(
          "en-IN",
        )}`,
      },
    ];
  }, [sales, pagination.total]);

  const handleCreate = async (
    payload,
  ) => {
    await createSale.mutateAsync(
      payload,
    );

    setModalOpen(false);
  };

  const handleUpdate = async (
    payload,
  ) => {
    if (!selectedSale?.id) {
      return;
    }

    await updateSale.mutateAsync({
      id: selectedSale.id,
      payload,
    });

    setModalOpen(false);
    setSelectedSale(null);
  };

  const handleDelete = async (
    sale,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete sale "${sale.invoiceNumber}"?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteSale.mutateAsync(
      sale.id,
    );
  };

  const handleAdd = () => {
    setSelectedSale(null);
    setModalOpen(true);
  };

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setModalOpen(true);
  };

  const handleView = (sale) => {
    setSelectedSale(sale);
    setViewOpen(true);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentStatus("");
    setCustomerId("");
    setWarehouseId("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        description="Manage sales invoices, payments and outstanding amounts."
        actionLabel="Create Sale"
        onAction={handleAdd}
      />

      <StatsCards cards={stats} />

      {/* Filters */}
      <div className="rounded-xl border bg-background p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <InputField
            label="Search"
            name="search"
            placeholder="Invoice number..."
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

          <SelectField
            label="Payment Status"
            name="paymentStatus"
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(
                e.target.value,
              );
              setPage(1);
            }}
            options={PAYMENT_STATUS_OPTIONS}
            placeholder={null}
          />

          <InputField
            label="Customer ID"
            name="customerId"
            placeholder="Customer UUID"
            value={customerId}
            onChange={(e) => {
              setCustomerId(
                e.target.value,
              );
              setPage(1);
            }}
          />

          <InputField
            label="Warehouse ID"
            name="warehouseId"
            placeholder="Warehouse UUID"
            value={warehouseId}
            onChange={(e) => {
              setWarehouseId(
                e.target.value,
              );
              setPage(1);
            }}
          />
        </div>

        {(search ||
          status ||
          paymentStatus ||
          customerId ||
          warehouseId) && (
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
          Loading sales...
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute right-3 top-3 z-10 rounded-md bg-background px-3 py-1 text-xs shadow">
              Updating...
            </div>
          )}

          <SaleTable
            sales={sales}
            pagination={pagination}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={setPage}
            isDeleting={
              deleteSale.isPending
            }
          />
        </div>
      )}

      {/* Create / Edit */}
      <SaleModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSale(null);
        }}
        sale={selectedSale}
        onSubmit={
          selectedSale
            ? handleUpdate
            : handleCreate
        }
        isLoading={
          createSale.isPending ||
          updateSale.isPending
        }
      />

      {/* View */}
      <SaleViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedSale(null);
        }}
        sale={selectedSale}
      />
    </div>
  );
};

export default SalesPage;
>>>>>>> 8e1db6a2908d3179bced3d62c9ff7e07bced9985
