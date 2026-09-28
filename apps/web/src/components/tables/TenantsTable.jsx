"use client";

import React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";


import Button from "@/components/ui/Button";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import Pagination from "../ui/Pagination";
import { formatDate } from "@/lib/utils";

export default function TenantsTable({
  tenants,
  loading,
  onView,
  onEdit,
  onDelete,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) {


  if (loading) {
    return <LoadingState message="Loading tenants..." />;
  }

  if (!tenants.length) {
    return (
      <EmptyState
        title="No tenants found"
        description="Try changing your filters or add a new tenant."
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
        <table className="w-full min-w-200">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {/* Tenant */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Tenant
              </th>

              {/* Phone */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Tenant Number
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Phone
              </th>

              {/* Status */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Status
              </th>

              {/* Created */}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Created
              </th>

              {/* Actions */}
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {tenants.map((tenant) => (
              <tr
                key={tenant.id}
                className="transition-colors hover:bg-muted/30"
              >
                {/* Tenant */}
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
                      {tenant.name?.charAt(0)?.toUpperCase() || "T"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {tenant.name || "-"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {tenant.email || "-"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {tenant.tenantNumber || "-"}
                </td>
                {/* Phone */}
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {tenant.phone || "-"}
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`
                        inline-flex rounded-full
                        px-2.5 py-1
                        text-xs font-medium
                        ${tenant.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-600"
                        : tenant.status === "BLOCKED"
                          ? "bg-orange-500/10 text-orange-600"
                          : "bg-destructive/10 text-destructive"
                      }
    `}
                  >
                    {tenant.status === "ACTIVE"
                      ? "Active"
                      : tenant.status === "BLOCKED"
                        ? "Blocked"
                        : "Inactive"}
                  </span>
                </td>

                {/* Created */}
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {tenant.createdAt
                    ? formatDate(tenant.createdAt)
                    : "-"}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(tenant)}
                      title="View"
                    >
                      <Eye size={16} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(tenant)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Button>

                    {/* Delete */}
                    {/* 
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(tenant)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                    */}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
        loading={loading}
      />


      {/* Footer */}
      <div
        className="
          border-t border-border
          px-5 py-3
          text-xs text-muted-foreground
        "
      >
        Showing {tenants.length} tenants
      </div>
    </div>
  );
}
