"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
  Ruler,
  CheckCircle2,
  Boxes,
} from "lucide-react";

import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";

import UnitModal from "@/components/models/UnitModal";
import UnitsCards from "@/components/cards/UnitsCards";

import useToast from "@/hooks/useToast";
import useUnits from "@/hooks/unit/useUnits";
import useCreateUnit from "@/hooks/unit/useCreateUnit";
import useUpdateUnit from "@/hooks/unit/useUpdateUnit";
import useDeleteUnit from "@/hooks/unit/useDeleteUnit";

export default function UnitsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const toast = useToast();

  // =====================================================
  // QUERY
  // =====================================================

  const {
    data: unitResponse,
    isLoading,
    isFetching,
    refetch,
  } = useUnits({
    page,
    limit,
    search,
    status,
  });

  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const deleteUnit = useDeleteUnit();

  const units = unitResponse?.data?.units || [];

  const pagination = unitResponse?.data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 0,
  };

  const loading = isLoading || isFetching;

  const saving =
    createUnit.isPending ||
    updateUnit.isPending ||
    deleteUnit.isPending;

  // =====================================================
  // STATS
  // =====================================================

  const unitStats = useMemo(() => {
    const total = pagination.total || 0;

    const active = units.filter(
      (unit) => unit?.isActive,
    ).length;

    const products = units.reduce(
      (sum, unit) => sum + (unit?._count?.products || 0),
      0,
    );

    return {
      total,
      active,
      products,
    };
  }, [units, pagination.total]);

  const stats = useMemo(
    () => [
      {
        id: "total",
        title: "Total Units",
        value: unitStats.total,
        description: "Measurement units",
        icon: Ruler,
        iconClassName: "bg-primary/10 text-primary",
      },
      {
        id: "active",
        title: "Active Units",
        value: unitStats.active,
        description: "Currently active",
        icon: CheckCircle2,
        iconClassName: "bg-green-500/10 text-green-600",
      },
      {
        id: "products",
        title: "Products",
        value: unitStats.products,
        description: "Products using these units",
        icon: Boxes,
        iconClassName: "bg-blue-500/10 text-blue-600",
      },
    ],
    [unitStats],
  );

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {
    setEditingUnit(null);
    setModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setModalOpen(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (unit) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${unit?.name}"?`,
    );

    if (!confirmed) return;

    try {
      const response = await deleteUnit.mutateAsync(unit.id);

      toast.success(
        response?.message || "Unit deleted successfully",
        "Unit success",
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to delete unit";

      toast.error(message, "Unit failed");
    }
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (formData) => {
    try {
      if (editingUnit) {
        const response = await updateUnit.mutateAsync({
          id: editingUnit.id,
          payload: formData,
        });

        toast.success(
          response?.message || "Unit updated successfully",
          "Unit success",
        );
      } else {
        const response = await createUnit.mutateAsync(formData);

        toast.success(
          response?.message || "Unit created successfully",
          "Unit success",
        );
      }

      setModalOpen(false);
      setEditingUnit(null);
    } catch (error) {
      const message =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Failed to save unit";

      toast.error(message, "Unit failed");
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingUnit(null);
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch {
      toast.error(
        "Failed to refresh units",
        "Unit failed",
      );
    }
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
    setStatus(value);
    setPage(1);
  };

  // =====================================================
  // CLEAR
  // =====================================================

  const handleClear = () => {
    setSearch("");
    setStatus("ALL");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Ruler}
        title="Units"
        description="Manage measurement units used across your products"
        secondaryAction={{
          label: "Refresh",
          icon: (
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
          ),
          onClick: handleRefresh,
          disabled: loading,
        }}
        primaryAction={{
          label: "Add Unit",
          icon: <Plus size={17} />,
          onClick: handleAdd,
        }}
      />

      <StatsCards stats={stats} columns={3} />

      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search units..."
        onClear={handleClear}
        filters={[
          {
            name: "status",
            value: status,
            onChange: handleStatusChange,
            placeholder: "All Status",
            options: [
              {
                value: "ALL",
                label: "All Status",
              },
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "INACTIVE",
                label: "Inactive",
              },
            ],
          },
        ]}
      />

      <UnitsCards
        units={units}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={Number(pagination.page) || page}
        totalPages={Number(pagination.totalPages) || 1}
        total={Number(pagination.total) || 0}
        limit={Number(pagination.limit) || limit}
        onPageChange={setPage}
      />

      <UnitModal
        open={modalOpen}
        onClose={handleCloseModal}
        unit={editingUnit}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
