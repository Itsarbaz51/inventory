"use client";

import React from "react";
import {
    Edit,
    Trash2,
    Tag,
    Package,
} from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";

export default function BrandsCard({
    brands,
    loading,
    onEdit,
    onDelete,
    page,
    totalPages,
    total,
    limit,
    onPageChange,
}) {
    if (loading) {
        return (
            <LoadingState message="Loading brands..." />
        );
    }

    if (!brands?.length) {
        return (
            <EmptyState
                title="No brands found"
                description="Add your first brand to start managing equipment brands."
            />
        );
    }

    return (
        <div className="space-y-4">

            {/* Cards */}

            <div
                className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
            >
                {brands.map((brand) => (
                    <div
                        key={brand.id}
                        className="
              group
              rounded-xl
              border
              border-border
              bg-card
              p-5
              shadow-sm
              transition
              hover:border-primary/30
              hover:shadow-md
            "
                    >
                        {/* Header */}

                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">

                                {/* Icon */}

                                <div
                                    className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                                >
                                    <Tag size={20} />
                                </div>

                                {/* Name */}

                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold">
                                        {brand.name}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Brand
                                    </p>
                                </div>
                            </div>

                            {/* Status */}

                            <span
                                className={`
                  shrink-0
                  rounded-full
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  ${brand.isActive
                                        ? "bg-green-500/10 text-green-600"
                                        : "bg-red-500/10 text-red-600"
                                    }
                `}
                            >
                                {brand.isActive
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>

                        {/* Description */}

                        <div className="mt-4 min-h-10">
                            {brand.description ? (
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {brand.description}
                                </p>
                            ) : (
                                <p className="text-sm italic text-muted-foreground/60">
                                    No description
                                </p>
                            )}
                        </div>

                        {/* Product count */}

                        <div
                            className="
                mt-4
                flex
                items-center
                gap-2
                rounded-lg
                bg-muted/40
                px-3
                py-2
              "
                        >
                            <Package
                                size={16}
                                className="text-muted-foreground"
                            />

                            <span className="text-xs text-muted-foreground">
                                Products
                            </span>

                            <span className="ml-auto text-sm font-semibold">
                                {brand?._count?.products ?? 0}
                            </span>
                        </div>

                        {/* Actions */}

                        <div
                            className="
                mt-4
                flex
                justify-end
                gap-1
                border-t
                border-border
                pt-3
              "
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    onEdit(brand)
                                }
                                title="Edit brand"
                            >
                                <Edit size={16} />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    onDelete(brand)
                                }
                                title="Delete brand"
                                className="
                  text-destructive
                  hover:text-destructive
                "
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onPageChange={onPageChange}
                loading={loading}
            />
        </div>
    );
}
