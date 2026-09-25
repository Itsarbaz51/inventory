"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, UserRound, Lock } from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

const initialForm = {
  name: "",
  description: "",
};

export default function RoleForm({ role, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(initialForm);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
      });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
  }, [role]);

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
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      ...formData,
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
      max-w-2xl
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
        {/* Header - fixed */}
        <div className="shrink-0 border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            {role ? "Edit Role" : "Create Role"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {role ? "Update role information." : "Create a new role."}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Name"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name.toUpperCase()}
                  onChange={handleChange}
                  error={errors.name}
                  leftIcon={<UserRound size={17} />}
                  required
                />

                <InputField
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  leftIcon={<Mail size={17} />}
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer - fixed */}
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
                {role ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
