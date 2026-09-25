"use client";

import React from "react";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import { formatDate } from "@/lib/utils";

export default function RolesTable({ roles, loading, onEdit, onDelete }) {
  if (loading) {
    return <LoadingState message="Loading roles..." />;
  }

  if (!roles.length) {
    return (
      <EmptyState
        title="No roles found"
        description="Try changing your filters or add a new role."
      />
    );
  }

  return (
    <div
      className="
      overflow-hidden
      rounded-xl
      border border-border
      bg-card
      shadow-sm
    "
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Role Name
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Created
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Updated
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {roles.map((role) => (
              <tr key={role.id} className="transition-colors hover:bg-muted/30">
                {/* role */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-primary/10
                      font-semibold
                      text-primary
                    "
                    >
                      {role.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {role.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {role.createdAt ? formatDate(role.createdAt) : "-"}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {role.updatedAt ? formatDate(role.updatedAt) : "-"}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(role)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(role)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="
        border-t border-border
        px-5 py-3
        text-xs text-muted-foreground
      "
      >
        Showing {roles.length} roles
      </div>
    </div>
  );
}
