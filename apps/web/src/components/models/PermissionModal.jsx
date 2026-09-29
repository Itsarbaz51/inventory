"use client";

import React from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import PermissionForm from "../forms/PermissionForm";

export default function PermissionModal({
  open,
  onClose,
  role,
  permissions,
  selectedPermissions,
  onChange,
  onSubmit,
  loading,
}) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-start justify-center
        overflow-y-auto
        bg-black/50
        p-4
        sm:items-center
        sm:p-6
      "
    >
      <div
        className="
          relative my-4 flex w-full max-w-3xl
          flex-col overflow-hidden
          rounded-xl border border-border
          bg-card shadow-xl
          sm:my-6
          max-h-[calc(100vh-2rem)]
          sm:max-h-[calc(100vh-3rem)]
        "
      >
        {/* Header */}

        <div
          className="
            flex items-center justify-between
            border-b border-border
            px-6 py-4
          "
        >
          <div>
            <h2 className="text-lg font-semibold">Manage Permissions</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {role?.name
                ? `Manage permissions for ${role.name}`
                : "Manage role permissions"}
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        {/* Form */}

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <PermissionForm
            permissions={permissions}
            selectedPermissions={selectedPermissions}
            onChange={onChange}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
