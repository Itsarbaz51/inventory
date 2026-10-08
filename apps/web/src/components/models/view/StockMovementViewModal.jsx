"use client";

import React from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CalendarDays,
  FileText,
  Package,
  Warehouse,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function StockMovementViewModal({
  open,
  movement,
  onClose,
}) {
  if (!open || !movement) return null;

  const isIn =
    movement.movementType?.endsWith("_IN") ||
    movement.movementType ===
      "OPENING_STOCK" ||
    movement.movementType === "PURCHASE" ||
    movement.movementType ===
      "SALES_RETURN";

  const movementClass = isIn
    ? "bg-green-500/10 text-green-600"
    : "bg-red-500/10 text-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="
          relative z-10
          w-full max-w-2xl
          max-h-[calc(100vh-2rem)]
          overflow-y-auto
          rounded-xl
          border border-border
          bg-card
          shadow-xl
        "
      >
        {/* HEADER */}

        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <div
              className={`
                flex h-12 w-12
                items-center justify-center
                rounded-xl
                ${movementClass}
              `}
            >
              {isIn ? (
                <ArrowDownToLine size={23} />
              ) : (
                <ArrowUpFromLine size={23} />
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Stock Movement
              </h2>

              <p className="text-sm text-muted-foreground">
                {formatMovementType(
                  movement.movementType,
                )}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}

        <div className="space-y-6 px-6 py-5">
          {/* PRODUCT */}

          <section>
            <h3 className="mb-4 text-sm font-semibold">
              Product & Warehouse
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<Package size={17} />}
                label="Product"
                value={
                  movement.product?.name ||
                  movement.productName ||
                  movement.productId
                }
              />

              <InfoItem
                icon={<Warehouse size={17} />}
                label="Warehouse"
                value={
                  movement.warehouse?.name ||
                  movement.warehouseName ||
                  movement.warehouseId
                }
              />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* MOVEMENT */}

          <section>
            <h3 className="mb-4 text-sm font-semibold">
              Movement Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<Boxes size={17} />}
                label="Movement Type"
                value={formatMovementType(
                  movement.movementType,
                )}
              />

              <InfoItem
                label="Reference Type"
                value={formatMovementType(
                  movement.referenceType,
                )}
              />

              <InfoItem
                label="Reference ID"
                value={movement.referenceId}
              />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* QUANTITY */}

          <section>
            <h3 className="mb-4 text-sm font-semibold">
              Quantity
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoItem
                label="Before"
                value={movement.beforeQuantity}
              />

              <InfoItem
                label="Movement"
                value={movement.quantity}
              />

              <InfoItem
                label="After"
                value={movement.afterQuantity}
              />
            </div>
          </section>

          {movement.reason && (
            <>
              <div className="border-t border-border" />

              <section>
                <h3 className="mb-3 text-sm font-semibold">
                  Reason
                </h3>

                <div className="flex gap-3">
                  <FileText
                    size={17}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />

                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {movement.reason}
                  </p>
                </div>
              </section>
            </>
          )}

          {movement.createdAt && (
            <>
              <div className="border-t border-border" />

              <InfoItem
                icon={
                  <CalendarDays size={17} />
                }
                label="Created At"
                value={formatDate(
                  movement.createdAt,
                )}
              />
            </>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-border px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <p className="truncate text-sm font-medium text-foreground">
        {value ?? "-"}
      </p>
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