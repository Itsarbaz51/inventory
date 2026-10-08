"use client";

import React, { useState } from "react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

const MOVEMENT_TYPES = [
    {
        value: "OPENING_STOCK",
        label: "Opening Stock",
    },
    {
        value: "PURCHASE",
        label: "Purchase",
    },
    {
        value: "SALE",
        label: "Sale",
    },
    {
        value: "PURCHASE_RETURN",
        label: "Purchase Return",
    },
    {
        value: "SALES_RETURN",
        label: "Sales Return",
    },
    {
        value: "TRANSFER_IN",
        label: "Transfer In",
    },
    {
        value: "TRANSFER_OUT",
        label: "Transfer Out",
    },
    {
        value: "ADJUSTMENT_IN",
        label: "Adjustment In",
    },
    {
        value: "ADJUSTMENT_OUT",
        label: "Adjustment Out",
    },
];

const REFERENCE_TYPES = [
    {
        value: "OPENING",
        label: "Opening",
    },
    {
        value: "PURCHASE",
        label: "Purchase",
    },
    {
        value: "SALE",
        label: "Sale",
    },
    {
        value: "PURCHASE_RETURN",
        label: "Purchase Return",
    },
    {
        value: "SALES_RETURN",
        label: "Sales Return",
    },
    {
        value: "TRANSFER",
        label: "Transfer",
    },
    {
        value: "ADJUSTMENT",
        label: "Adjustment",
    },
];

const defaultForm = {
    productId: "",
    warehouseId: "",
    movementType: "",
    referenceType: "",
    referenceId: "",
    quantity: "",
    beforeQuantity: "",
    afterQuantity: "",
    reason: "",
};

export default function StockMovementForm({
    onSubmit,
    onCancel,
    loading = false,
}) {
    const [form, setForm] = useState(defaultForm);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            productId: form.productId.trim(),

            warehouseId: form.warehouseId.trim(),

            movementType: form.movementType,

            referenceType: form.referenceType,

            referenceId:
                form.referenceId.trim() || undefined,

            quantity: Number(form.quantity),

            beforeQuantity: Number(
                form.beforeQuantity,
            ),

            afterQuantity: Number(
                form.afterQuantity,
            ),

            reason:
                form.reason.trim() || undefined,
        };

        await onSubmit(payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* =====================================================
          PRODUCT / WAREHOUSE
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Stock Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                        label="Product ID"
                        name="productId"
                        value={form.productId}
                        onChange={handleChange}
                        placeholder="Enter product UUID"
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="Warehouse ID"
                        name="warehouseId"
                        value={form.warehouseId}
                        onChange={handleChange}
                        placeholder="Enter warehouse UUID"
                        required
                        disabled={loading}
                    />
                </div>
            </section>

            <div className="border-t border-border" />

            {/* =====================================================
          MOVEMENT
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Movement Details
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SelectField
                        label="Movement Type"
                        name="movementType"
                        value={form.movementType}
                        onChange={handleChange}
                        options={MOVEMENT_TYPES}
                        placeholder="Select movement type"
                        required
                        disabled={loading}
                    />

                    <SelectField
                        label="Reference Type"
                        name="referenceType"
                        value={form.referenceType}
                        onChange={handleChange}
                        options={REFERENCE_TYPES}
                        placeholder="Select reference type"
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="Reference ID"
                        name="referenceId"
                        value={form.referenceId}
                        onChange={handleChange}
                        placeholder="Optional reference UUID"
                        disabled={loading}
                    />
                </div>
            </section>

            <div className="border-t border-border" />

            {/* =====================================================
          QUANTITY
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Quantity
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <InputField
                        label="Before Quantity"
                        name="beforeQuantity"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.beforeQuantity}
                        onChange={handleChange}
                        placeholder="0"
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="Movement Quantity"
                        name="quantity"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="0"
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="After Quantity"
                        name="afterQuantity"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.afterQuantity}
                        onChange={handleChange}
                        placeholder="0"
                        required
                        disabled={loading}
                    />
                </div>
            </section>

            <div className="border-t border-border" />

            {/* =====================================================
          REASON
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Reason
                </h3>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Reason
                    </label>

                    <textarea
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        rows={4}
                        maxLength={1000}
                        disabled={loading}
                        placeholder="Enter reason for stock movement..."
                        className="
              w-full
              rounded-md
              border
              border-input
              bg-background
              px-3
              py-2
              text-sm
              text-foreground
              shadow-sm
              outline-none
              transition-colors
              placeholder:text-muted-foreground
              focus:border-ring
              focus:ring-2
              focus:ring-ring/20
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                    />

                    <p className="mt-1 text-xs text-muted-foreground">
                        {form.reason.length}/1000
                    </p>
                </div>
            </section>

            {/* =====================================================
          FOOTER
      ===================================================== */}

            <div className="flex justify-end gap-3 border-t border-border pt-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Movement"}
                </Button>
            </div>
        </form>
    );
}