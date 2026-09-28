"use client";

import React, { useEffect, useState } from "react";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    FileText,
    Hash,
    Package,
    Image,
} from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

const initialForm = {
    name: "",
    businessName: "",
    email: "",
    phone: "",

    gstNumber: "",
    panNumber: "",
    businessType: "",
    logo: "",

    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    invoicePrefix: "INV",
    purchasePrefix: "PUR",
    salesReturnPrefix: "SR",
    purchaseReturnPrefix: "PR",

    invoiceStartNumber: 1,
    purchaseStartNumber: 1,
    salesReturnStartNumber: 1,
    purchaseReturnStartNumber: 1,

    lowStockThreshold: 10,

    status: "ACTIVE",
};

export default function TenantForm({
    tenant,
    onSubmit,
    onCancel,
    loading,
}) {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || "",
                businessName: tenant.businessName || "",
                email: tenant.email || "",
                phone: tenant.phone || "",

                gstNumber: tenant.gstNumber || "",
                panNumber: tenant.panNumber || "",
                businessType: tenant.businessType || "",
                logo: tenant.logo || "",

                address: tenant.address || "",
                city: tenant.city || "",
                state: tenant.state || "",
                pincode: tenant.pincode || "",
                country: tenant.country || "India",

                invoicePrefix: tenant.invoicePrefix || "INV",
                purchasePrefix: tenant.purchasePrefix || "PUR",
                salesReturnPrefix: tenant.salesReturnPrefix || "SR",
                purchaseReturnPrefix: tenant.purchaseReturnPrefix || "PR",

                invoiceStartNumber: tenant.invoiceStartNumber ?? 1,
                purchaseStartNumber: tenant.purchaseStartNumber ?? 1,
                salesReturnStartNumber: tenant.salesReturnStartNumber ?? 1,
                purchaseReturnStartNumber: tenant.purchaseReturnStartNumber ?? 1,

                lowStockThreshold: tenant.lowStockThreshold ?? 10,

                status: tenant.status || "ACTIVE",
            });
        } else {
            setFormData(initialForm);
        }

        setErrors({});
    }, [tenant]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "gstNumber" || name === "panNumber") {
            newValue = value.toUpperCase().replace(/\s/g, "");
        }

        if (name === "pincode") {
            newValue = value.replace(/\D/g, "").slice(0, 6);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        const name = formData.name?.trim() || "";
        const businessName = formData.businessName?.trim() || "";
        const email = formData.email?.trim() || "";
        const phone = formData.phone?.trim() || "";
        const gstNumber = formData.gstNumber?.trim().toUpperCase() || "";
        const panNumber = formData.panNumber?.trim().toUpperCase() || "";
        const businessType = formData.businessType?.trim() || "";
        const address = formData.address?.trim() || "";
        const city = formData.city?.trim() || "";
        const state = formData.state?.trim() || "";
        const pincode = formData.pincode?.trim() || "";
        const country = formData.country?.trim() || "";

        const invoicePrefix = formData.invoicePrefix?.trim() || "";
        const purchasePrefix = formData.purchasePrefix?.trim() || "";
        const salesReturnPrefix =
            formData.salesReturnPrefix?.trim() || "";
        const purchaseReturnPrefix =
            formData.purchaseReturnPrefix?.trim() || "";

        // =====================================================
        // NAME
        // =====================================================

        if (!name) {
            newErrors.name = "Tenant name is required";
        } else if (name.length < 2) {
            newErrors.name = "Tenant name must be at least 2 characters";
        } else if (name.length > 150) {
            newErrors.name = "Tenant name cannot exceed 150 characters";
        } else if (!/^[A-Za-z0-9&.,'()\-\/\s]+$/.test(name)) {
            newErrors.name =
                "Tenant name contains invalid characters";
        }

        // =====================================================
        // BUSINESS NAME
        // =====================================================

        if (businessName) {
            if (businessName.length > 150) {
                newErrors.businessName =
                    "Business name cannot exceed 150 characters";
            } else if (
                !/^[A-Za-z0-9&.,'()\-\/\s]+$/.test(businessName)
            ) {
                newErrors.businessName =
                    "Business name contains invalid characters";
            }
        }

        // =====================================================
        // EMAIL
        // =====================================================

        if (email) {
            if (email.length > 150) {
                newErrors.email =
                    "Email cannot exceed 150 characters";
            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ) {
                newErrors.email = "Enter a valid email address";
            }
        }

        // =====================================================
        // PHONE
        // =====================================================

        if (phone) {
            if (!/^\+?[0-9\s\-()]+$/.test(phone)) {
                newErrors.phone =
                    "Phone number can contain only numbers, +, spaces, -, and parentheses";
            } else {
                const phoneDigits = phone.replace(/\D/g, "");

                if (phoneDigits.length < 10) {
                    newErrors.phone =
                        "Phone number must contain at least 10 digits";
                } else if (phoneDigits.length > 15) {
                    newErrors.phone =
                        "Phone number cannot exceed 15 digits";
                }
            }
        }

        // =====================================================
        // GSTIN
        // =====================================================

        if (gstNumber) {
            if (gstNumber.length !== 15) {
                newErrors.gstNumber =
                    "GST number must be exactly 15 characters";
            } else if (
                !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
                    gstNumber,
                )
            ) {
                newErrors.gstNumber =
                    "Enter a valid GST number";
            }
        }

        // =====================================================
        // PAN
        // =====================================================

        if (panNumber) {
            if (panNumber.length !== 10) {
                newErrors.panNumber =
                    "PAN number must be exactly 10 characters";
            } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
                newErrors.panNumber =
                    "Enter a valid PAN number";
            }
        }

        // =====================================================
        // BUSINESS TYPE
        // =====================================================

        if (businessType) {
            if (businessType.length > 100) {
                newErrors.businessType =
                    "Business type cannot exceed 100 characters";
            } else if (!/^[A-Za-z0-9&.,'()\-\/\s]+$/.test(businessType)) {
                newErrors.businessType =
                    "Business type contains invalid characters";
            }
        }

        // =====================================================
        // LOGO
        // =====================================================

        if (formData.logo?.trim()) {
            const logo = formData.logo.trim();

            if (logo.length > 500) {
                newErrors.logo =
                    "Logo URL cannot exceed 500 characters";
            } else {
                try {
                    new URL(logo);
                } catch {
                    newErrors.logo = "Enter a valid logo URL";
                }
            }
        }

        // =====================================================
        // ADDRESS
        // =====================================================

        if (address && address.length > 1000) {
            newErrors.address =
                "Address cannot exceed 1000 characters";
        }

        // =====================================================
        // CITY
        // =====================================================

        if (city) {
            if (city.length > 100) {
                newErrors.city =
                    "City cannot exceed 100 characters";
            } else if (!/^[A-Za-z0-9\s.'-]+$/.test(city)) {
                newErrors.city =
                    "City contains invalid characters";
            }
        }

        // =====================================================
        // STATE
        // =====================================================

        if (state) {
            if (state.length > 100) {
                newErrors.state =
                    "State cannot exceed 100 characters";
            } else if (!/^[A-Za-z0-9\s.'-]+$/.test(state)) {
                newErrors.state =
                    "State contains invalid characters";
            }
        }

        // =====================================================
        // PINCODE
        // =====================================================

        if (pincode) {
            if (!/^\d{6}$/.test(pincode)) {
                newErrors.pincode =
                    "Pincode must be exactly 6 digits";
            } else if (pincode.startsWith("0")) {
                newErrors.pincode =
                    "Pincode cannot start with 0";
            }
        }

        // =====================================================
        // COUNTRY
        // =====================================================

        if (!country) {
            newErrors.country = "Country is required";
        } else if (country.length > 100) {
            newErrors.country =
                "Country cannot exceed 100 characters";
        } else if (!/^[A-Za-z\s.'-]+$/.test(country)) {
            newErrors.country =
                "Country contains invalid characters";
        }

        // =====================================================
        // PREFIX VALIDATION
        // =====================================================

        const validatePrefix = (value, fieldName, label) => {
            if (!value) {
                newErrors[fieldName] = `${label} is required`;
                return;
            }

            if (value.length < 1 || value.length > 20) {
                newErrors[fieldName] =
                    `${label} must be between 1 and 20 characters`;
                return;
            }

            if (!/^[A-Za-z0-9_-]+$/.test(value)) {
                newErrors[fieldName] =
                    `${label} can contain only letters, numbers, - and _`;
            }
        };

        validatePrefix(
            invoicePrefix,
            "invoicePrefix",
            "Invoice prefix",
        );

        validatePrefix(
            purchasePrefix,
            "purchasePrefix",
            "Purchase prefix",
        );

        validatePrefix(
            salesReturnPrefix,
            "salesReturnPrefix",
            "Sales return prefix",
        );

        validatePrefix(
            purchaseReturnPrefix,
            "purchaseReturnPrefix",
            "Purchase return prefix",
        );

        // =====================================================
        // START NUMBERS
        // =====================================================

        const validatePositiveNumber = (
            value,
            fieldName,
            label,
        ) => {
            if (
                value === "" ||
                value === null ||
                value === undefined
            ) {
                newErrors[fieldName] = `${label} is required`;
                return;
            }

            const number = Number(value);

            if (!Number.isInteger(number)) {
                newErrors[fieldName] =
                    `${label} must be a whole number`;
                return;
            }

            if (number < 1) {
                newErrors[fieldName] =
                    `${label} must be at least 1`;
            }
        };

        validatePositiveNumber(
            formData.invoiceStartNumber,
            "invoiceStartNumber",
            "Invoice start number",
        );

        validatePositiveNumber(
            formData.purchaseStartNumber,
            "purchaseStartNumber",
            "Purchase start number",
        );

        validatePositiveNumber(
            formData.salesReturnStartNumber,
            "salesReturnStartNumber",
            "Sales return start number",
        );

        validatePositiveNumber(
            formData.purchaseReturnStartNumber,
            "purchaseReturnStartNumber",
            "Purchase return start number",
        );

        // =====================================================
        // LOW STOCK THRESHOLD
        // =====================================================

        if (
            formData.lowStockThreshold === "" ||
            formData.lowStockThreshold === null ||
            formData.lowStockThreshold === undefined
        ) {
            newErrors.lowStockThreshold =
                "Low stock threshold is required";
        } else {
            const threshold = Number(formData.lowStockThreshold);

            if (!Number.isInteger(threshold)) {
                newErrors.lowStockThreshold =
                    "Low stock threshold must be a whole number";
            } else if (threshold < 0) {
                newErrors.lowStockThreshold =
                    "Low stock threshold cannot be negative";
            }
        }

        // =====================================================
        // STATUS
        // =====================================================

        const allowedStatuses = [
            "ACTIVE",
            "INACTIVE",
            "SUSPENDED",
        ];

        if (!allowedStatuses.includes(formData.status)) {
            newErrors.status = "Invalid tenant status";
        }

        // =====================================================
        // SET ERRORS
        // =====================================================

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const payload = {
            ...formData,

            invoiceStartNumber: Number(formData.invoiceStartNumber),
            purchaseStartNumber: Number(formData.purchaseStartNumber),
            salesReturnStartNumber: Number(
                formData.salesReturnStartNumber,
            ),
            purchaseReturnStartNumber: Number(
                formData.purchaseReturnStartNumber,
            ),
            lowStockThreshold: Number(formData.lowStockThreshold),

            businessName: formData.businessName.trim() || null,
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
            gstNumber: formData.gstNumber.trim() || null,
            panNumber: formData.panNumber.trim() || null,
            businessType: formData.businessType.trim() || null,
            logo: formData.logo.trim() || null,
            address: formData.address.trim() || null,
            city: formData.city.trim() || null,
            state: formData.state.trim() || null,
            pincode: formData.pincode.trim() || null,
        };

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div
                className="
          relative z-10
          flex
          w-full
          max-w-4xl
          max-h-[calc(100vh-24px)]
          sm:max-h-[calc(100vh-40px)]
          flex-col
          overflow-hidden
          rounded-xl
          border border-border
          bg-card
          shadow-xl
        "
            >
                {/* Header */}
                <div className="shrink-0 border-b border-border px-6 py-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        {tenant ? "Edit Tenant" : "Create Tenant"}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {tenant
                            ? "Update tenant and business information."
                            : "Create a new tenant and configure its business settings."}
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Scrollable body */}
                    <div
                        className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              px-6
              py-5
            "
                    >
                        <div className="space-y-7">
                            {/* ================================================= */}
                            {/* Basic Information */}
                            {/* ================================================= */}
                            <section>
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Basic Information
                                    </h3>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Enter the tenant's basic contact information.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <InputField
                                        label="Tenant Name"
                                        name="name"
                                        placeholder="Enter tenant name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        leftIcon={<Building2 size={17} />}
                                        required
                                    />

                                    <InputField
                                        label="Business Name"
                                        name="businessName"
                                        placeholder="Enter business name"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        leftIcon={<Building2 size={17} />}
                                    />

                                    <InputField
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        leftIcon={<Mail size={17} />}
                                    />

                                    <InputField
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={10}
                                        leftIcon={<Phone size={17} />}
                                    />
                                </div>
                            </section>

                            <div className="border-t border-border" />

                            {/* ================================================= */}
                            {/* Business Information */}
                            {/* ================================================= */}
                            <section>
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Business Information
                                    </h3>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Add tax and business details.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <InputField
                                        label="GST Number"
                                        name="gstNumber"
                                        placeholder="Enter GST number"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        leftIcon={<FileText size={17} />}
                                    />

                                    <InputField
                                        label="PAN Number"
                                        name="panNumber"
                                        placeholder="Enter PAN number"
                                        value={formData.panNumber}
                                        onChange={handleChange}
                                        leftIcon={<FileText size={17} />}
                                    />

                                    <InputField
                                        label="Business Type"
                                        name="businessType"
                                        placeholder="e.g. Retail, Wholesale"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        leftIcon={<Building2 size={17} />}
                                    />

                                    <InputField
                                        label="Logo URL"
                                        name="logo"
                                        placeholder="Enter logo URL"
                                        value={formData.logo}
                                        onChange={handleChange}
                                        leftIcon={<Image size={17} />}
                                    />
                                </div>
                            </section>

                            <div className="border-t border-border" />

                            {/* ================================================= */}
                            {/* Address */}
                            {/* ================================================= */}
                            <section>
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Address
                                    </h3>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Enter the tenant's business address.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <InputField
                                        label="Address"
                                        name="address"
                                        placeholder="Enter complete address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        leftIcon={<MapPin size={17} />}
                                    />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <InputField
                                            label="City"
                                            name="city"
                                            placeholder="Enter city"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />

                                        <InputField
                                            label="State"
                                            name="state"
                                            placeholder="Enter state"
                                            value={formData.state}
                                            onChange={handleChange}
                                        />

                                        <InputField
                                            label="Pincode"
                                            name="pincode"
                                            placeholder="Enter pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                        />

                                        <InputField
                                            label="Country"
                                            name="country"
                                            placeholder="Enter country"
                                            value={formData.country}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="border-t border-border" />

                            {/* ================================================= */}
                            {/* Invoice Settings */}
                            {/* ================================================= */}
                            <section>
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Invoice & Numbering
                                    </h3>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Configure document prefixes and starting numbers.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <InputField
                                        label="Invoice Prefix"
                                        name="invoicePrefix"
                                        placeholder="INV"
                                        value={formData.invoicePrefix}
                                        onChange={handleChange}
                                        leftIcon={<Hash size={17} />}
                                        required
                                    />

                                    <InputField
                                        label="Invoice Start Number"
                                        name="invoiceStartNumber"
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        value={formData.invoiceStartNumber}
                                        onChange={handleChange}
                                        error={errors.invoiceStartNumber}
                                    />

                                    <InputField
                                        label="Purchase Prefix"
                                        name="purchasePrefix"
                                        placeholder="PUR"
                                        value={formData.purchasePrefix}
                                        onChange={handleChange}
                                        leftIcon={<Hash size={17} />}
                                        required
                                    />

                                    <InputField
                                        label="Purchase Start Number"
                                        name="purchaseStartNumber"
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        value={formData.purchaseStartNumber}
                                        onChange={handleChange}
                                        error={errors.purchaseStartNumber}
                                    />

                                    <InputField
                                        label="Sales Return Prefix"
                                        name="salesReturnPrefix"
                                        placeholder="SR"
                                        value={formData.salesReturnPrefix}
                                        onChange={handleChange}
                                        leftIcon={<Hash size={17} />}
                                        required
                                    />

                                    <InputField
                                        label="Sales Return Start Number"
                                        name="salesReturnStartNumber"
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        value={formData.salesReturnStartNumber}
                                        onChange={handleChange}
                                        error={errors.salesReturnStartNumber}
                                    />

                                    <InputField
                                        label="Purchase Return Prefix"
                                        name="purchaseReturnPrefix"
                                        placeholder="PR"
                                        value={formData.purchaseReturnPrefix}
                                        onChange={handleChange}
                                        leftIcon={<Hash size={17} />}
                                        required
                                    />

                                    <InputField
                                        label="Purchase Return Start Number"
                                        name="purchaseReturnStartNumber"
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        value={formData.purchaseReturnStartNumber}
                                        onChange={handleChange}
                                        error={errors.purchaseReturnStartNumber}
                                    />
                                </div>
                            </section>

                            <div className="border-t border-border" />

                            {/* ================================================= */}
                            {/* Inventory Settings */}
                            {/* ================================================= */}
                            <section>
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Inventory Settings
                                    </h3>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Configure inventory-related tenant settings.
                                    </p>
                                </div>

                                <div className="max-w-md">
                                    <InputField
                                        label="Low Stock Threshold"
                                        name="lowStockThreshold"
                                        type="number"
                                        min="0"
                                        placeholder="10"
                                        value={formData.lowStockThreshold}
                                        onChange={handleChange}
                                        error={errors.lowStockThreshold}
                                        leftIcon={<Package size={17} />}
                                        helperText="Products at or below this quantity will be considered low stock."
                                    />
                                </div>
                            </section>

                            <div className="border-t border-border" />

                            {/* ================================================= */}
                            {/* Status */}
                            {/* ================================================= */}
                            <section>
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Tenant Status
                                    </h3>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Control the current status of this tenant.
                                    </p>
                                </div>

                                <div className="max-w-md">
                                    <SelectField
                                        label="Status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        placeholder="Select status"
                                        required
                                        options={[
                                            {
                                                value: "ACTIVE",
                                                label: "Active",
                                            },
                                            {
                                                value: "INACTIVE",
                                                label: "Inactive",
                                            },
                                            {
                                                value: "SUSPENDED",
                                                label: "Suspended",
                                            },
                                        ]}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="
              shrink-0
              border-t border-border
              bg-card
              px-6
              py-4
            "
                    >
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" loading={loading}>
                                {tenant ? "Update Tenant" : "Create Tenant"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
