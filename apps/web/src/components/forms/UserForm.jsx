"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, UserRound } from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  roleId: "",
  status: "ACTIVE",
};

export default function UserForm({
  user,
  onSubmit,
  onCancel,
  loading,
  roleOptions,
}) {
  const [formData, setFormData] = useState(initialForm);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        roleId: user.roleId || "",
        status: user.status || "ACTIVE",
      });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
  }, [user]);

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.roleId) {
      newErrors.roleId = "Role is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
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

    if (user && !payload.password) {
      delete payload.password;
    }

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
          <h2 className="text-lg font-semibold text-foreground">Create User</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a new user account.
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
              {/* Basic Information */}
              <section>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Basic Information
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the user's basic account information.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="Full Name"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    leftIcon={<UserRound size={17} />}
                    required
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
                    required
                  />

                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    maxLength={10}
                    leftIcon={<Phone size={17} />}
                  />
                </div>
              </section>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Access & Role */}
              <section>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Access & Role
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Configure the user's role and system access.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Role"
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    placeholder="Select role"
                    required
                    options={roleOptions}
                    disabled={!!user}
                  />

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
                        value: "BLOCKED",
                        label: "Blocked",
                      },
                    ]}
                  />
                </div>
              </section>
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
                {user ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
