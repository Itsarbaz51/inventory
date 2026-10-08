"use client";

import { useEffect, useMemo, useState } from "react";

import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

const defaultForm = {
  purchaseId: "",
  productId: "",
  quantity: "",
  receivedQuantity: "0",
  rate: "0",
  discount: "0",
  taxRate: "0",
  taxAmount: "0",
  total: "0",
};

const getFormData = (item) => {
  if (!item) {
    return defaultForm;
  }

  return {
    purchaseId: item.purchaseId || "",
    productId: item.productId || "",
    quantity: item.quantity ?? "",
    receivedQuantity: item.receivedQuantity ?? "0",
    rate: item.rate ?? "0",
    discount: item.discount ?? "0",
    taxRate: item.taxRate ?? "0",
    taxAmount: item.taxAmount ?? "0",
    total: item.total ?? "0",
  };
};

const PurchaseItemForm = ({
  item = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(getFormData(item));
  }, [item]);

  const calculatedValues = useMemo(() => {
    const quantity = Number(form.quantity) || 0;
    const rate = Number(form.rate) || 0;
    const discount = Number(form.discount) || 0;
    const taxRate = Number(form.taxRate) || 0;

    const grossAmount = quantity * rate;

    const discountAmount = Math.min(
      discount,
      grossAmount,
    );

    const taxableAmount =
      grossAmount - discountAmount;

    const taxAmount =
      taxableAmount * (taxRate / 100);

    const total = taxableAmount + taxAmount;

    return {
      grossAmount,
      discountAmount,
      taxableAmount,
      taxAmount,
      total,
    };
  }, [
    form.quantity,
    form.rate,
    form.discount,
    form.taxRate,
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

    if (!form.purchaseId.trim()) {
      newErrors.purchaseId =
        "Purchase ID is required";
    }

    if (!form.productId.trim()) {
      newErrors.productId =
        "Product ID is required";
    }

    if (!form.quantity) {
      newErrors.quantity =
        "Quantity is required";
    } else if (Number(form.quantity) <= 0) {
      newErrors.quantity =
        "Quantity must be greater than 0";
    }

    if (Number(form.receivedQuantity) < 0) {
      newErrors.receivedQuantity =
        "Received quantity cannot be negative";
    }

    if (Number(form.rate) < 0) {
      newErrors.rate =
        "Rate cannot be negative";
    }

    if (Number(form.discount) < 0) {
      newErrors.discount =
        "Discount cannot be negative";
    }

    if (
      Number(form.taxRate) < 0 ||
      Number(form.taxRate) > 100
    ) {
      newErrors.taxRate =
        "Tax rate must be between 0 and 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      purchaseId: form.purchaseId.trim(),
      productId: form.productId.trim(),

      quantity: Number(form.quantity),

      receivedQuantity:
        Number(form.receivedQuantity) || 0,

      rate: Number(form.rate) || 0,

      discount: Number(form.discount) || 0,

      taxRate: Number(form.taxRate) || 0,

      taxAmount:
        Number(form.taxAmount) ||
        calculatedValues.taxAmount,

      total:
        Number(form.total) ||
        calculatedValues.total,
    };

    // purchaseId is required for create,
    // but should not be sent during update.
    if (item?.id) {
      delete payload.purchaseId;
    }

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Reference */}
      <div>
        <h3 className="mb-4 text-sm font-semibold">
          Purchase Item
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {!item?.id && (
            <InputField
              label="Purchase ID"
              name="purchaseId"
              placeholder="Enter purchase UUID"
              value={form.purchaseId}
              onChange={handleChange}
              error={errors.purchaseId}
              required
            />
          )}

          <InputField
            label="Product ID"
            name="productId"
            placeholder="Enter product UUID"
            value={form.productId}
            onChange={handleChange}
            error={errors.productId}
            required
          />

          <InputField
            label="Quantity"
            name="quantity"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={handleChange}
            error={errors.quantity}
            required
          />

          <InputField
            label="Received Quantity"
            name="receivedQuantity"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter received quantity"
            value={form.receivedQuantity}
            onChange={handleChange}
            error={errors.receivedQuantity}
          />

          <InputField
            label="Rate"
            name="rate"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter purchase rate"
            value={form.rate}
            onChange={handleChange}
            error={errors.rate}
          />

          <InputField
            label="Discount"
            name="discount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter discount"
            value={form.discount}
            onChange={handleChange}
            error={errors.discount}
          />

          <InputField
            label="Tax Rate (%)"
            name="taxRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="Enter tax rate"
            value={form.taxRate}
            onChange={handleChange}
            error={errors.taxRate}
          />

          <InputField
            label="Tax Amount"
            name="taxAmount"
            type="number"
            min="0"
            step="0.01"
            value={
              form.taxAmount ||
              calculatedValues.taxAmount
            }
            onChange={handleChange}
          />

          <InputField
            label="Total"
            name="total"
            type="number"
            min="0"
            step="0.01"
            value={
              form.total || calculatedValues.total
            }
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Calculation */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <h3 className="mb-3 text-sm font-semibold">
          Calculation Preview
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <CalculationItem
            label="Gross"
            value={calculatedValues.grossAmount}
          />

          <CalculationItem
            label="Discount"
            value={calculatedValues.discountAmount}
          />

          <CalculationItem
            label="Tax"
            value={calculatedValues.taxAmount}
          />

          <CalculationItem
            label="Total"
            value={calculatedValues.total}
          />
        </div>
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
            : item
              ? "Update Item"
              : "Add Item"}
        </button>
      </div>
    </form>
  );
};

const CalculationItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-muted-foreground">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold">
      ₹
      {Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </p>
  </div>
);

export default PurchaseItemForm;