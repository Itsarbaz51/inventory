"use client";

import React from "react";
import {
  Edit,
  Trash2,
  Ruler,
  Package,
} from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";

export default function UnitsCards({
  units,
  loading,
  onEdit,
  onDelete,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) {
  if (loading) {
    return <LoadingState message="Loading units..." />;
  }

  if (!units?.length) {
    return (
      <EmptyState
        title="No units found"
        description="Create your first measurement unit."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {units.map((unit) => (
          <div
            key={unit.id}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-card
              p-5
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:border-primary/30
              hover:shadow-md
            "
          >
            {/* Top */}

            <div className="flex items-start justify-between">
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <Ruler size={21} />
              </div>

              <span
                className={`
                  rounded-full
                  px-2.5 py-1
                  text-[11px]
                  font-medium
                  ${
                    unit.isActive
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  }
                `}
              >
                {unit.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Unit */}

            <div className="mt-5">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold">
                  {unit.name}
                </h3>

                <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                  {unit.shortName}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Measurement unit
              </p>
            </div>

            {/* Products */}

            <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/40 px-3 py-3">
              <div className="flex items-center gap-2">
                <Package
                  size={15}
                  className="text-muted-foreground"
                />

                <span className="text-xs text-muted-foreground">
                  Products
                </span>
              </div>

              <span className="text-sm font-semibold">
                {unit?._count?.products ?? 0}
              </span>
            </div>

            {/* Actions */}

            <div className="mt-4 flex justify-end gap-1 border-t border-border pt-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(unit)}
                title="Edit unit"
              >
                <Edit size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(unit)}
                title="Delete unit"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
        loading={loading}
      />
    </div>
  );
}
