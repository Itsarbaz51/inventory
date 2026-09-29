"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FolderTree,
  FileText,
  GitBranch,
} from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import CheckboxField from "../ui/CheckboxField";

const initialForm = {
  name: "",
  description: "",
  parentId: "",
  isActive: true,
};

export default function CategoryForm({
  category,
  parentCategory,
  categories = [],
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditing = !!category;
  const isCreatingSubcategory = !category && !!parentCategory;
  const isCreatingMainCategory = !category && !parentCategory;

  // =====================================================
  // GET ALL DESCENDANT IDS
  // Works with nested `children` tree
  // =====================================================

  const getDescendantIds = (node) => {
    const ids = [];

    const walk = (children = []) => {
      children.forEach((child) => {
        if (!child?.id) return;

        ids.push(child.id);

        if (child.children?.length) {
          walk(child.children);
        }
      });
    };

    walk(node?.children || []);

    return ids;
  };

  // =====================================================
  // AVAILABLE PARENT CATEGORIES
  // =====================================================

  const availableCategories = useMemo(() => {
    if (!category) {
      return [];
    }

    const descendantIds = new Set(
      getDescendantIds(category),
    );

    const result = [];

    const flatten = (items = []) => {
      items.forEach((item) => {
        if (
          item?.id !== category?.id &&
          !descendantIds.has(item?.id)
        ) {
          result.push(item);
        }

        if (item?.children?.length) {
          flatten(item.children);
        }
      });
    };

    flatten(categories);

    return result;
  }, [categories, category]);

  // =====================================================
  // INITIAL FORM
  // =====================================================

  useEffect(() => {
    if (category) {
      setFormData({
        name: category?.name || "",
        description: category?.description || "",
        parentId: category?.parentId || "",
        isActive: category?.isActive ?? true,
      });
    } else if (parentCategory) {
      setFormData({
        name: "",
        description: "",
        parentId: parentCategory?.id || "",
        isActive: true,
      });
    } else {
      setFormData({
        ...initialForm,
      });
    }

    setErrors({});
  }, [category, parentCategory]);

  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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
  // ACTIVE TOGGLE
  // =====================================================

  const handleActiveChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      isActive: value,
    }));
  };

  // =====================================================
  // VALIDATE
  // =====================================================

  const validate = () => {
    const newErrors = {};

    const name = formData.name.trim();

    if (!name) {
      newErrors.name = "Category name is required";
    } else if (name.length < 2) {
      newErrors.name =
        "Category name must be at least 2 characters";
    }

    if (formData.description.length > 1000) {
      newErrors.description =
        "Description cannot exceed 1000 characters";
    }

    if (
      isCreatingSubcategory &&
      !formData.parentId
    ) {
      newErrors.parentId =
        "Parent category is required";
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
        formData.description.trim() || null,

      parentId:
        formData.parentId || null,

      isActive: formData.isActive,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-0 flex-1 flex-col"
    >
      {/* =================================================
          BODY
      ================================================= */}
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

          {/* =================================================
              CATEGORY NAME
          ================================================= */}

          <InputField
            label="Category Name"
            name="name"
            placeholder={
              isCreatingSubcategory
                ? "e.g. Android"
                : "e.g. Electronics"
            }
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            leftIcon={
              <FolderTree size={17} />
            }
            required
          />

          {/* =================================================
              MAIN CATEGORY
          ================================================= */}

          {isCreatingMainCategory && (
            <div
              className="
                rounded-lg
                border
                border-primary/20
                bg-primary/5
                px-4
                py-3
              "
            >
              <p className="text-sm font-medium text-primary">
                Main Category
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                This category will be created without
                a parent category.
              </p>
            </div>
          )}

          {/* =================================================
              SUBCATEGORY PARENT
          ================================================= */}

          {isCreatingSubcategory && (
            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-foreground
                "
              >
                Under Category
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  border
                  border-border
                  bg-muted/20
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <GitBranch size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Parent Category
                  </p>

                  <p className="truncate text-sm font-semibold">
                    {parentCategory?.name}
                  </p>
                </div>
              </div>

              {errors.parentId && (
                <p className="mt-1.5 text-xs text-destructive">
                  {errors.parentId}
                </p>
              )}
            </div>
          )}

          {/* =================================================
              EDIT PARENT
          ================================================= */}

          {isEditing && (
            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-foreground
                "
              >
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
                <option value="">
                  No Parent Category
                </option>

                {availableCategories.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>

              <p className="mt-1.5 text-xs text-muted-foreground">
                Leave empty to make this a main category.
              </p>
            </div>
          )}

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <InputField
            label="Description"
            name="description"
            type="text"
            placeholder="Enter category description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            leftIcon={
              <FileText size={17} />
            }
          />

          {/* =================================================
              ACTIVE
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-lg
              border
              border-border
              px-4
              py-3
              w-full
                            bg-muted/20

            "
          >
            <div>
              <p className="text-sm font-medium">
                Active Category
              </p>

              <p className="text-xs text-muted-foreground">
                Inactive categories cannot be used
                for new products.
              </p>
            </div>

            <div>
              <CheckboxField
                label={formData.isActive ? 'Checked' : "check"}
                checked={formData.isActive}
                onChange={(e) =>
                  handleActiveChange(
                    e.target.checked,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

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
            {category
              ? "Update Category"
              : isCreatingSubcategory
                ? "Create Subcategory"
                : "Create Category"}
          </Button>
        </div>
      </div>
    </form>
  );
}
