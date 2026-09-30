"use client";

import React, { useMemo, useState } from "react";

import {
  Plus,
  RefreshCw,
  Warehouse,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import StatsCards from "@/components/ui/StatsCards";
import FilterBar from "@/components/ui/FilterBar";

import WarehousesCards from "@/components/cards/WarehouseCard";

import WarehouseModal from "@/components/models/WarehouseModal";
import WarehouseViewModal from "@/components/models/view/WarehouseViewModal";

import useWarehouses from "@/hooks/warehouses/useWarehouses";
import useCreateWarehouse from "@/hooks/warehouses/useCreateWarehouse";
import useUpdateWarehouse from "@/hooks/warehouses/useUpdateWarehouse";
import useDeleteWarehouse from "@/hooks/warehouses/useDeleteWarehouse";

export default function WarehousesPage() {
  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("ALL");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // =====================================================
  // CREATE / EDIT MODAL
  // =====================================================

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  // =====================================================
  // VIEW MODAL
  // =====================================================

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [viewingWarehouse, setViewingWarehouse] = useState(null);

  // =====================================================
  // QUERY PARAMS
  // =====================================================

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (isActive !== "ALL") {
      params.isActive = isActive;
    }

    return params;
  }, [page, limit, search, isActive]);

  // =====================================================
  // GET WAREHOUSES
  // =====================================================

  const { data, isLoading, refetch } = useWarehouses(queryParams);

  // =====================================================
  // MUTATIONS
  // =====================================================

  const createWarehouse = useCreateWarehouse();

  const updateWarehouse = useUpdateWarehouse();

  const deleteWarehouse = useDeleteWarehouse();

  const saving = createWarehouse.isPending || updateWarehouse.isPending;

  // =====================================================
  // RESPONSE DATA
  // =====================================================

  const warehouses = data?.data?.warehouses || [];

  const pagination = data?.data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 1,
  };

  // =====================================================
  // STATS
  // =====================================================

  const warehouseStats = useMemo(() => {
    const total = Number(pagination?.total) || 0;

    const active = warehouses.filter(
      (warehouse) => warehouse?.isActive === true,
    ).length;

    const inactive = warehouses.filter(
      (warehouse) => warehouse?.isActive === false,
    ).length;

    return {
      total,
      active,
      inactive,
    };
  }, [warehouses, pagination?.total]);

  // =====================================================
  // STATS CARDS
  // =====================================================

  const stats = useMemo(
    () => [
      {
        id: "total",
        title: "Total Warehouses",
        value: warehouseStats.total,
        description: "Total warehouses",
        icon: Warehouse,
        iconClassName: "bg-primary/10 text-primary",
      },

      {
        id: "active",
        title: "Active Warehouses",
        value: warehouseStats.active,
        description: "Currently active",
        icon: CheckCircle2,
        iconClassName: "bg-green-500/10 text-green-600",
      },

      {
        id: "inactive",
        title: "Inactive Warehouses",
        value: warehouseStats.inactive,
        description: "Currently inactive",
        icon: XCircle,
        iconClassName: "bg-red-500/10 text-red-600",
      },
    ],
    [warehouseStats],
  );

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {
    setEditingWarehouse(null);
    setModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setModalOpen(true);
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = (warehouse) => {
    setViewingWarehouse(warehouse);
    setViewModalOpen(true);
  };

  // =====================================================
  // CLOSE VIEW
  // =====================================================

  const handleCloseView = () => {
    setViewModalOpen(false);
    setViewingWarehouse(null);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (warehouse) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${warehouse?.name}?`,
    );

    if (!confirmed) return;

    try {
      await deleteWarehouse.mutateAsync(warehouse.id);

      await refetch();
    } catch (error) {
      console.error("Failed to delete warehouse:", error);
    }
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (formData) => {
    try {
      if (editingWarehouse) {
        await updateWarehouse.mutateAsync({
          id: editingWarehouse.id,
          payload: formData,
        });
      } else {
        await createWarehouse.mutateAsync(formData);
      }

      setModalOpen(false);
      setEditingWarehouse(null);

      await refetch();
    } catch (error) {
      console.error("Failed to save warehouse:", error);
    }
  };

  // =====================================================
  // CLOSE FORM MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingWarehouse(null);
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatusChange = (value) => {
    setIsActive(value);
    setPage(1);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = () => {
    setSearch("");
    setIsActive("ALL");
    setPage(1);
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <PageHeader
        icon={Warehouse}
        title="Warehouses"
        description="Manage your warehouses and inventory locations"
        secondaryAction={{
          label: "Refresh",
          icon: (
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          ),
          onClick: refetch,
          disabled: isLoading,
        }}
        primaryAction={{
          label: "Add Warehouse",
          icon: <Plus size={17} />,
          onClick: handleAdd,
        }}
      />

      {/* =================================================
          STATS
      ================================================= */}

      <StatsCards stats={stats} columns={3} />

      {/* =================================================
          FILTERS
      ================================================= */}

      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search warehouses..."
        filters={[
          {
            name: "isActive",
            value: isActive,
            onChange: handleStatusChange,
            placeholder: "All Status",
            options: [
              {
                value: "ALL",
                label: "All Status",
              },
              {
                value: "true",
                label: "Active",
              },
              {
                value: "false",
                label: "Inactive",
              },
            ],
          },
        ]}
        onClear={handleClearFilters}
      />

      {/* =================================================
          WAREHOUSE CARDS
      ================================================= */}

      <WarehousesCards
        warehouses={warehouses}
        loading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={Number(pagination?.page) || page}
        totalPages={Number(pagination?.totalPages) || 1}
        total={Number(pagination?.total) || 0}
        limit={Number(pagination?.limit) || limit}
        onPageChange={setPage}
      />

      {/* =================================================
          CREATE / EDIT
      ================================================= */}

      <WarehouseModal
        open={modalOpen}
        onClose={handleCloseModal}
        warehouse={editingWarehouse}
        onSubmit={handleSubmit}
        loading={saving}
      />

      {/* =================================================
          VIEW
      ================================================= */}

      <WarehouseViewModal
        open={viewModalOpen}
        warehouse={viewingWarehouse}
        onClose={handleCloseView}
      />
    </div>
  );
}
