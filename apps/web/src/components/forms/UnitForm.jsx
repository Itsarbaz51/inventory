"use client";

import React, { useEffect, useState } from "react";
import { Ruler, TextCursorInput } from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import CheckboxField from "../ui/CheckboxField";

const initialForm = {
    name: "",
    shortName: "",
    isActive: true,
};

export default function UnitForm({
    unit,
    onSubmit,
    onCancel,
    loading,
}) {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (unit) {
            setFormData({
                name: unit?.name || "",
                shortName: unit?.shortName || "",
                isActive: unit?.isActive ?? true,
            });
        } else {
            setFormData(initialForm);
        }

        setErrors({});
    }, [unit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };


    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Unit name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Unit name must be at least 2 characters";
        }

        if (!formData.shortName.trim()) {
            newErrors.shortName = "Short name is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        onSubmit({
            name: formData.name.trim(),
            shortName: formData.shortName.trim(),
            isActive: formData.isActive,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-5 px-6 py-6">
                {/* Name */}

                <InputField
                    label="Unit Name"
                    name="name"
                    placeholder="e.g. Kilogram"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    leftIcon={<Ruler size={17} />}
                    required
                />

                {/* Short Name */}

                <InputField
                    label="Short Name"
                    name="shortName"
                    placeholder="e.g. kg"
                    value={formData.shortName}
                    onChange={handleChange}
                    error={errors.shortName}
                    leftIcon={<TextCursorInput size={17} />}
                    required
                />

                {/* Preview */}

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                        Preview
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold">
                                {formData.name || "Unit Name"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Measurement unit
                            </p>
                        </div>

                        <span className="rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">
                            {formData.shortName || "unit"}
                        </span>
                    </div>
                </div>

                {/* Active */}

                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-4">
                    <div>
                        <p className="text-sm font-medium">Active Unit</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Allow this unit to be used with products.
                        </p>
                    </div>

                    <div><CheckboxField
                        label={formData.isActive ? "Active Unit" : "Unactive Unit"}
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        disabled={loading}
                    /></div>
                </div>
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button type="submit" loading={loading}>
                    {unit ? "Update Unit" : "Create Unit"}
                </Button>
            </div>
        </form>
    );
}
