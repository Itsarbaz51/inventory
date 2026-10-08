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
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

const emptyItem = {
  productId: "",
  quantity: "",
  rate: "",
  total: "0",
};

const defaultForm = {
  supplierId: "",
  purchaseId: "",
  returnNumber: "",
  returnDate: "",
  totalAmount: "0",
  status: "DRAFT",
  reason: "",
  items: [emptyItem],
};

const formatDateForInput = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().split("T")[0];
};

const getFormData = (returnData) => {
  if (!returnData) {
    return defaultForm;
  }

  const items =
    returnData.items ||
    returnData.returnItems ||
    [];

  return {
    supplierId: returnData.supplierId || "",
    purchaseId: returnData.purchaseId || "",
    returnNumber:
      returnData.returnNumber || "",

    returnDate: formatDateForInput(
      returnData.returnDate,
    ),

    totalAmount:
      returnData.totalAmount ?? "0",

    status:
      returnData.status || "DRAFT",

    reason: returnData.reason || "",

    items:
      items.length > 0
        ? items.map((item) => ({
            productId:
              item.productId || "",

            quantity:
              item.quantity ?? "",

            rate:
              item.rate ?? "",

            total:
              item.total ?? "0",
          }))
        : [emptyItem],
  };
};

const PurchaseReturnForm = ({
  returnData = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [form, setForm] = useState(
    defaultForm,
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(getFormData(returnData));
  }, [returnData]);

  const calculatedTotal = useMemo(() => {
    return form.items.reduce(
      (sum, item) => {
        const quantity =
          Number(item.quantity) || 0;

        const rate =
          Number(item.rate) || 0;

        return sum + quantity * rate;
      },
      0,
    );
  }, [form.items]);

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

  const handleItemChange = (
    index,
    field,
    value,
  ) => {
    setForm((prev) => {
      const items = [...prev.items];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      if (
        field === "quantity" ||
        field === "rate"
      ) {
        const quantity =
          Number(items[index].quantity) || 0;

        const rate =
          Number(items[index].rate) || 0;

        items[index].total =
          quantity * rate;
      }

      return {
        ...prev,
        items,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [`items.${index}.${field}`]: "",
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...emptyItem,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (form.items.length === 1) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      items: prev.items.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.supplierId.trim()) {
      newErrors.supplierId =
        "Supplier ID is required";
    }

    if (!form.returnNumber.trim()) {
      newErrors.returnNumber =
        "Return number is required";
    }

    if (!form.returnDate) {
      newErrors.returnDate =
        "Return date is required";
    }

    if (!form.items.length) {
      newErrors.items =
        "At least one return item is required";
    }

    form.items.forEach((item, index) => {
      if (!item.productId.trim()) {
        newErrors[
          `items.${index}.productId`
        ] = "Product ID is required";
      }

      if (
        !item.quantity ||
        Number(item.quantity) <= 0
      ) {
        newErrors[
          `items.${index}.quantity`
        ] = "Quantity must be greater than 0";
      }

      if (Number(item.rate) < 0) {
        newErrors[
          `items.${index}.rate`
        ] = "Rate cannot be negative";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      supplierId: form.supplierId.trim(),

      purchaseId:
        form.purchaseId.trim() || null,

      returnNumber:
        form.returnNumber.trim(),

      returnDate: new Date(
        form.returnDate,
      ),

      totalAmount:
        Number(form.totalAmount) ||
        calculatedTotal,

      status: form.status,

      reason:
        form.reason.trim() || null,

      items: form.items.map((item) => ({
        productId:
          item.productId.trim(),

        quantity: Number(item.quantity),

        rate: Number(item.rate) || 0,

        total:
          Number(item.total) ||
          (Number(item.quantity) || 0) *
            (Number(item.rate) || 0),
      })),
    };

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Return Information */}
      <section>
        <h3 className="mb-4 text-sm font-semibold">
          Return Information
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
            label="Purchase ID"
            name="purchaseId"
            placeholder="Enter purchase UUID (optional)"
            value={form.purchaseId}
            onChange={handleChange}
          />

          <InputField
            label="Return Number"
            name="returnNumber"
            placeholder="e.g. PR-10001"
            value={form.returnNumber}
            onChange={handleChange}
            error={errors.returnNumber}
            required
          />

          <InputField
            label="Return Date"
            name="returnDate"
            type="date"
            value={form.returnDate}
            onChange={handleChange}
            error={errors.returnDate}
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
            label="Total Amount"
            name="totalAmount"
            type="number"
            min="0"
            step="0.01"
            value={
              form.totalAmount ||
              calculatedTotal
            }
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Return Items */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">
              Return Items
            </h3>

            <p className="text-xs text-muted-foreground">
              Add products being returned.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            + Add Item
          </button>
        </div>

        {errors.items && (
          <p className="mb-3 text-xs text-destructive">
            {errors.items}
          </p>
        )}

        <div className="space-y-4">
          {form.items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">
                  Item #{index + 1}
                </p>

                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(index)
                    }
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InputField
                  label="Product ID"
                  name={`productId-${index}`}
                  placeholder="Product UUID"
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "productId",
                      e.target.value,
                    )
                  }
                  error={
                    errors[
                      `items.${index}.productId`
                    ]
                  }
                  required
                />

                <InputField
                  label="Quantity"
                  name={`quantity-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      e.target.value,
                    )
                  }
                  error={
                    errors[
                      `items.${index}.quantity`
                    ]
                  }
                  required
                />

                <InputField
                  label="Rate"
                  name={`rate-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "rate",
                      e.target.value,
                    )
                  }
                  error={
                    errors[
                      `items.${index}.rate`
                    ]
                  }
                />

                <InputField
                  label="Total"
                  name={`total-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.total}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "total",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reason */}
      <section>
        <label
          htmlFor="reason"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Return Reason
        </label>

        <textarea
          id="reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          rows={4}
          maxLength={2000}
          placeholder="Enter reason for purchase return..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </section>

      {/* Summary */}
      <section className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Calculated Return Amount
          </span>

          <span className="text-xl font-bold">
            ₹
            {calculatedTotal.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </span>
        </div>
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
            : returnData
              ? "Update Return"
              : "Create Return"}
        </button>
      </div>
    </form>
  );
};

export default PurchaseReturnForm;