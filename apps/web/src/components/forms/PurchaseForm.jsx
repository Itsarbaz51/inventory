"use client";

import { useEffect, useMemo, useState } from "react";

import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "ORDERED", label: "Ordered" },
  { value: "PARTIALLY_RECEIVED", label: "Partially Received" },
  { value: "RECEIVED", label: "Received" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
];

const defaultForm = {
  supplierId: "",
  warehouseId: "",
  purchaseNumber: "",
  purchaseDate: "",
  expectedDate: "",
  subtotal: "0",
  discount: "0",
  taxAmount: "0",
  shippingCost: "0",
  grandTotal: "0",
  paidAmount: "0",
  dueAmount: "0",
  status: "DRAFT",
  paymentStatus: "UNPAID",
  notes: "",
};

const formatDateForInput = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().split("T")[0];
};

const getPurchaseForm = (purchase) => {
  if (!purchase) return defaultForm;

  return {
    supplierId: purchase.supplierId || "",
    warehouseId: purchase.warehouseId || "",
    purchaseNumber: purchase.purchaseNumber || "",
    purchaseDate: formatDateForInput(purchase.purchaseDate),
    expectedDate: formatDateForInput(purchase.expectedDate),

    subtotal: purchase.subtotal ?? "0",
    discount: purchase.discount ?? "0",
    taxAmount: purchase.taxAmount ?? "0",
    shippingCost: purchase.shippingCost ?? "0",
    grandTotal: purchase.grandTotal ?? "0",
    paidAmount: purchase.paidAmount ?? "0",
    dueAmount: purchase.dueAmount ?? "0",

    status: purchase.status || "DRAFT",
    paymentStatus: purchase.paymentStatus || "UNPAID",
    notes: purchase.notes || "",
  };
};

const PurchaseForm = ({
  purchase,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(getPurchaseForm(purchase));
  }, [purchase]);

  const calculatedGrandTotal = useMemo(() => {
    const subtotal = Number(form.subtotal) || 0;
    const discount = Number(form.discount) || 0;
    const taxAmount = Number(form.taxAmount) || 0;
    const shippingCost = Number(form.shippingCost) || 0;

    return Math.max(
      0,
      subtotal - discount + taxAmount + shippingCost,
    );
  }, [
    form.subtotal,
    form.discount,
    form.taxAmount,
    form.shippingCost,
  ]);

  const calculatedDueAmount = useMemo(() => {
    const grandTotal =
      Number(form.grandTotal) || calculatedGrandTotal;

    const paidAmount = Number(form.paidAmount) || 0;

    return Math.max(0, grandTotal - paidAmount);
  }, [
    form.grandTotal,
    form.paidAmount,
    calculatedGrandTotal,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.supplierId.trim()) {
      newErrors.supplierId = "Supplier ID is required";
    }

    if (!form.warehouseId.trim()) {
      newErrors.warehouseId = "Warehouse ID is required";
    }

    if (!form.purchaseNumber.trim()) {
      newErrors.purchaseNumber =
        "Purchase number is required";
    }

    if (!form.purchaseDate) {
      newErrors.purchaseDate =
        "Purchase date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      supplierId: form.supplierId.trim(),
      warehouseId: form.warehouseId.trim(),

      purchaseNumber: form.purchaseNumber.trim(),

      purchaseDate: new Date(form.purchaseDate),

      expectedDate: form.expectedDate
        ? new Date(form.expectedDate)
        : null,

      subtotal: Number(form.subtotal) || 0,
      discount: Number(form.discount) || 0,
      taxAmount: Number(form.taxAmount) || 0,
      shippingCost: Number(form.shippingCost) || 0,

      grandTotal:
        Number(form.grandTotal) || calculatedGrandTotal,

      paidAmount: Number(form.paidAmount) || 0,

      dueAmount:
        Number(form.dueAmount) || calculatedDueAmount,

      status: form.status,

      paymentStatus: form.paymentStatus,

      notes: form.notes.trim() || null,
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Purchase Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Supplier ID"
            name="supplierId"
            placeholder="Enter supplier UUID"
            value={form.supplierId}
            onChange={handleChange}
            error={errors.supplierId}
            required
          />

          <InputField
            label="Warehouse ID"
            name="warehouseId"
            placeholder="Enter warehouse UUID"
            value={form.warehouseId}
            onChange={handleChange}
            error={errors.warehouseId}
            required
          />

          <InputField
            label="Purchase Number"
            name="purchaseNumber"
            placeholder="e.g. PO-10001"
            value={form.purchaseNumber}
            onChange={handleChange}
            error={errors.purchaseNumber}
            required
          />

          <SelectField
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            placeholder="Select status"
          />

          <InputField
            label="Purchase Date"
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            error={errors.purchaseDate}
            required
          />

          <InputField
            label="Expected Date"
            name="expectedDate"
            type="date"
            value={form.expectedDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Amount Information */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Amount Details
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <InputField
            label="Subtotal"
            name="subtotal"
            type="number"
            min="0"
            step="0.01"
            value={form.subtotal}
            onChange={handleChange}
          />

          <InputField
            label="Discount"
            name="discount"
            type="number"
            min="0"
            step="0.01"
            value={form.discount}
            onChange={handleChange}
          />

          <InputField
            label="Tax Amount"
            name="taxAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.taxAmount}
            onChange={handleChange}
          />

          <InputField
            label="Shipping Cost"
            name="shippingCost"
            type="number"
            min="0"
            step="0.01"
            value={form.shippingCost}
            onChange={handleChange}
          />

          <InputField
            label="Grand Total"
            name="grandTotal"
            type="number"
            min="0"
            step="0.01"
            value={form.grandTotal}
            onChange={handleChange}
          />

          <InputField
            label="Paid Amount"
            name="paidAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.paidAmount}
            onChange={handleChange}
          />

          <InputField
            label="Due Amount"
            name="dueAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.dueAmount}
            onChange={handleChange}
          />

          <SelectField
            label="Payment Status"
            name="paymentStatus"
            value={form.paymentStatus}
            onChange={handleChange}
            options={PAYMENT_STATUS_OPTIONS}
            placeholder="Select payment status"
          />
        </div>

        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Calculated Grand Total
              </p>

              <p className="text-lg font-semibold">
                ₹{calculatedGrandTotal.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Calculated Due
              </p>

              <p className="text-lg font-semibold">
                ₹{calculatedDueAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Notes
        </label>

        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Enter purchase notes..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : purchase
              ? "Update Purchase"
              : "Create Purchase"}
        </button>
      </div>
    </form>
  );
};

export default PurchaseForm;