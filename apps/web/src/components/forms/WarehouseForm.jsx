"use client";

import React, { useEffect, useState } from "react";
import { Warehouse } from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const defaultValues = {
  name: "",
  code: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  managerName: "",
  phone: "",
  isActive: true,
};

export default function WarehouseForm({
  warehouse,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  // =====================================================
  // SET FORM DATA
  // =====================================================

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse?.name || "",
        code: warehouse?.code || "",
        address: warehouse?.address || "",
        city: warehouse?.city || "",
        state: warehouse?.state || "",
        pincode: warehouse?.pincode || "",
        managerName: warehouse?.managerName || "",
        phone: warehouse?.phone || "",
        isActive: warehouse?.isActive !== undefined ? warehouse.isActive : true,
      });
    } else {
      setFormData(defaultValues);
    }

    setErrors({});
  }, [warehouse]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
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

    // ---------------------------------------------------
    // NAME
    // ---------------------------------------------------

    const name = formData.name.trim();

    if (!name) {
      newErrors.name = "Warehouse name is required";
    } else if (name.length < 2) {
      newErrors.name = "Warehouse name must be at least 2 characters";
    } else if (name.length > 150) {
      newErrors.name = "Warehouse name cannot exceed 150 characters";
    }

    // ---------------------------------------------------
    // CODE
    // ---------------------------------------------------

    const code = formData.code.trim();

    if (!code) {
      newErrors.code = "Warehouse code is required";
    } else if (code.length < 2) {
      newErrors.code = "Warehouse code must be at least 2 characters";
    } else if (code.length > 50) {
      newErrors.code = "Warehouse code cannot exceed 50 characters";
    } else if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      newErrors.code =
        "Only letters, numbers, underscore and hyphen are allowed";
    }

    // ---------------------------------------------------
    // ADDRESS
    // ---------------------------------------------------

    if (formData.address.trim().length > 1000) {
      newErrors.address = "Address cannot exceed 1000 characters";
    }

    // ---------------------------------------------------
    // CITY
    // ---------------------------------------------------

    if (formData.city.trim().length > 100) {
      newErrors.city = "City cannot exceed 100 characters";
    }

    // ---------------------------------------------------
    // STATE
    // ---------------------------------------------------

    if (formData.state.trim().length > 100) {
      newErrors.state = "State cannot exceed 100 characters";
    }

    // ---------------------------------------------------
    // PINCODE
    // ---------------------------------------------------

    if (formData.pincode.trim().length > 20) {
      newErrors.pincode = "Pincode cannot exceed 20 characters";
    }

    // ---------------------------------------------------
    // MANAGER NAME
    // ---------------------------------------------------

    if (formData.managerName.trim().length > 150) {
      newErrors.managerName = "Manager name cannot exceed 150 characters";
    }

    // ---------------------------------------------------
    // PHONE
    // ---------------------------------------------------

    if (formData.phone.trim().length > 20) {
      newErrors.phone = "Phone cannot exceed 20 characters";
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

      code: formData.code.trim(),

      address: formData.address.trim() || null,

      city: formData.city.trim() || null,

      state: formData.state.trim() || null,

      pincode: formData.pincode.trim() || null,

      managerName: formData.managerName.trim() || null,

      phone: formData.phone.trim() || null,

      isActive: formData.isActive,
    };

    onSubmit(payload);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* =====================================================
          BASIC INFORMATION
      ===================================================== */}

      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Warehouse size={17} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Warehouse Information
            </h3>

            <p className="text-xs text-muted-foreground">
              Enter basic warehouse details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}

          <InputField
            name="name"
            label="Warehouse Name"
            placeholder="e.g. Main Warehouse"
            required
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          {/* Code */}

          <InputField
            name="code"
            label="Warehouse Code"
            placeholder="e.g. WH-001"
            required
            value={formData.code}
            onChange={handleChange}
            error={errors.code}
          />
        </div>
      </div>

      {/* =====================================================
          LOCATION
      ===================================================== */}

      <div className="border-t border-border pt-5">
        <h3 className="mb-4 text-sm font-semibold">Location Details</h3>

        <div className="space-y-4">
          {/* Address */}

          <InputField
            name="address"
            label="Address"
            placeholder="Enter warehouse address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* City */}

            <InputField
              name="city"
              label="City"
              placeholder="Jaipur"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />

            {/* State */}

            <InputField
              name="state"
              label="State"
              placeholder="Rajasthan"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
            />

            {/* Pincode */}

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
          MANAGER
      ===================================================== */}

      <div className="border-t border-border pt-5">
        <h3 className="mb-4 text-sm font-semibold">Manager Details</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Manager Name */}

          <InputField
            name="managerName"
            label="Manager Name"
            placeholder="Enter manager name"
            value={formData.managerName}
            onChange={handleChange}
            error={errors.managerName}
          />

          {/* Phone */}

          <InputField
            name="phone"
            label="Phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>
      </div>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
          <div>
            <p className="text-sm font-medium">Warehouse Status</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Inactive warehouses will not be available for inventory
              operations.
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

        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : warehouse
              ? "Update Warehouse"
              : "Create Warehouse"}
        </Button>
      </div>
    </form>
  );
}
