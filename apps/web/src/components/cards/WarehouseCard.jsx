"use client";

import React from "react";
import {
  Warehouse,
  MapPin,
  Phone,
  UserRound,
  CalendarDays,
  Edit,
  Eye,
  Trash2,
  Hash,
} from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/lib/utils";

export default function WarehousesCards({
  warehouses,
  loading,
  onEdit,
  onDelete,
  onView,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) {
  if (loading) {
    return <LoadingState message="Loading warehouses..." />;
  }

  if (!warehouses?.length) {
    return (
      <EmptyState
        title="No warehouses found"
        description="Try changing your filters or add a new warehouse."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* =====================================================
          GRID
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {warehouses.map((warehouse) => {
          const isActive = warehouse?.isActive;

          return (
            <div
              key={warehouse.id}
              className="
                group
                overflow-hidden
                rounded-xl
                border border-border
                bg-card
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="border-b border-border p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-primary/10
                        text-primary
                      "
                    >
                      <Warehouse size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">
                        {warehouse?.name || "-"}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5">
                        <Hash size={13} className="text-muted-foreground" />

                        <span className="truncate text-xs text-muted-foreground">
                          {warehouse?.code || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`
                      inline-flex shrink-0
                      rounded-full
                      px-2.5 py-1
                      text-xs font-medium
                      ${
                        isActive
                          ? "bg-green-500/10 text-green-600"
                          : "bg-destructive/10 text-destructive"
                      }
                    `}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* =================================================
                  BODY
              ================================================= */}

              <div className="space-y-4 p-5">
                <InfoItem
                  icon={<MapPin size={16} />}
                  label="Address"
                  value={getAddress(warehouse)}
                />

                <InfoItem
                  icon={<UserRound size={16} />}
                  label="Manager"
                  value={warehouse?.managerName}
                />

                <InfoItem
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={warehouse?.phone}
                />

                <InfoItem
                  icon={<CalendarDays size={16} />}
                  label="Created"
                  value={
                    warehouse?.createdAt ? formatDate(warehouse.createdAt) : "-"
                  }
                />
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div
                className="
                  flex items-center justify-between
                  border-t border-border
                  bg-muted/20
                  px-5 py-3
                "
              >
                <span className="text-xs text-muted-foreground">Warehouse</span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(warehouse)}
                    title="View"
                  >
                    <Eye size={16} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(warehouse)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(warehouse)}
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
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

      <div className="text-xs text-muted-foreground">
        Showing {warehouses.length} warehouses
        {total != null ? ` of ${total}` : ""}
      </div>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div
        className="
          mt-0.5
          flex h-8 w-8 shrink-0
          items-center justify-center
          rounded-lg
          bg-muted
          text-muted-foreground
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-0.5 truncate text-sm font-medium" title={value || "-"}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ADDRESS
========================================================= */

function getAddress(warehouse) {
  const parts = [
    warehouse?.address,
    warehouse?.city,
    warehouse?.state,
    warehouse?.pincode,
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : "-";
}
