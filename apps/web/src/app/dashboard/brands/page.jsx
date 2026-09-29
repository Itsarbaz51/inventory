"use client";

import React, {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  RefreshCw,
  Tag,
  Layers3,
} from "lucide-react";

import BrandModal from "@/components/models/BrandModal";
import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";

import useToast from "@/hooks/useToast";
import useBrands from "@/hooks/brands/useBrands";
import useCreateBrand from "@/hooks/brands/useCreateBrand";
import useUpdateBrand from "@/hooks/brands/useUpdateBrand";
import useDeleteBrand from "@/hooks/brands/useDeleteBrand";
import BrandsCard from "@/components/cards/BrandsCard";

export default function BrandsPage() {
  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingBrand, setEditingBrand] =
    useState(null);

  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(12);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  const toast = useToast();



  const createBrand =
    useCreateBrand();

  const updateBrand =
    useUpdateBrand();

  const deleteBrand =
    useDeleteBrand();

  // =====================================================
  // RESPONSE
  // =====================================================

  const {
    data: brandResponse,
    isLoading,
    isFetching,
    refetch,
  } = useBrands({
    page,
    limit,
    search,
    status,
  });

  const brands = brandResponse?.data?.brands || brandResponse?.data || [];

  const pagination = brandResponse?.data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 0,
  };


  // =====================================================
  // LOADING
  // =====================================================

  const loading =
    isLoading || isFetching;

  const saving =
    createBrand.isPending ||
    updateBrand.isPending ||
    deleteBrand.isPending;

  // =====================================================
  // STATS
  // =====================================================

  const brandStats = useMemo(() => {
    const total =
      Number(pagination?.total) ||
      brands.length;

    const active =
      brands.filter(
        (brand) =>
          brand?.isActive,
      ).length;

    return {
      total,
      active,
    };
  }, [brands, pagination]);

  const stats = useMemo(
    () => [
      {
        id: "total",
        title: "Total Brands",
        value: brandStats.total,
        description:
          "Total equipment brands",
        icon: Tag,
        iconClassName:
          "bg-primary/10 text-primary",
      },

      {
        id: "active",
        title: "Active",
        value: brandStats.active,
        description:
          "Active brands in current page",
        icon: Layers3,
        iconClassName:
          "bg-green-500/10 text-green-600",
      },
    ],
    [brandStats],
  );

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {
    setEditingBrand(null);
    setModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setModalOpen(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (brand) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${brand?.name}"?`,
      );

    if (!confirmed) return;

    try {
      const response =
        await deleteBrand.mutateAsync(
          brand?.id,
        );

      toast.success(
        response?.message ||
        "Brand deleted successfully",
        "Brand success",
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to delete brand";

      toast.error(
        message,
        "Brand failed",
      );
    }
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (
    formData,
  ) => {
    try {
      if (editingBrand) {
        const response =
          await updateBrand.mutateAsync({
            id: editingBrand.id,
            payload: formData,
          });

        toast.success(
          response?.message ||
          "Brand updated successfully",
          "Brand success",
        );
      } else {
        const response =
          await createBrand.mutateAsync(
            formData,
          );

        toast.success(
          response?.message ||
          "Brand created successfully",
          "Brand success",
        );
      }

      setModalOpen(false);
      setEditingBrand(null);
    } catch (error) {
      const message =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Failed to save brand";

      toast.error(
        message,
        "Brand failed",
      );
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingBrand(null);
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to refresh brands";

      toast.error(
        message,
        "Brand failed",
      );
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (
    value,
  ) => {
    setSearch(value);
    setPage(1);
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatusChange = (
    value,
  ) => {
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

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">

      {/* Header */}

      <PageHeader
        icon={Tag}
        title="Brands"
        description="Manage your gym equipment brands"
        secondaryAction={{
          label: "Refresh",

          icon: (
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
          ),

          onClick: handleRefresh,
          disabled: loading,
        }}

        primaryAction={{
          label: "Add Brand",
          icon: <Plus size={17} />,
          onClick: handleAdd,
        }}
      />

      {/* Stats */}

      <StatsCards
        stats={stats}
        columns={4}
      />

      {/* Filters */}

      <FilterBar
        search={search}
        onSearchChange={
          handleSearchChange
        }
        searchPlaceholder="Search brands..."
        onClear={handleClear}
        filters={[
          {
            name: "status",

            value: status,

            onChange:
              handleStatusChange,

            placeholder:
              "All Status",

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

      {/* Brand Cards */}

      <BrandsCard
        brands={brands}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={
          Number(
            pagination.page,
          ) || page
        }
        totalPages={
          Number(
            pagination.totalPages,
          ) || 1
        }
        total={
          Number(
            pagination.total,
          ) || 0
        }
        limit={
          Number(
            pagination.limit,
          ) || limit
        }
        onPageChange={setPage}
      />

      {/* Modal */}

      <BrandModal
        open={modalOpen}
        onClose={
          handleCloseModal
        }
        brand={editingBrand}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
