"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, FolderTree, Layers3 } from "lucide-react";

import CategoryModal from "@/components/models/CategoryModal";
import StatsCards from "@/components/ui/StatsCards";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import CategoriesTable from "@/components/tables/CategoriesTable";
import useToast from "@/hooks/useToast";
import categoryService from "@/services/categoryApi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const toast = useToast();

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await categoryService.getAll();

      setCategories(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      setCategories([]);

      const message =
        error?.response?.data?.message || "Failed to fetch categories";

      toast.error(message, "Category failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredCategories = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return categories.filter((category) => {
      if (!searchValue) return true;

      return (
        category?.name?.toLowerCase().includes(searchValue) ||
        category?.parent?.name?.toLowerCase().includes(searchValue)
      );
    });
  }, [categories, search]);

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
        description: "All categories",
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
      await categoryService.delete(category?.id);

      toast.success("Category deleted successfully", "Category success");

      await fetchCategories();
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
      setSaving(true);

      if (editingCategory) {
        const response = await categoryService.update(
          editingCategory.id,
          formData,
        );

        toast.success(
          response?.message || "Category updated successfully",
          "Category success",
        );
      } else {
        const response = await categoryService.create(formData);

        toast.success(
          response?.message || "Category created successfully",
          "Category success",
        );
      }

      setModalOpen(false);
      setEditingCategory(null);

      await fetchCategories();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to save category";

      toast.error(message, "Category failed");
    } finally {
      setSaving(false);
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
          onClick: fetchCategories,
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
        onSearchChange={setSearch}
        searchPlaceholder="Search categories..."
        onClear={() => {
          setSearch("");
        }}
      />

      <CategoriesTable
        categories={filteredCategories}
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
