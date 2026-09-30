"use client";

import React from "react";
import { Eye, Edit, Phone, Mail, MapPin, CreditCard } from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";

export default function CustomersCards({
  customers,
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
    return <LoadingState message="Loading customers..." />;
  }

  if (!customers?.length) {
    return (
      <EmptyState
        title="No customers found"
        description="Try changing your filters or add a new customer."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* HEADER */}

            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {customer.name?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">
                    {customer.name}
                  </h3>

                  <p className="truncate text-xs text-muted-foreground">
                    {customer.phone || "No phone"}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  customer.isActive
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* DETAILS */}

            <div className="mt-5 space-y-3">
              <Detail icon={<Phone size={15} />} value={customer.phone} />

              <Detail icon={<Mail size={15} />} value={customer.email} />

              <Detail
                icon={<MapPin size={15} />}
                value={[customer.city, customer.state]
                  .filter(Boolean)
                  .join(", ")}
              />

              <Detail
                icon={<CreditCard size={15} />}
                value={
                  customer.gstNumber
                    ? `GST: ${customer.gstNumber}`
                    : "GST: Not Available"
                }
              />
            </div>

            {/* ACCOUNT */}

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Outstanding</p>

                <p className="mt-1 text-sm font-semibold">
                  ₹
                  {Number(customer.openingBalance || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Credit Limit</p>

                <p className="mt-1 text-sm font-semibold">
                  {customer.creditLimit != null
                    ? `₹${Number(customer.creditLimit).toLocaleString("en-IN")}`
                    : "-"}
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-5 flex justify-end gap-1 border-t border-border pt-4">
              <Button
                variant="ghost"
                size="icon"
                title="View"
                onClick={() => onView(customer)}
              >
                <Eye size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                title="Edit"
                onClick={() => onEdit(customer)}
              >
                <Edit size={16} />
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

      <div className="text-xs text-muted-foreground">
        Showing {customers.length} of {total} customers
      </div>
    </div>
  );
}

function Detail({ icon, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="shrink-0">{icon}</span>

      <span className="truncate">{value || "-"}</span>
    </div>
  );
}
