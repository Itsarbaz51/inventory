"use client";

import React from "react";
import { X, Warehouse } from "lucide-react";

import Button from "@/components/ui/Button";
import WarehouseForm from "../forms/WarehouseForm";

export default function WarehouseModal({
  open,
  onClose,
  warehouse,
  onSubmit,
  loading,
}) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-start justify-center
        overflow-y-auto
        bg-black/50
        p-4
        sm:items-center
        sm:p-6
      "
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          my-4 flex w-full max-w-2xl
          flex-col overflow-hidden
          rounded-xl
          border border-border
          bg-card
          shadow-xl
          sm:my-6
          max-h-[calc(100vh-2rem)]
          sm:max-h-[calc(100vh-3rem)]
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex items-center justify-between
            border-b border-border
            px-6 py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-lg
                bg-primary/10
                text-primary
              "
            >
              <Warehouse size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                {warehouse ? "Edit Warehouse" : "Add Warehouse"}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {warehouse
                  ? "Update warehouse information."
                  : "Create a new warehouse."}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={loading}
          >
            <X size={18} />
          </Button>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="overflow-y-auto p-6">
          <WarehouseForm
            warehouse={warehouse}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
