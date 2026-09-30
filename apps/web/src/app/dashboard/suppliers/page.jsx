"use client";

import React, { useMemo, useState } from "react";

import {
  Building2,
  Plus,
  RefreshCw,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import StatsCards from "@/components/ui/StatsCards";
import FilterBar from "@/components/ui/FilterBar";

import SuppliersCard from "@/components/cards/SuppliersCard";

import SupplierModal from "@/components/models/SupplierModal";
import SupplierViewModal from "@/components/models/view/SupplierViewModal";

import useSuppliers from "@/hooks/suppliers/useSuppliers";
import useCreateSupplier from "@/hooks/suppliers/useCreateSupplier";
import useUpdateSupplier from "@/hooks/suppliers/useUpdateSupplier";

export default function SuppliersPage() {
  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] = useState("");

  const [isActive, setIsActive] = useState("ALL");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(12);

  // =====================================================
  // MODALS
  // =====================================================

  const [modalOpen, setModalOpen] = useState(false);

  const [editingSupplier, setEditingSupplier] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [viewingSupplier, setViewingSupplier] = useState(null);

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
  // GET SUPPLIERS
  // =====================================================

  const { data, isLoading, refetch } = useSuppliers(queryParams);

  // =====================================================
  // MUTATIONS
  // =====================================================

  const createSupplier = useCreateSupplier();

  const updateSupplier = useUpdateSupplier();

  const saving = createSupplier.isPending || updateSupplier.isPending;

  // =====================================================
  // RESPONSE
  // =====================================================

  const suppliers = data?.data?.suppliers || data?.data || [];

  const pagination = data?.data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 1,
  };

  // =====================================================
  // STATS
  // =====================================================

  const supplierStats = useMemo(() => {
    const total = Number(pagination?.total) || 0;

    const active = suppliers.filter(
      (supplier) => supplier?.isActive === true,
    ).length;

    const inactive = suppliers.filter(
      (supplier) => supplier?.isActive === false,
    ).length;

    return {
      total,
      active,
      inactive,
    };
  }, [suppliers, pagination?.total]);

  const stats = useMemo(
    () => [
      {
        id: "total",
        title: "Total Suppliers",
        value: supplierStats.total,
        description: "Total registered suppliers",
        icon: Users,
        iconClassName: "bg-primary/10 text-primary",
      },

      {
        id: "active",
        title: "Active Suppliers",
        value: supplierStats.active,
        description: "Currently active",
        icon: UserCheck,
        iconClassName: "bg-green-500/10 text-green-600",
      },

      {
        id: "inactive",
        title: "Inactive Suppliers",
        value: supplierStats.inactive,
        description: "Currently inactive",
        icon: UserX,
        iconClassName: "bg-red-500/10 text-red-600",
      },
    ],
    [supplierStats],
  );

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setModalOpen(true);
  };

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = (supplier) => {
    setViewingSupplier(supplier);
    setViewModalOpen(true);
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (formData) => {
    try {
      if (editingSupplier) {
        await updateSupplier.mutateAsync({
          id: editingSupplier.id,
          payload: formData,
        });
      } else {
        await createSupplier.mutateAsync(formData);
      }

      setModalOpen(false);
      setEditingSupplier(null);

      await refetch();
    } catch (error) {
      console.error("Failed to save supplier:", error);
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingSupplier(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setViewingSupplier(null);
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setIsActive(value);
    setPage(1);
  };

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
      {/* Header */}

      <PageHeader
        icon={Building2}
        title="Suppliers"
        description="Manage suppliers and supplier accounts"
        secondaryAction={{
          label: "Refresh",
          icon: (
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          ),
          onClick: refetch,
          disabled: isLoading,
        }}
        primaryAction={{
          label: "Add Supplier",
          icon: <Plus size={17} />,
          onClick: handleAdd,
        }}
      />

      {/* Stats */}

      <StatsCards stats={stats} columns={3} />

      {/* Filters */}

      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search suppliers..."
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

      {/* Cards */}

      <SuppliersCard
        suppliers={suppliers}
        loading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        page={Number(pagination.page) || page}
        totalPages={Number(pagination.totalPages) || 1}
        total={Number(pagination.total) || 0}
        limit={Number(pagination.limit) || limit}
        onPageChange={setPage}
      />

      {/* Create / Edit */}

      <SupplierModal
        open={modalOpen}
        onClose={handleCloseModal}
        supplier={editingSupplier}
        onSubmit={handleSubmit}
        loading={saving}
      />

      {/* View */}

      <SupplierViewModal
        open={viewModalOpen}
        supplier={viewingSupplier}
        onClose={handleCloseViewModal}
      />
    </div>
  );
}
