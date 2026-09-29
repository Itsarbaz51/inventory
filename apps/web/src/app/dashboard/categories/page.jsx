"use client";

import React, { useMemo, useState } from "react";
import { Plus, RefreshCw, FolderTree, Layers3 } from "lucide-react";

import CategoryModal from "@/components/models/CategoryModal";
import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import CategoriesTable from "@/components/tables/CategoriesTable";

import useToast from "@/hooks/useToast";
import useCategories from "@/hooks/category/useCategories";
import useCreateCategory from "@/hooks/category/useCreateCategory";
import useUpdateCategory from "@/hooks/category/useUpdateCategory";
import useDeleteCategory from "@/hooks/category/useDeleteCategory";

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [parentType, setParentType] = useState("ALL");

  const toast = useToast();

  // =====================================================
  // CATEGORY QUERY
  // =====================================================

  const {
    data: categoryResponse,
    isLoading,
    isFetching,
    refetch,
  } = useCategories({
    page,
    limit,
    search,
    status,
    parentType,
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Backend response:
  // {
  //   data: [],
  //   meta: {}
  // }

  const categories = categoryResponse?.data || [];

  // =====================================================
  // LOADING
  // =====================================================

  const loading = isLoading || isFetching;

  const saving =
    createCategory.isPending ||
    updateCategory.isPending ||
    deleteCategory.isPending;

  // =====================================================
  // STATS
  // =====================================================

  const categoryStats = useMemo(() => {
    const total = categories.length;

    const active = categories.filter((category) => category?.isActive).length;

    const mainCategories = categories.filter(
      (category) => !category?.parentId,
    ).length;

    const subCategories = categories.filter(
      (category) => category?.parentId,
    ).length;

    return {
      total,
      active,
      mainCategories,
      subCategories,
    };
  }, [categories]);

  // =====================================================
  // STATS CARDS
  // =====================================================

  const stats = useMemo(
    () => [
      {
        id: "total",
        title: "Total Categories",
        value: categoryStats.total,
        description: "Categories in current result",
        icon: FolderTree,
        iconClassName: "bg-primary/10 text-primary",
      },
      {
        id: "active",
        title: "Active",
        value: categoryStats.active,
        description: "Active categories",
        icon: Layers3,
        iconClassName: "bg-green-500/10 text-green-600",
      },
    ],
    [categoryStats],
  );

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category?.name}"?`,
    );

    if (!confirmed) return;

    try {
      const response = await deleteCategory.mutateAsync(category?.id);

      toast.success(
        response?.message || "Category deleted successfully",
        "Category success",
      );
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete category";

      toast.error(message, "Category failed");
    }
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (formData) => {
    try {
      if (editingCategory) {
        const response = await updateCategory.mutateAsync({
          id: editingCategory.id,
          payload: formData,
        });

        toast.success(
          response?.message || "Category updated successfully",
          "Category success",
        );
      } else {
        const response = await createCategory.mutateAsync(formData);

        toast.success(
          response?.message || "Category created successfully",
          "Category success",
        );
      }

      setModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      const message =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Failed to save category";

      toast.error(message, "Category failed");
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingCategory(null);
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to refresh categories";

      toast.error(message, "Category failed");
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
  // CLEAR FILTER
  // =====================================================

  const handleClear = () => {
    setSearch("");
    setStatus("ALL");
    setParentType("ALL");
    setPage(1);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FolderTree}
        title="Categories"
        description="Organize your products into simple categories"
        secondaryAction={{
          label: "Refresh",
          icon: (
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          ),
          onClick: handleRefresh,
          disabled: loading,
        }}
        primaryAction={{
          label: "Add Category",
          icon: <Plus size={17} />,
          onClick: handleAdd,
        }}
      />

      <StatsCards stats={stats} columns={4} />

      <FilterBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search categories..."
        onClear={handleClear}
      />

      <CategoriesTable
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        categories={categories}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
