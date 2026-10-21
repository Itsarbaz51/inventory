"use client";

import React from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  Trash2,
  Package,
} from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";
import { formatDate } from "@/lib/utils";

export default function StockMovementTable({
  movements,
  loading,
  onView,
  onDelete,

  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) {
  if (loading) {
    return (
      <LoadingState message="Loading stock movements..." />
    );
  }

  if (!movements?.length) {
    return (
      <EmptyState
        title="No stock movements found"
        description="Try changing your filters or create a new stock movement."
      />
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border border-border
        bg-card
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Product
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Warehouse
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Movement
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Reference
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                Before
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                Quantity
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                After
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Date
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {movements.map((movement) => {
              const isIn =
                movement.movementType?.endsWith(
                  "_IN",
                ) ||
                movement.movementType ===
                  "OPENING_STOCK" ||
                movement.movementType ===
                  "PURCHASE" ||
                movement.movementType ===
                  "SALES_RETURN";

              return (
                <tr
                  key={movement.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {/* PRODUCT */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex h-10 w-10 shrink-0
                          items-center justify-center
                          rounded-lg
                          bg-primary/10
                          text-primary
                        "
                      >
                        <Package size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {movement.product?.name ||
                            movement.productName ||
                            "Product"}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {movement.productId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* WAREHOUSE */}

                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm">
                        {movement.warehouse?.name ||
                          movement.warehouseName ||
                          "Warehouse"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {movement.warehouseId}
                      </p>
                    </div>
                  </td>

                  {/* MOVEMENT */}

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex items-center gap-1.5
                        rounded-full px-2.5 py-1
                        text-xs font-medium
                        ${
                          isIn
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }
                      `}
                    >
                      {isIn ? (
                        <ArrowDownToLine
                          size={13}
                        />
                      ) : (
                        <ArrowUpFromLine
                          size={13}
                        />
                      )}

                      {formatMovementType(
                        movement.movementType,
                      )}
                    </span>
                  </td>

                  {/* REFERENCE */}

                  <td className="px-5 py-4">
                    <p className="text-sm">
                      {formatMovementType(
                        movement.referenceType,
                      )}
                    </p>

                    {movement.referenceId && (
                      <p className="max-w-32 truncate text-xs text-muted-foreground">
                        {movement.referenceId}
                      </p>
                    )}
                  </td>

                  {/* BEFORE */}

                  <td className="px-5 py-4 text-right text-sm text-muted-foreground">
                    {movement.beforeQuantity}
                  </td>

                  {/* QUANTITY */}

                  <td className="px-5 py-4 text-right">
                    <span
                      className={`
                        text-sm font-semibold
                        ${
                          isIn
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      `}
                    >
                      {isIn ? "+" : "-"}
                      {movement.quantity}
                    </span>
                  </td>

                  {/* AFTER */}

                  <td className="px-5 py-4 text-right text-sm font-semibold">
                    {movement.afterQuantity}
                  </td>

                  {/* DATE */}

                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {movement.createdAt
                      ? formatDate(
                          movement.createdAt,
                        )
                      : "-"}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onView(movement)
                        }
                        title="View"
                      >
                        <Eye size={16} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onDelete(movement)
                        }
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
        loading={loading}
      />

      <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        Showing {movements.length} stock movements
      </div>
    </div>
  );
}

function formatMovementType(value) {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}