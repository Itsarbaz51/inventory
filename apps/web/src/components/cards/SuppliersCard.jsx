"use client";

import React from "react";
import {
  Building2,
  CreditCard,
  Edit,
  Eye,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";

export default function SuppliersCard({
  suppliers,
  loading,
  onView,
  onEdit,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) {
  if (loading) {
    return <LoadingState message="Loading suppliers..." />;
  }

  if (!suppliers?.length) {
    return (
      <EmptyState
        title="No suppliers found"
        description="Try changing your filters or add a new supplier."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
          >
            {/* Header */}

            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Building2 size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">
                    {supplier.name}
                  </h3>

                  <p className="truncate text-xs text-muted-foreground">
                    {supplier.companyName || "Individual Supplier"}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  supplier.isActive
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {supplier.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Details */}

            <div className="mt-5 space-y-3">
              <Detail
                icon={<Phone size={15} />}
                label="Phone"
                value={supplier.phone}
              />

              <Detail
                icon={<Mail size={15} />}
                label="Email"
                value={supplier.email}
              />

              <Detail
                icon={<MapPin size={15} />}
                label="Location"
                value={[supplier.city, supplier.state]
                  .filter(Boolean)
                  .join(", ")}
              />

              <Detail
                icon={<CreditCard size={15} />}
                label="Credit Limit"
                value={
                  supplier.creditLimit != null
                    ? `₹${Number(supplier.creditLimit).toLocaleString("en-IN")}`
                    : "-"
                }
              />
            </div>

            {/* Account Summary */}

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Opening Balance</p>

                <p className="mt-1 text-sm font-semibold">
                  ₹
                  {Number(supplier.openingBalance || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Payment Terms</p>

                <p className="mt-1 text-sm font-semibold">
                  {supplier.paymentTerms != null
                    ? `${supplier.paymentTerms} days`
                    : "-"}
                </p>
              </div>
            </div>

            {/* Actions */}

            <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(supplier)}
                title="View"
              >
                <Eye size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(supplier)}
                title="Edit"
              >
                <Edit size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
          loading={loading}
        />

        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Showing {suppliers.length} suppliers
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>

      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>

        <p className="truncate text-sm text-foreground">{value || "-"}</p>
      </div>
    </div>
  );
}
