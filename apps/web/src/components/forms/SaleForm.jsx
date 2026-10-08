"use client";

import { useEffect, useMemo, useState } from "react";

import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

const STATUS_OPTIONS = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

const PAYMENT_STATUS_OPTIONS = [
  {
    value: "UNPAID",
    label: "Unpaid",
  },
  {
    value: "PARTIAL",
    label: "Partial",
  },
  {
    value: "PAID",
    label: "Paid",
  },
];

const defaultForm = {
  customerId: "",
  warehouseId: "",
  invoiceNumber: "",
  saleDate: "",
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

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().split("T")[0];
};

const getFormData = (sale) => {
  if (!sale) {
    return defaultForm;
  }

  return {
    customerId: sale.customerId || "",
    warehouseId: sale.warehouseId || "",
    invoiceNumber: sale.invoiceNumber || "",
    saleDate: formatDateForInput(
      sale.saleDate,
    ),

    subtotal: sale.subtotal ?? "0",
    discount: sale.discount ?? "0",
    taxAmount: sale.taxAmount ?? "0",
    shippingCost: sale.shippingCost ?? "0",
    grandTotal: sale.grandTotal ?? "0",
    paidAmount: sale.paidAmount ?? "0",
    dueAmount: sale.dueAmount ?? "0",

    status: sale.status || "DRAFT",

    paymentStatus:
      sale.paymentStatus || "UNPAID",

    notes: sale.notes || "",
  };
};

const SaleForm = ({
  sale = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(getFormData(sale));
  }, [sale]);

  const calculatedGrandTotal = useMemo(() => {
    const subtotal =
      Number(form.subtotal) || 0;

    const discount =
      Number(form.discount) || 0;

    const taxAmount =
      Number(form.taxAmount) || 0;

    const shippingCost =
      Number(form.shippingCost) || 0;

    return Math.max(
      0,
      subtotal -
        discount +
        taxAmount +
        shippingCost,
    );
  }, [
    form.subtotal,
    form.discount,
    form.taxAmount,
    form.shippingCost,
  ]);

  const calculatedDueAmount = useMemo(() => {
    const grandTotal =
      Number(form.grandTotal) ||
      calculatedGrandTotal;

    const paidAmount =
      Number(form.paidAmount) || 0;

    return Math.max(
      0,
      grandTotal - paidAmount,
    );
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

    if (!form.warehouseId.trim()) {
      newErrors.warehouseId =
        "Warehouse ID is required";
    }

    if (!form.invoiceNumber.trim()) {
      newErrors.invoiceNumber =
        "Invoice number is required";
    }

    if (!form.saleDate) {
      newErrors.saleDate =
        "Sale date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      customerId:
        form.customerId.trim() || null,

      warehouseId:
        form.warehouseId.trim(),

      invoiceNumber:
        form.invoiceNumber.trim(),

      saleDate: new Date(
        form.saleDate,
      ),

      subtotal:
        Number(form.subtotal) || 0,

      discount:
        Number(form.discount) || 0,

      taxAmount:
        Number(form.taxAmount) || 0,

      shippingCost:
        Number(form.shippingCost) || 0,

      grandTotal:
        Number(form.grandTotal) ||
        calculatedGrandTotal,

      paidAmount:
        Number(form.paidAmount) || 0,

      dueAmount:
        Number(form.dueAmount) ||
        calculatedDueAmount,

      status: form.status,

      paymentStatus:
        form.paymentStatus,

      notes:
        form.notes.trim() || null,
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Sale Information */}
      <section>
        <h3 className="mb-4 text-sm font-semibold">
          Sale Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Customer ID"
            name="customerId"
            placeholder="Enter customer UUID (optional)"
            value={form.customerId}
            onChange={handleChange}
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
            label="Invoice Number"
            name="invoiceNumber"
            placeholder="e.g. INV-10001"
            value={form.invoiceNumber}
            onChange={handleChange}
            error={errors.invoiceNumber}
            required
          />

          <InputField
            label="Sale Date"
            name="saleDate"
            type="date"
            value={form.saleDate}
            onChange={handleChange}
            error={errors.saleDate}
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

          <SelectField
            label="Payment Status"
            name="paymentStatus"
            value={form.paymentStatus}
            onChange={handleChange}
            options={PAYMENT_STATUS_OPTIONS}
            placeholder="Select payment status"
          />
        </div>
      </section>

      {/* Amount Information */}
      <section>
        <h3 className="mb-4 text-sm font-semibold">
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
        </div>

        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Calculated Grand Total
              </p>

              <p className="text-lg font-semibold">
                ₹
                {calculatedGrandTotal.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Calculated Due Amount
              </p>

              <p className="text-lg font-semibold">
                ₹
                {calculatedDueAmount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section>
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
          placeholder="Enter sale notes..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </section>

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
            : sale
              ? "Update Sale"
              : "Create Sale"}
        </button>
      </div>
    </form>
  );
};

export default SaleForm;