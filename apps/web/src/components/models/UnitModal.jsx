"use client";

import React from "react";
import { X, Ruler } from "lucide-react";

import Button from "@/components/ui/Button";
import UnitForm from "../forms/UnitForm";

export default function UnitModal({
    open,
    onClose,
    unit,
    onSubmit,
    loading,
}) {
    if (!open) return null;

    return (
        <div
            className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 p-4
      "
        >
            <div
                className="
          w-full max-w-lg
          overflow-hidden
          rounded-2xl
          border border-border
          bg-card
          shadow-2xl
        "
            >
                {/* Header */}

                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Ruler size={19} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold">
                                {unit ? "Edit Unit" : "Add Unit"}
                            </h2>

                            <p className="text-xs text-muted-foreground">
                                {unit
                                    ? "Update unit information"
                                    : "Create a measurement unit"}
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

                <UnitForm
                    unit={unit}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    loading={loading}
                />
            </div>
        </div>
    );
}
