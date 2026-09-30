"use client";

import React, { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const defaultValues = {
  name: "",
  phone: "",
  email: "",
  gstNumber: "",
  panNumber: "",
  billingAddress: "",
  shippingAddress: "",
  city: "",
  state: "",
  pincode: "",
  openingBalance: 0,
  creditLimit: "",
  paymentTerms: "",
  isWalkIn: false,
  isActive: true,
};

export default function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer?.name || "",
        phone: customer?.phone || "",
        email: customer?.email || "",
        gstNumber: customer?.gstNumber || "",
        panNumber: customer?.panNumber || "",
        billingAddress: customer?.billingAddress || "",
        shippingAddress: customer?.shippingAddress || "",
        city: customer?.city || "",
        state: customer?.state || "",
        pincode: customer?.pincode || "",
        openingBalance: customer?.openingBalance ?? 0,
        creditLimit: customer?.creditLimit ?? "",
        paymentTerms: customer?.paymentTerms ?? "",
        isWalkIn: customer?.isWalkIn ?? false,
        isActive: customer?.isActive ?? true,
      });
    } else {
      setForm(defaultValues);
    }

    setErrors({});
  }, [customer]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Customer name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Customer name must be at least 2 characters";
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (form.openingBalance < 0) {
      newErrors.openingBalance = "Opening balance cannot be negative";
    }

    if (form.creditLimit !== "" && Number(form.creditLimit) < 0) {
      newErrors.creditLimit = "Credit limit cannot be negative";
    }

    if (form.paymentTerms !== "" && Number(form.paymentTerms) < 0) {
      newErrors.paymentTerms = "Payment terms cannot be negative";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: form.name.trim(),

      phone: form.phone?.trim() || null,
      email: form.email?.trim() || null,

      gstNumber: form.gstNumber?.trim() || null,
      panNumber: form.panNumber?.trim() || null,

      billingAddress: form.billingAddress?.trim() || null,

      shippingAddress: form.shippingAddress?.trim() || null,

      city: form.city?.trim() || null,
      state: form.state?.trim() || null,
      pincode: form.pincode?.trim() || null,

      openingBalance:
        form.openingBalance === "" ? 0 : Number(form.openingBalance),

      creditLimit: form.creditLimit === "" ? null : Number(form.creditLimit),

      paymentTerms: form.paymentTerms === "" ? null : Number(form.paymentTerms),

      isWalkIn: form.isWalkIn,
      isActive: form.isActive,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      {/* BASIC INFORMATION */}

      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserRound size={17} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Customer Information</h3>

            <p className="text-xs text-muted-foreground">
              Enter basic customer details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Customer Name"
            placeholder="e.g. Rahul Traders"
            required
            value={form.name}
            error={errors.name}
            onChange={(e) => updateField("name", e.target.value)}
          />

          <InputField
            label="Phone"
            placeholder="9876543210"
            value={form.phone}
            error={errors.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />

          <InputField
            label="Email"
            type="email"
            placeholder="customer@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <InputField
            label="GST Number"
            placeholder="08ABCDE1234F1Z5"
            value={form.gstNumber}
            onChange={(e) =>
              updateField("gstNumber", e.target.value.toUpperCase())
            }
          />

          <InputField
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={form.panNumber}
            onChange={(e) =>
              updateField("panNumber", e.target.value.toUpperCase())
            }
          />
        </div>
      </div>

      {/* ADDRESS */}

      <div className="border-t border-border pt-5">
        <h3 className="mb-4 text-sm font-semibold">Address Details</h3>

        <div className="space-y-4">
          <InputField
            label="Billing Address"
            placeholder="Enter billing address"
            value={form.billingAddress}
            onChange={(e) => updateField("billingAddress", e.target.value)}
          />

          <InputField
            label="Shipping Address"
            placeholder="Enter shipping address"
            value={form.shippingAddress}
            onChange={(e) => updateField("shippingAddress", e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField
              label="City"
              placeholder="Jaipur"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />

            <InputField
              label="State"
              placeholder="Rajasthan"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
            />

            <InputField
              label="Pincode"
              placeholder="302001"
              value={form.pincode}
              onChange={(e) => updateField("pincode", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ACCOUNT */}

      <div className="border-t border-border pt-5">
        <h3 className="mb-4 text-sm font-semibold">Account & Credit</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InputField
            label="Opening Balance"
            type="number"
            min="0"
            placeholder="0"
            value={form.openingBalance}
            error={errors.openingBalance}
            onChange={(e) => updateField("openingBalance", e.target.value)}
          />

          <InputField
            label="Credit Limit"
            type="number"
            min="0"
            placeholder="0"
            value={form.creditLimit}
            error={errors.creditLimit}
            onChange={(e) => updateField("creditLimit", e.target.value)}
          />

          <InputField
            label="Payment Terms (Days)"
            type="number"
            min="0"
            placeholder="30"
            value={form.paymentTerms}
            error={errors.paymentTerms}
            onChange={(e) => updateField("paymentTerms", e.target.value)}
          />
        </div>
      </div>

      {/* OPTIONS */}

      <div className="border-t border-border pt-5 space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
          <div>
            <p className="text-sm font-medium">Walk-in Customer</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Use this for customers without regular account details.
            </p>
          </div>

          <ToggleSwitch
            checked={form.isWalkIn}
            onChange={(value) => updateField("isWalkIn", value)}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
          <div>
            <p className="text-sm font-medium">Customer Status</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Inactive customers cannot be used for new transactions.
            </p>
          </div>

          <ToggleSwitch
            checked={form.isActive}
            onChange={(value) => updateField("isActive", value)}
          />
        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : customer
              ? "Update Customer"
              : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
