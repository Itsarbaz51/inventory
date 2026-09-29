"use client";

import React, { useEffect, useState } from "react";
import {
    Tag,
    FileText,
} from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import CheckboxField from "../ui/CheckboxField";

const initialForm = {
    name: "",
    description: "",
    isActive: true,
};

export default function BrandForm({
    brand,
    onSubmit,
    onCancel,
    loading,
}) {
    const [formData, setFormData] =
        useState(initialForm);

    const [errors, setErrors] = useState({});

    // =====================================================
    // INITIAL DATA
    // =====================================================

    useEffect(() => {
        if (brand) {
            setFormData({
                name: brand?.name || "",
                description: brand?.description || "",
                isActive: brand?.isActive ?? true,
            });
        } else {
            setFormData({
                ...initialForm,
            });
        }

        setErrors({});
    }, [brand]);

    // =====================================================
    // CHANGE
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // =====================================================
    // VALIDATE
    // =====================================================

    const validate = () => {
        const newErrors = {};

        const name = formData.name.trim();

        if (!name) {
            newErrors.name =
                "Brand name is required";
        } else if (name.length < 2) {
            newErrors.name =
                "Brand name must be at least 2 characters";
        }

        if (name.length > 150) {
            newErrors.name =
                "Brand name cannot exceed 150 characters";
        }

        if (formData.description.length > 500) {
            newErrors.description =
                "Description cannot exceed 500 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        onSubmit({
            name: formData.name.trim(),

            description:
                formData.description.trim() || undefined,

            isActive: formData.isActive,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
        >
            {/* Body */}

            <div
                className="
          min-h-0
          flex-1
          overflow-y-auto
          px-6
          py-5
        "
            >
                <div className="space-y-6">

                    {/* Brand Name */}

                    <InputField
                        label="Brand Name"
                        name="name"
                        placeholder="e.g. Life Fitness"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        leftIcon={<Tag size={17} />}
                        required
                    />

                    {/* Description */}

                    <InputField
                        label="Description"
                        name="description"
                        placeholder="Enter brand description"
                        value={formData.description}
                        onChange={handleChange}
                        error={errors.description}
                        leftIcon={<FileText size={17} />}
                    />

                    {/* Active */}

                    <div
                        className="
              flex
              items-center
              justify-between
              rounded-lg
              border
              border-border
              bg-muted/20
              px-4
              py-3
            "
                    >
                        <div>
                            <p className="text-sm font-medium">
                                Active Brand
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Inactive brands cannot be assigned
                                to new products.
                            </p>
                        </div>

                        <div>
                            <CheckboxField
                                label={formData.isActive ? "checked" : "check"}
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isActive:
                                            e.target.checked,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}

            <div
                className="
          shrink-0
          border-t
          border-border
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

                    <Button
                        type="submit"
                        loading={loading}
                    >
                        {brand
                            ? "Update Brand"
                            : "Create Brand"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
