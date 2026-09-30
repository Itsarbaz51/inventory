"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  CreditCard,
  MapPin,
  UserRound,
} from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const defaultValues = {
  name: "",
  companyName: "",
  phone: "",
  email: "",
  gstNumber: "",
  panNumber: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  openingBalance: "0",
  creditLimit: "",
  paymentTerms: "",
  isActive: true,
};

export default function SupplierForm({
  supplier,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] =
    useState(defaultValues);

  const [errors, setErrors] =
    useState({});

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier?.name || "",
        companyName:
          supplier?.companyName || "",
        phone: supplier?.phone || "",
        email: supplier?.email || "",
        gstNumber:
          supplier?.gstNumber || "",
        panNumber:
          supplier?.panNumber || "",
        address:
          supplier?.address || "",
        city: supplier?.city || "",
        state:
          supplier?.state || "",
        pincode:
          supplier?.pincode || "",
        openingBalance:
          supplier?.openingBalance ??
          "0",
        creditLimit:
          supplier?.creditLimit ?? "",
        paymentTerms:
          supplier?.paymentTerms ?? "",
        isActive:
          supplier?.isActive !== undefined
            ? supplier.isActive
            : true,
      });
    } else {
      setFormData(defaultValues);
    }

    setErrors({});
  }, [supplier]);

  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =====================================================
  // TOGGLE
  // =====================================================

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      isActive: value,
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    const newErrors = {};

    const name =
      formData.name.trim();

    if (!name) {
      newErrors.name =
        "Supplier name is required";
    } else if (name.length < 2) {
      newErrors.name =
        "Supplier name must be at least 2 characters";
    } else if (name.length > 150) {
      newErrors.name =
        "Supplier name cannot exceed 150 characters";
    }

    if (
      formData.companyName.trim()
        .length > 150
    ) {
      newErrors.companyName =
        "Company name cannot exceed 150 characters";
    }

    if (
      formData.phone.trim()
        .length > 20
    ) {
      newErrors.phone =
        "Phone cannot exceed 20 characters";
    }

    if (formData.email.trim()) {
      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email.trim(),
        )
      ) {
        newErrors.email =
          "Invalid email address";
      }
    }

    if (
      formData.gstNumber.trim()
        .length > 30
    ) {
      newErrors.gstNumber =
        "GST number cannot exceed 30 characters";
    }

    if (
      formData.panNumber.trim()
        .length > 20
    ) {
      newErrors.panNumber =
        "PAN number cannot exceed 20 characters";
    }

    if (
      formData.address.trim()
        .length > 5000
    ) {
      newErrors.address =
        "Address cannot exceed 5000 characters";
    }

    if (
      formData.city.trim()
        .length > 100
    ) {
      newErrors.city =
        "City cannot exceed 100 characters";
    }

    if (
      formData.state.trim()
        .length > 100
    ) {
      newErrors.state =
        "State cannot exceed 100 characters";
    }

    if (
      formData.pincode.trim()
        .length > 20
    ) {
      newErrors.pincode =
        "Pincode cannot exceed 20 characters";
    }

    const openingBalance =
      Number(formData.openingBalance || 0);

    if (
      Number.isNaN(openingBalance) ||
      openingBalance < 0
    ) {
      newErrors.openingBalance =
        "Opening balance cannot be negative";
    }

    if (formData.creditLimit !== "") {
      const creditLimit =
        Number(formData.creditLimit);

      if (
        Number.isNaN(creditLimit) ||
        creditLimit < 0
      ) {
        newErrors.creditLimit =
          "Credit limit cannot be negative";
      }
    }

    if (formData.paymentTerms !== "") {
      const paymentTerms =
        Number(formData.paymentTerms);

      if (
        Number.isNaN(paymentTerms) ||
        !Number.isInteger(paymentTerms) ||
        paymentTerms < 0
      ) {
        newErrors.paymentTerms =
          "Payment terms must be a valid number";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),

      companyName:
        formData.companyName.trim() ||
        null,

      phone:
        formData.phone.trim() ||
        null,

      email:
        formData.email.trim() ||
        null,

      gstNumber:
        formData.gstNumber.trim() ||
        null,

      panNumber:
        formData.panNumber.trim() ||
        null,

      address:
        formData.address.trim() ||
        null,

      city:
        formData.city.trim() ||
        null,

      state:
        formData.state.trim() ||
        null,

      pincode:
        formData.pincode.trim() ||
        null,

      openingBalance:
        Number(formData.openingBalance || 0),

      creditLimit:
        formData.creditLimit === ""
          ? null
          : Number(formData.creditLimit),

      paymentTerms:
        formData.paymentTerms === ""
          ? null
          : Number(formData.paymentTerms),

      isActive: formData.isActive,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =====================================================
          BASIC INFORMATION
      ===================================================== */}

      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserRound size={17} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Supplier Information
            </h3>

            <p className="text-xs text-muted-foreground">
              Enter supplier basic details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            name="name"
            label="Supplier Name"
            placeholder="e.g. Rajesh Kumar"
            required
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <InputField
            name="companyName"
            label="Company Name"
            placeholder="e.g. ABC Traders"
            value={formData.companyName}
            onChange={handleChange}
            error={errors.companyName}
          />

          <InputField
            name="phone"
            label="Phone"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <InputField
            name="email"
            type="email"
            label="Email"
            placeholder="supplier@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>
      </div>

      {/* =====================================================
          TAX INFORMATION
      ===================================================== */}

      <div className="border-t border-border pt-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard size={17} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Tax Information
            </h3>

            <p className="text-xs text-muted-foreground">
              Supplier GST and PAN details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            name="gstNumber"
            label="GST Number"
            placeholder="22AAAAA0000A1Z5"
            value={formData.gstNumber}
            onChange={handleChange}
            error={errors.gstNumber}
          />

          <InputField
            name="panNumber"
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={formData.panNumber}
            onChange={handleChange}
            error={errors.panNumber}
          />
        </div>
      </div>

      {/* =====================================================
          ADDRESS
      ===================================================== */}

      <div className="border-t border-border pt-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin size={17} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Address
            </h3>

            <p className="text-xs text-muted-foreground">
              Supplier location details.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <InputField
            name="address"
            label="Address"
            placeholder="Enter supplier address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField
              name="city"
              label="City"
              placeholder="Jaipur"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />

            <InputField
              name="state"
              label="State"
              placeholder="Rajasthan"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
            />

            <InputField
              name="pincode"
              label="Pincode"
              placeholder="302001"
              value={formData.pincode}
              onChange={handleChange}
              error={errors.pincode}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          ACCOUNT
      ===================================================== */}

      <div className="border-t border-border pt-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">
            Account & Payment
          </h3>

          <p className="text-xs text-muted-foreground">
            Configure supplier balance and payment terms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InputField
            name="openingBalance"
            type="number"
            label="Opening Balance"
            placeholder="0"
            value={formData.openingBalance}
            onChange={handleChange}
            error={errors.openingBalance}
          />

          <InputField
            name="creditLimit"
            type="number"
            label="Credit Limit"
            placeholder="100000"
            value={formData.creditLimit}
            onChange={handleChange}
            error={errors.creditLimit}
          />

          <InputField
            name="paymentTerms"
            type="number"
            label="Payment Terms"
            placeholder="30"
            value={formData.paymentTerms}
            onChange={handleChange}
            error={errors.paymentTerms}
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Payment terms are in days. Example: 30 means payment
          is due within 30 days.
        </p>
      </div>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
          <div>
            <p className="text-sm font-medium">
              Supplier Status
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Inactive suppliers will not be available for
              new purchase operations.
            </p>
          </div>

          <ToggleSwitch
            checked={formData.isActive}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      {/* =====================================================
          ACTIONS
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
            ? "Saving..."
            : supplier
              ? "Update Supplier"
              : "Create Supplier"}
        </Button>
      </div>
    </form>
  );
}