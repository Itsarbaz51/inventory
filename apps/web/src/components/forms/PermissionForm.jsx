"use client";

import React, { useMemo } from "react";
import Button from "@/components/ui/Button";

export default function PermissionForm({
  permissions = [],
  selectedPermissions = [],
  onChange,
  onSubmit,
  onCancel,
  loading,
}) {
  const groupedPermissions = useMemo(() => {
    return permissions.reduce((groups, permission) => {
      const module = permission?.module || "OTHER";

      if (!groups[module]) {
        groups[module] = [];
      }

      groups[module].push(permission);

      return groups;
    }, {});
  }, [permissions]);

  const togglePermission = (permissionId) => {
    const exists = selectedPermissions.includes(permissionId);

    if (exists) {
      onChange(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      onChange([...selectedPermissions, permissionId]);
    }
  };

  const toggleModule = (modulePermissions) => {
    const ids = modulePermissions.map((permission) => permission.id);

    const allSelected = ids.every((id) => selectedPermissions.includes(id));

    if (allSelected) {
      onChange(selectedPermissions.filter((id) => !ids.includes(id)));
    } else {
      onChange([...new Set([...selectedPermissions, ...ids])]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(selectedPermissions);
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
      <div className="space-y-5">
        {Object.entries(groupedPermissions).map(
          ([module, modulePermissions]) => {
            const ids = modulePermissions.map((permission) => permission.id);

            const selectedCount = ids.filter((id) =>
              selectedPermissions.includes(id),
            ).length;

            const allSelected = selectedCount === ids.length && ids.length > 0;

            return (
              <div
                key={module}
                className="
                  overflow-hidden rounded-xl
                  border border-border
                  bg-card
                "
              >
                {/* Module Header */}

                <div
                  className="
                    flex items-center justify-between
                    border-b border-border
                    bg-muted/30
                    px-4 py-3
                  "
                >
                  <div>
                    <h3 className="text-sm font-semibold">{module}</h3>

                    <p className="text-xs text-muted-foreground">
                      {selectedCount} / {modulePermissions.length} selected
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => toggleModule(modulePermissions)}
                      className="h-4 w-4 rounded"
                    />
                    Select all
                  </label>
                </div>

                {/* Permissions */}

                <div
                  className="
                    grid grid-cols-1
                    gap-2 p-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >
                  {modulePermissions.map((permission) => {
                    const checked = selectedPermissions.includes(permission.id);

                    return (
                      <label
                        key={permission.id}
                        className="
                            flex cursor-pointer
                            items-center gap-3
                            rounded-lg border
                            border-border
                            p-3
                            transition
                            hover:bg-muted/40
                          "
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(permission.id)}
                          className="h-4 w-4 rounded"
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {permission.action}
                          </p>

                          {permission.description && (
                            <p className="truncate text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          },
        )}

        {!permissions.length && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No permissions found.
          </div>
        )}
      </div>

      {/* Footer */}

      <div
        className="
          mt-6 flex justify-end gap-2
          border-t border-border
          pt-4
        "
      >
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" loading={loading}>
          Save Permissions
        </Button>
      </div>
    </form>
  );
}
