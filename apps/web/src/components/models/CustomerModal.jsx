"use client";

import React from "react";
import { X } from "lucide-react";

import Button from "@/components/ui/Button";
import CustomerForm from "../forms/CustomerForm";

export default function CustomerModal({
  open,
  onClose,
  customer,
  onSubmit,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center sm:p-6">
      <div className="relative my-4 flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:my-6 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)]">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              {customer ? "Edit Customer" : "Add Customer"}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {customer
                ? "Update customer information."
                : "Create a new customer account."}
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        {/* FORM */}

        <div className="overflow-y-auto p-6">
          <CustomerForm
            customer={customer}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
