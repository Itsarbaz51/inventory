"use client";

import React from "react";
import { X, Building2, Mail, Phone, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function TenantViewModal({
    open,
    onClose,
    tenant,
}) {
    if (!open || !tenant) return null;

    const details = [
        ["Tenant Number", tenant.tenantNumber],
        ["Business Name", tenant.businessName],
        ["Email", tenant.email],
        ["Phone", tenant.phone],
        ["GST Number", tenant.gstNumber],
        ["PAN Number", tenant.panNumber],
        ["Business Type", tenant.businessType],
        ["Country", tenant.country],
        ["State", tenant.state],
        ["City", tenant.city],
        ["Pincode", tenant.pincode],
        ["Address", tenant.address],
        ["Invoice Prefix", tenant.invoicePrefix],
        ["Purchase Prefix", tenant.purchasePrefix],
        ["Sales Return Prefix", tenant.salesReturnPrefix],
        ["Purchase Return Prefix", tenant.purchaseReturnPrefix],
        ["Invoice Start Number", tenant.invoiceStartNumber],
        ["Purchase Start Number", tenant.purchaseStartNumber],
        ["Sales Return Start Number", tenant.salesReturnStartNumber],
        ["Purchase Return Start Number", tenant.purchaseReturnStartNumber],
        ["Low Stock Threshold", tenant.lowStockThreshold],
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="
          relative z-10
          flex w-full max-w-3xl
          max-h-[calc(100vh-24px)]
          sm:max-h-[calc(100vh-40px)]
          flex-col
          overflow-hidden
          rounded-xl
          border border-border
          bg-card
          shadow-xl
        "
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Building2 size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                {tenant.name || "Tenant Details"}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                {tenant.tenantNumber || "-"}
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </Button>
                </div>

                {/* Body */}
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <section>
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Basic Information
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Tenant and business information.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem
                                    label="Tenant Name"
                                    value={tenant.name}
                                />

                                <InfoItem
                                    label="Business Name"
                                    value={tenant.businessName}
                                />

                                <InfoItem
                                    label="Tenant Number"
                                    value={tenant.tenantNumber}
                                />

                                <InfoItem
                                    label="Business Type"
                                    value={tenant.businessType}
                                />

                                <InfoItem
                                    label="Email"
                                    value={tenant.email}
                                    icon={<Mail size={15} />}
                                />

                                <InfoItem
                                    label="Phone"
                                    value={tenant.phone}
                                    icon={<Phone size={15} />}
                                />

                                <InfoItem
                                    label="GST Number"
                                    value={tenant.gstNumber}
                                />

                                <InfoItem
                                    label="PAN Number"
                                    value={tenant.panNumber}
                                />
                            </div>
                        </section>

                        <div className="border-t border-border" />

                        {/* Address */}
                        <section>
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Address
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Tenant business address.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem
                                    label="Address"
                                    value={tenant.address}
                                    icon={<MapPin size={15} />}
                                />

                                <InfoItem
                                    label="City"
                                    value={tenant.city}
                                />

                                <InfoItem
                                    label="State"
                                    value={tenant.state}
                                />

                                <InfoItem
                                    label="Pincode"
                                    value={tenant.pincode}
                                />

                                <InfoItem
                                    label="Country"
                                    value={tenant.country}
                                />
                            </div>
                        </section>

                        <div className="border-t border-border" />

                        {/* Invoice Settings */}
                        <section>
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Invoice & Number Settings
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Document prefixes and starting numbers.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem
                                    label="Invoice Prefix"
                                    value={tenant.invoicePrefix}
                                />

                                <InfoItem
                                    label="Invoice Start Number"
                                    value={tenant.invoiceStartNumber}
                                />

                                <InfoItem
                                    label="Purchase Prefix"
                                    value={tenant.purchasePrefix}
                                />

                                <InfoItem
                                    label="Purchase Start Number"
                                    value={tenant.purchaseStartNumber}
                                />

                                <InfoItem
                                    label="Sales Return Prefix"
                                    value={tenant.salesReturnPrefix}
                                />

                                <InfoItem
                                    label="Sales Return Start Number"
                                    value={tenant.salesReturnStartNumber}
                                />

                                <InfoItem
                                    label="Purchase Return Prefix"
                                    value={tenant.purchaseReturnPrefix}
                                />

                                <InfoItem
                                    label="Purchase Return Start Number"
                                    value={tenant.purchaseReturnStartNumber}
                                />

                                <InfoItem
                                    label="Low Stock Threshold"
                                    value={tenant.lowStockThreshold}
                                />
                            </div>
                        </section>

                        <div className="border-t border-border" />

                        {/* Status & Stats */}
                        <section>
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Status & Usage
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <StatItem
                                    label="Users"
                                    value={tenant._count?.users}
                                />

                                <StatItem
                                    label="Products"
                                    value={tenant._count?.products}
                                />

                                <StatItem
                                    label="Warehouses"
                                    value={tenant._count?.warehouses}
                                />

                                <StatItem
                                    label="Suppliers"
                                    value={tenant._count?.suppliers}
                                />

                                <StatItem
                                    label="Customers"
                                    value={tenant._count?.customers}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoItem
                                    label="Status"
                                    value={tenant.status}
                                    status
                                />

                                <InfoItem
                                    label="Created At"
                                    value={
                                        tenant.createdAt
                                            ? formatDate(tenant.createdAt)
                                            : "-"
                                    }
                                />

                                <InfoItem
                                    label="Updated At"
                                    value={
                                        tenant.updatedAt
                                            ? formatDate(tenant.updatedAt)
                                            : "-"
                                    }
                                />
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-border bg-card px-6 py-4">
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({
    label,
    value,
    icon,
    status = false,
}) {
    const displayValue =
        value === null ||
            value === undefined ||
            value === ""
            ? "-"
            : String(value);

    return (
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
            <p className="mb-1 text-xs text-muted-foreground">
                {label}
            </p>

            <div className="flex items-center gap-2">
                {icon && (
                    <span className="text-muted-foreground">
                        {icon}
                    </span>
                )}

                {status ? (
                    <span
                        className={`
              inline-flex rounded-full px-2.5 py-1
              text-xs font-medium
              ${value === "ACTIVE"
                                ? "bg-green-500/10 text-green-600"
                                : value === "SUSPENDED" ||
                                    value === "BLOCKED"
                                    ? "bg-orange-500/10 text-orange-600"
                                    : "bg-destructive/10 text-destructive"
                            }
            `}
                    >
                        {displayValue}
                    </span>
                ) : (
                    <p className="break-words text-sm font-medium text-foreground">
                        {displayValue}
                    </p>
                )}
            </div>
        </div>
    );
}

function StatItem({ label, value }) {
    return (
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-lg font-semibold text-foreground">
                {value ?? 0}
            </p>
        </div>
    );
}
