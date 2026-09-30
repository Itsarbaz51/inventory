"use client";

import React from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CalendarDays,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function CustomerViewModal({ open, customer, onClose }) {
  if (!open || !customer) return null;

  const statusClass = customer.isActive
    ? "bg-green-500/10 text-green-600"
    : "bg-red-500/10 text-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        {/* HEADER */}

        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {customer.name?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div>
              <h2 className="text-lg font-semibold">{customer.name || "-"}</h2>

              <p className="text-sm text-muted-foreground">Customer Details</p>
            </div>
          </div>
        </div>

        {/* BODY */}

        <div className="space-y-6 px-6 py-5">
          <section>
            <h3 className="mb-4 text-sm font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<UserRound size={17} />}
                label="Customer"
                value={customer.name}
              />

              <InfoItem
                icon={<Phone size={17} />}
                label="Phone"
                value={customer.phone}
              />

              <InfoItem
                icon={<Mail size={17} />}
                label="Email"
                value={customer.email}
              />

              <InfoItem
                icon={<CreditCard size={17} />}
                label="GST Number"
                value={customer.gstNumber}
              />

              <InfoItem
                icon={<CreditCard size={17} />}
                label="PAN Number"
                value={customer.panNumber}
              />

              <div>
                <p className="mb-1 text-xs text-muted-foreground">Status</p>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
                >
                  {customer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </section>

          <div className="border-t border-border" />

          <section>
            <h3 className="mb-4 text-sm font-semibold">Address</h3>

            <div className="space-y-4">
              <InfoItem
                icon={<MapPin size={17} />}
                label="Billing Address"
                value={customer.billingAddress}
              />

              <InfoItem
                icon={<MapPin size={17} />}
                label="Shipping Address"
                value={customer.shippingAddress}
              />

              <div className="grid grid-cols-3 gap-4">
                <InfoItem label="City" value={customer.city} />

                <InfoItem label="State" value={customer.state} />

                <InfoItem label="Pincode" value={customer.pincode} />
              </div>
            </div>
          </section>

          <div className="border-t border-border" />

          <section>
            <h3 className="mb-4 text-sm font-semibold">Account</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoItem
                label="Opening Balance"
                value={`₹${Number(customer.openingBalance || 0).toLocaleString(
                  "en-IN",
                )}`}
              />

              <InfoItem
                label="Credit Limit"
                value={
                  customer.creditLimit != null
                    ? `₹${Number(customer.creditLimit).toLocaleString("en-IN")}`
                    : "-"
                }
              />

              <InfoItem
                label="Payment Terms"
                value={
                  customer.paymentTerms != null
                    ? `${customer.paymentTerms} days`
                    : "-"
                }
              />
            </div>
          </section>

          {customer.createdAt && (
            <>
              <div className="border-t border-border" />

              <InfoItem
                icon={<CalendarDays size={17} />}
                label="Created At"
                value={formatDate(customer.createdAt)}
              />
            </>
          )}
        </div>

        {/* FOOTER */}

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

      <p className="truncate text-sm font-medium text-foreground">
        {value || "-"}
      </p>
    </div>
  );
}
