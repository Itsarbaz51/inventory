"use client";

import React from "react";
import { Building2, CreditCard, Mail, MapPin, Phone, X } from "lucide-react";

import Button from "@/components/ui/Button";

export default function SupplierViewModal({ open, supplier, onClose }) {
  if (!open || !supplier) {
    return null;
  }

  const statusClass = supplier.isActive
    ? "bg-green-500/10 text-green-600"
    : "bg-red-500/10 text-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building2 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">{supplier.name || "-"}</h2>

              <p className="text-sm text-muted-foreground">
                {supplier.companyName || "Supplier Details"}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        {/* Body */}

        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
          {/* Contact */}

          <section>
            <h3 className="mb-4 text-sm font-semibold">Contact Information</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<Phone size={16} />}
                label="Phone"
                value={supplier.phone}
              />

              <InfoItem
                icon={<Mail size={16} />}
                label="Email"
                value={supplier.email}
              />

              <InfoItem
                icon={<Building2 size={16} />}
                label="Company"
                value={supplier.companyName}
              />

              <InfoItem
                icon={<MapPin size={16} />}
                label="City"
                value={supplier.city}
              />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Tax */}

          <section>
            <h3 className="mb-4 text-sm font-semibold">Tax Information</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="GST Number" value={supplier.gstNumber} />

              <InfoItem label="PAN Number" value={supplier.panNumber} />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Address */}

          <section>
            <h3 className="mb-4 text-sm font-semibold">Address</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<MapPin size={16} />}
                label="Address"
                value={supplier.address}
              />

              <InfoItem label="State" value={supplier.state} />

              <InfoItem label="Pincode" value={supplier.pincode} />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Account */}

          <section>
            <h3 className="mb-4 text-sm font-semibold">Account Information</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoItem
                icon={<CreditCard size={16} />}
                label="Opening Balance"
                value={supplier.openingBalance ?? "0"}
              />

              <InfoItem
                label="Credit Limit"
                value={supplier.creditLimit ?? "-"}
              />

              <InfoItem
                label="Payment Terms"
                value={
                  supplier.paymentTerms != null
                    ? `${supplier.paymentTerms} days`
                    : "-"
                }
              />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Status */}

          <section>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Status</p>

                <p className="text-xs text-muted-foreground">
                  Supplier availability
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
              >
                {supplier.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </section>
        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <p className="break-words text-sm font-medium text-foreground">
        {value || "-"}
      </p>
    </div>
  );
}
