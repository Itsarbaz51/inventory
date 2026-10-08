"use client";

import React from "react";
import {
    Package,
    Barcode,
    Tag,
    Layers,
    Boxes,
    IndianRupee,
    Percent,
    CalendarDays,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { formatDate, formatMoney } from "@/lib/utils";

export default function ProductViewModal({
    open,
    product,
    onClose,
}) {
    if (!open || !product) return null;

    const statusClass = product.isActive
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
          relative z-10 w-full max-w-2xl
          max-h-[calc(100vh-2rem)]
          overflow-y-auto
          rounded-xl border border-border
          bg-card shadow-xl
        "
            >
                {/* HEADER */}

                <div className="border-b border-border px-6 py-5">
                    <div className="flex items-center gap-4">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-14 w-14 rounded-xl object-cover"
                            />
                        ) : (
                            <div
                                className="
                  flex h-14 w-14 shrink-0
                  items-center justify-center
                  rounded-xl bg-primary/10
                  text-primary
                "
                            >
                                <Package size={25} />
                            </div>
                        )}

                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-semibold">
                                {product.name || "-"}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                SKU: {product.sku || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* BODY */}

                <div className="space-y-6 px-6 py-5">
                    {/* BASIC */}

                    <section>
                        <h3 className="mb-4 text-sm font-semibold">
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoItem
                                icon={<Package size={17} />}
                                label="Product"
                                value={product.name}
                            />

                            <InfoItem
                                icon={<Barcode size={17} />}
                                label="SKU"
                                value={product.sku}
                            />

                            <InfoItem
                                icon={<Barcode size={17} />}
                                label="Barcode"
                                value={product.barcode}
                            />

                            <InfoItem
                                icon={<Tag size={17} />}
                                label="HSN Code"
                                value={product.hsnCode}
                            />

                            <InfoItem
                                icon={<Layers size={17} />}
                                label="Category"
                                value={
                                    product.category?.name ||
                                    product.categoryName ||
                                    product.categoryId
                                }
                            />

                            <InfoItem
                                icon={<Layers size={17} />}
                                label="Brand"
                                value={
                                    product.brand?.name ||
                                    product.brandName ||
                                    product.brandId
                                }
                            />

                            <InfoItem
                                icon={<Boxes size={17} />}
                                label="Unit"
                                value={
                                    product.unit?.name ||
                                    product.unitName ||
                                    product.unitId
                                }
                            />

                            <div>
                                <p className="mb-1 text-xs text-muted-foreground">
                                    Status
                                </p>

                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
                                >
                                    {product.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-border" />

                    {/* PRICING */}

                    <section>
                        <h3 className="mb-4 text-sm font-semibold">
                            Pricing
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <InfoItem
                                icon={<IndianRupee size={17} />}
                                label="Purchase Price"
                                value={formatMoney(product.purchasePrice)}
                            />

                            <InfoItem
                                icon={<IndianRupee size={17} />}
                                label="Selling Price"
                                value={formatMoney(product.sellingPrice)}
                            />

                            <InfoItem
                                icon={<IndianRupee size={17} />}
                                label="MRP"
                                value={formatMoney(product.mrp)}
                            />

                            <InfoItem
                                icon={<Percent size={17} />}
                                label="Tax Rate"
                                value={
                                    product.taxRate != null
                                        ? `${product.taxRate}%`
                                        : "-"
                                }
                            />
                        </div>
                    </section>

                    <div className="border-t border-border" />

                    {/* STOCK */}

                    <section>
                        <h3 className="mb-4 text-sm font-semibold">
                            Stock Settings
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoItem
                                label="Minimum Stock"
                                value={product.minStock}
                            />

                            <InfoItem
                                label="Maximum Stock"
                                value={
                                    product.maxStock != null
                                        ? product.maxStock
                                        : "Unlimited"
                                }
                            />
                        </div>
                    </section>

                    {product.description && (
                        <>
                            <div className="border-t border-border" />

                            <section>
                                <h3 className="mb-3 text-sm font-semibold">
                                    Description
                                </h3>

                                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                    {product.description}
                                </p>
                            </section>
                        </>
                    )}

                    {product.createdAt && (
                        <>
                            <div className="border-t border-border" />

                            <InfoItem
                                icon={<CalendarDays size={17} />}
                                label="Created At"
                                value={formatDate(product.createdAt)}
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
                {value ?? "-"}
            </p>
        </div>
    );
}
