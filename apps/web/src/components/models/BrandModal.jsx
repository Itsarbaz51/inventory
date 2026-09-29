"use client";

import React from "react";
import { X, Tag } from "lucide-react";

import Button from "@/components/ui/Button";
import BrandForm from "../forms/BrandForm";

export default function BrandModal({
    open,
    onClose,
    brand,
    onSubmit,
    loading,
}) {
    if (!open) return null;

    return (
        <div
            className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
        >
            <div
                className="
          flex
          max-h-[calc(100vh-2rem)]
          w-full
          max-w-xl
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-border
          bg-card
          shadow-xl
        "
            >
                {/* Header */}

                <div
                    className="
            flex
            items-center
            justify-between
            border-b
            border-border
            px-6
            py-4
          "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                bg-primary/10
                text-primary
              "
                        >
                            <Tag size={19} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold">
                                {brand
                                    ? "Edit Brand"
                                    : "Add Brand"}
                            </h2>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {brand
                                    ? "Update brand information."
                                    : "Create a new equipment brand."}
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

                {/* Form */}

                <BrandForm
                    brand={brand}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    loading={loading}
                />
            </div>
        </div>
    );
}
