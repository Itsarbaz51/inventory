"use client";

import React, { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import CheckboxField from "@/components/ui/CheckboxField";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import ImageUploadField from "@/components/ui/ImageUploadField";

const defaultForm = {
    name: "",
    sku: "",
    barcode: "",
    categoryId: "",
    brandId: "",
    unitId: "",
    hsnCode: "",
    purchasePrice: "",
    sellingPrice: "",
    mrp: "",
    taxRate: "",
    minStock: "",
    maxStock: "",
    description: "",
    isActive: true,
};

export default function ProductForm({
    product,
    onSubmit,
    onCancel,
    loading = false,
}) {
    const [form, setForm] = useState(defaultForm);

    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState("");

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                sku: product.sku || "",
                barcode: product.barcode || "",
                categoryId: product.categoryId || "",
                brandId: product.brandId || "",
                unitId: product.unitId || "",
                hsnCode: product.hsnCode || "",
                purchasePrice: product.purchasePrice ?? "",
                sellingPrice: product.sellingPrice ?? "",
                mrp: product.mrp ?? "",
                taxRate: product.taxRate ?? "",
                minStock: product.minStock ?? "",
                maxStock: product.maxStock ?? "",
                description: product.description || "",
                isActive: product.isActive ?? true,
            });

            setImageFile(null);
            setImageError("");
        } else {
            setForm(defaultForm);
            setImageFile(null);
            setImageError("");
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleToggle = (checked) => {
        setForm((prev) => ({
            ...prev,
            isActive: checked,
        }));
    };

    const handleImageChange = (file, error) => {
        setImageError(error || "");

        setImageFile(file || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageError) {
            return;
        }

        const payload = {
            name: form.name.trim(),
            sku: form.sku.trim(),

            barcode:
                form.barcode.trim() || null,

            categoryId:
                form.categoryId.trim() || null,

            brandId:
                form.brandId.trim() || null,

            unitId:
                form.unitId.trim(),

            hsnCode:
                form.hsnCode.trim() || null,

            purchasePrice:
                form.purchasePrice === ""
                    ? 0
                    : Number(form.purchasePrice),

            sellingPrice:
                form.sellingPrice === ""
                    ? 0
                    : Number(form.sellingPrice),

            mrp:
                form.mrp === ""
                    ? null
                    : Number(form.mrp),

            taxRate:
                form.taxRate === ""
                    ? 0
                    : Number(form.taxRate),

            minStock:
                form.minStock === ""
                    ? 0
                    : Number(form.minStock),

            maxStock:
                form.maxStock === ""
                    ? null
                    : Number(form.maxStock),

            description:
                form.description.trim() || null,

            isActive: form.isActive,

            // Image file
            image: imageFile,
        };

        await onSubmit(payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* =====================================================
          BASIC INFORMATION
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                        label="Product Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="SKU"
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        placeholder="Enter SKU"
                        required
                        disabled={loading}
                    />

                    <InputField
                        label="Barcode"
                        name="barcode"
                        value={form.barcode}
                        onChange={handleChange}
                        placeholder="Enter barcode"
                        disabled={loading}
                    />

                    <InputField
                        label="HSN Code"
                        name="hsnCode"
                        value={form.hsnCode}
                        onChange={handleChange}
                        placeholder="Enter HSN code"
                        disabled={loading}
                    />

                    <InputField
                        label="Category ID"
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        placeholder="Category UUID"
                        disabled={loading}
                    />

                    <InputField
                        label="Brand ID"
                        name="brandId"
                        value={form.brandId}
                        onChange={handleChange}
                        placeholder="Brand UUID"
                        disabled={loading}
                    />

                    <InputField
                        label="Unit ID"
                        name="unitId"
                        value={form.unitId}
                        onChange={handleChange}
                        placeholder="Unit UUID"
                        required
                        disabled={loading}
                    />
                </div>
            </section>

            <div className="border-t border-border" />

            {/* =====================================================
          IMAGE
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Product Image
                </h3>

                <ImageUploadField
                    label="Product Image"
                    value={product?.image || ""}
                    onChange={handleImageChange}
                    error={imageError}
                    disabled={loading}
                />
            </section>

            <div className="border-t border-border" />

            {/* =====================================================
          PRICING
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Pricing
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InputField
                        label="Purchase Price"
                        name="purchasePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.purchasePrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        disabled={loading}
                    />

                    <InputField
                        label="Selling Price"
                        name="sellingPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.sellingPrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        disabled={loading}
                    />

                    <InputField
                        label="MRP"
                        name="mrp"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.mrp}
                        onChange={handleChange}
                        placeholder="0.00"
                        disabled={loading}
                    />

                    <InputField
                        label="Tax Rate (%)"
                        name="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={form.taxRate}
                        onChange={handleChange}
                        placeholder="0"
                        disabled={loading}
                    />
                </div>
            </section>

            <div className="border-t border-border" />

            {/* =====================================================
          STOCK
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Stock Settings
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                        label="Minimum Stock"
                        name="minStock"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.minStock}
                        onChange={handleChange}
                        placeholder="0"
                        disabled={loading}
                    />

                    <InputField
                        label="Maximum Stock"
                        name="maxStock"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.maxStock}
                        onChange={handleChange}
                        placeholder="Unlimited"
                        disabled={loading}
                    />
                </div>
            </section>

            <div className="border-t border-border" />

            {/* =====================================================
          DESCRIPTION
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Description
                </h3>

                <div>
                    <label className="mb-1.5 block text-sm font-medium">
                        Product Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        maxLength={5000}
                        disabled={loading}
                        placeholder="Enter product description..."
                        className="
              w-full rounded-md border
              border-input
              bg-background
              px-3 py-2
              text-sm text-foreground
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
                        {form.description.length}/5000
                    </p>
                </div>
            </section>

            <div className="border-t border-border" />

            {/* =====================================================
          STATUS
      ===================================================== */}

            <section>
                <h3 className="mb-4 text-sm font-semibold">
                    Status
                </h3>

                <div className="space-y-4">
                    <ToggleSwitch
                        label="Active Product"
                        description="Inactive products will not be available for new transactions."
                        checked={form.isActive}
                        onChange={handleToggle}
                        disabled={loading}
                    />

                    <CheckboxField
                        label="Confirm product information"
                        description="I have verified that the product information is correct."
                        name="confirmProduct"
                        disabled={loading}
                    />
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
                    disabled={loading || !!imageError}
                >
                    {loading
                        ? "Saving..."
                        : product
                            ? "Update Product"
                            : "Create Product"}
                </Button>
            </div>
        </form>
    );
}