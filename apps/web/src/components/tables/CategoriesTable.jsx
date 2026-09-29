"use client";

import React from "react";
import { Edit, Trash2, FolderTree } from "lucide-react";
import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";

export default function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
}) {
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
        <table className="w-full min-w-175">
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
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-muted/30"
              >
                {/* Category */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
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

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {category.name}
                      </p>

                      {category.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Parent */}
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {category.parent?.name || "Main Category"}
                </td>

                {/* Products */}
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

                {/* Status */}
                <td className="px-5 py-4 text-center">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      ${
                        category.isActive
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }
                    `}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Button>

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
            ))}
          </tbody>
        </table>
      </div>

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
        Showing {categories.length} categories
      </div>
    </div>
  );
}
