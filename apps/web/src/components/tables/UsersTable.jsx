"use client";

import React from "react";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";

export default function UsersTable({ users, loading, onEdit, onDelete }) {
  if (loading) {
    return <LoadingState message="Loading users..." />;
  }

  if (!users.length) {
    return (
      <EmptyState
        title="No users found"
        description="Try changing your filters or add a new user."
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
                User
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Phone
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Role
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Created
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/30">
                {/* User */}
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
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {user.phone || "-"}
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <span
                    className="
                    inline-flex rounded-full
                    bg-primary/10
                    px-2.5 py-1
                    text-xs font-medium
                    text-primary
                  "
                  >
                    {user.role}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`
                      inline-flex rounded-full
                      px-2.5 py-1
                      text-xs font-medium
                      ${
                        user.isActive
                          ? "bg-green-500/10 text-green-600"
                          : "bg-destructive/10 text-destructive"
                      }
                    `}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(user)}
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
        Showing {users.length} users
      </div>
    </div>
  );
}
