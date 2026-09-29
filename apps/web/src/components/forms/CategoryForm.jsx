"use client";

import React, { useEffect, useState } from "react";
import { FolderTree, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

const initialForm = {
  name: "",
  description: "",
  parentId: "",
  isActive: true,
};

export default function CategoryForm({
  category,
  categories = [],
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category?.name || "",
        description: category?.description || "",
        parentId: category?.parentId || "",
        isActive: category?.isActive ?? true,
      });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
  }, [category]);

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
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      parentId: formData.parentId || null,
      isActive: formData.isActive,
    });
  };

  /**
   * Don't allow selecting current category as parent.
   */
  const availableCategories = categories.filter(
    (item) => item?.id !== category?.id,
  );

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      {/* Scrollable Body */}
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
        <div className="space-y-6">
          {/* Category Name */}
          <InputField
            label="Category Name"
            name="name"
            placeholder="e.g. Electronics"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            leftIcon={<FolderTree size={17} />}
            required
          />

          {/* Parent Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Under Category
            </label>

            <select
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              className="
                h-10
                w-full
                rounded-md
                border
                border-border
                bg-background
                px-3
                text-sm
                text-foreground
                outline-none
                transition
                focus:border-primary
                focus:ring-2
                focus:ring-primary/20
              "
            >
              <option value="">No Parent Category</option>

              {availableCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <p className="mt-1.5 text-xs text-muted-foreground">
              Leave empty if this is a main category.
            </p>
          </div>

          {/* Description */}
          <InputField
            label="Description"
            name="description"
            type="text"
            placeholder="Enter category description"
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
              <p className="text-sm font-medium">Active Category</p>

              <p className="text-xs text-muted-foreground">
                Inactive categories cannot be used for new products.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
              className={`
                relative
                h-6
                w-11
                rounded-full
                transition-colors
                ${formData.isActive ? "bg-primary" : "bg-muted-foreground/30"}
              `}
            >
              <span
                className={`
                  absolute
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  rounded-full
                  bg-white
                  shadow
                  transition-transform
                  ${formData.isActive ? "translate-x-6" : "translate-x-1"}
                `}
              />
            </button>
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

          <Button type="submit" loading={loading}>
            {category ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </div>
    </form>
  );
}
