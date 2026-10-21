"use client";

import React from "react";
import {
    Edit,
    Eye,
    Trash2,
    Package,
} from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";
import { formatDate, formatMoney } from "@/lib/utils";

export default function ProductTable({
    products,
    loading,
    onEdit,
    onDelete,
    onView,

    page,
    totalPages,
    total,
    limit,
    onPageChange,
}) {
    if (loading) {
        return <LoadingState message="Loading products..." />;
    }

    if (!products?.length) {
        return (
            <EmptyState
                title="No products found"
                description="Try changing your filters or add a new product."
            />
        );
    }

    return (
        <div
            className="
        overflow-hidden rounded-xl
        border border-border
        bg-card shadow-sm
      "
        >
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                    <thead className="border-b border-border bg-muted/40">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Product
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                                SKU
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Category
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Brand
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                                Purchase
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                                Selling
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                                MRP
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                                Tax
                            </th>

                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-muted-foreground">
                                Status
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                                Created
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="transition-colors hover:bg-muted/30"
                            >
                                {/* PRODUCT */}

                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="
                          flex h-10 w-10 shrink-0
                          items-center justify-center
                          rounded-lg bg-primary/10
                          text-primary
                        "
                                            >
                                                <Package size={18} />
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">
                                                {product.name}
                                            </p>

                                            <p className="truncate text-xs text-muted-foreground">
                                                {product.barcode || "No barcode"}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* SKU */}

                                <td className="px-5 py-4 text-sm text-muted-foreground">
                                    {product.sku || "-"}
                                </td>

                                {/* CATEGORY */}

                                <td className="px-5 py-4">
                                    <span className="text-sm text-muted-foreground">
                                        {product.category?.name ||
                                            product.categoryName ||
                                            "-"}
                                    </span>
                                </td>

                                {/* BRAND */}

                                <td className="px-5 py-4">
                                    <span className="text-sm text-muted-foreground">
                                        {product.brand?.name ||
                                            product.brandName ||
                                            "-"}
                                    </span>
                                </td>

                                {/* PURCHASE */}

                                <td className="px-5 py-4 text-right text-sm font-medium">
                                    {formatMoney(product.purchasePrice)}
                                </td>

                                {/* SELLING */}

                                <td className="px-5 py-4 text-right text-sm font-medium">
                                    {formatMoney(product.sellingPrice)}
                                </td>

                                {/* MRP */}

                                <td className="px-5 py-4 text-right text-sm font-medium">
                                    {formatMoney(product.mrp)}
                                </td>

                                {/* TAX */}

                                <td className="px-5 py-4 text-right text-sm text-muted-foreground">
                                    {product.taxRate != null
                                        ? `${product.taxRate}%`
                                        : "-"}
                                </td>

                                {/* STATUS */}

                                <td className="px-5 py-4 text-center">
                                    <span
                                        className={`
                      inline-flex rounded-full
                      px-2.5 py-1
                      text-xs font-medium
                      ${product.isActive
                                                ? "bg-green-500/10 text-green-600"
                                                : "bg-red-500/10 text-red-600"
                                            }
                    `}
                                    >
                                        {product.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>

                                {/* CREATED */}

                                <td className="px-5 py-4 text-sm text-muted-foreground">
                                    {product.createdAt
                                        ? formatDate(product.createdAt)
                                        : "-"}
                                </td>

                                {/* ACTIONS */}

                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(product)}
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(product)}
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(product)}
                                            title="Delete"
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
                Showing {products.length} products
            </div>
        </div>
    );
}
