"use client";

import React, { useState } from "react";
import {
  Edit,
  Trash2,
  FolderTree,
  Plus,
  ChevronRight,
} from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";

export default function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
  onAddSubcategory,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) {
  const [expandedIds, setExpandedIds] = useState(new Set());

  if (loading) {
    return <LoadingState message="Loading categories..." />;
  }

  if (!categories?.length) {
    return (
      <EmptyState
        title="No categories found"
        description="Add your first category to start organizing products."
      />
    );
  }

  // =====================================================
  // TOGGLE CATEGORY
  // =====================================================

  const toggleCategory = (categoryId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);

      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }

      return next;
    });
  };

  // =====================================================
  // CHECK EXPANDED
  // =====================================================

  const isExpanded = (categoryId) => {
    return expandedIds.has(categoryId);
  };

  // =====================================================
  // RECURSIVE CATEGORY ROW
  // =====================================================

  const renderCategory = (category, level = 0) => {
    const children = category?.children || [];
    const hasChildren = children.length > 0;
    const expanded = isExpanded(category.id);

    return (
      <React.Fragment key={category.id}>
        <tr className="transition-colors hover:bg-muted/30">
          {/* =================================================
              CATEGORY
          ================================================= */}

          <td className="px-5 py-4">
            <div
              className="flex items-center gap-3"
              style={{
                paddingLeft: `${level * 28}px`,
              }}
            >
              {/* Expand / Collapse */}
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() =>
                    toggleCategory(category.id)
                  }
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded
                    text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                  "
                  title={
                    expanded
                      ? "Collapse"
                      : "Expand"
                  }
                >
                  <ChevronRight
                    size={16}
                    className={`
                      transition-transform
                      duration-200
                      ${expanded ? "rotate-90" : ""}
                    `}
                  />
                </button>
              ) : (
                // Keep alignment for categories
                // that don't have children
                <div className="h-6 w-6 shrink-0" />
              )}

              {/* Category Icon */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                "
              >
                <FolderTree size={18} />
              </div>

              {/* Category Info */}
              <button
                type="button"
                onClick={() => {
                  if (hasChildren) {
                    toggleCategory(category.id);
                  }
                }}
                disabled={!hasChildren}
                className={`
                  min-w-0
                  text-left
                  ${hasChildren
                    ? "cursor-pointer"
                    : "cursor-default"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">
                    {category.name}
                  </p>

                  {level === 0 && (
                    <span
                      className="
                        rounded-full
                        bg-primary/10
                        px-2
                        py-0.5
                        text-[10px]
                        font-medium
                        text-primary
                      "
                    >
                      Main
                    </span>
                  )}
                </div>

                {category.description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </button>
            </div>
          </td>

          {/* =================================================
              PARENT
          ================================================= */}

          <td className="px-5 py-4 text-sm text-muted-foreground">
            {category.parent?.name || "Main Category"}
          </td>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <td className="px-5 py-4 text-center">
            <span
              className="
                inline-flex
                min-w-8
                items-center
                justify-center
                rounded-full
                bg-muted
                px-2
                py-1
                text-xs
                font-medium
              "
            >
              {category?._count?.products ?? 0}
            </span>
          </td>

          {/* =================================================
              STATUS
          ================================================= */}

          <td className="px-5 py-4 text-center">
            <span
              className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                ${category.isActive
                  ? "bg-green-500/10 text-green-600"
                  : "bg-red-500/10 text-red-600"
                }
              `}
            >
              {category.isActive
                ? "Active"
                : "Inactive"}
            </span>
          </td>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <td className="px-5 py-4">
            <div className="flex justify-end gap-1">
              {/* Add Subcategory */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onAddSubcategory(category)
                }
                title={`Add subcategory under ${category.name}`}
                className="text-primary hover:text-primary"
              >
                <Plus size={17} />
              </Button>

              {/* Edit */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(category)}
                title="Edit"
              >
                <Edit size={16} />
              </Button>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(category)}
                title="Delete"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </td>
        </tr>

        {/* =================================================
            CHILDREN
            Only render when expanded
        ================================================= */}

        {hasChildren &&
          expanded &&
          children.map((child) =>
            renderCategory(
              child,
              level + 1,
            ),
          )}
      </React.Fragment>
    );
  };

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-card
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-200">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Category
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Under Category
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-muted-foreground">
                Products
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {categories.map((category) =>
              renderCategory(category, 0),
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
        loading={loading}
      />

      {/* Footer */}
      <div
        className="
          border-t
          border-border
          px-5
          py-3
          text-xs
          text-muted-foreground
        "
      >
        Showing {categories.length} main categories
      </div>
    </div>
  );
}
