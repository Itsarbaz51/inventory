"use client";

import React from "react";
import {
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function UserViewModal({ open, user, onClose }) {
  if (!open || !user) return null;

  const statusClass =
    user.status === "ACTIVE"
      ? "bg-green-500/10 text-green-600"
      : user.status === "BLOCKED"
        ? "bg-orange-500/10 text-orange-600"
        : "bg-destructive/10 text-destructive";

  const statusLabel =
    user.status === "ACTIVE"
      ? "Active"
      : user.status === "BLOCKED"
        ? "Blocked"
        : "Inactive";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          w-full max-w-xl
          overflow-hidden
          rounded-xl
          border border-border
          bg-card
          shadow-xl
        "
      >
        {/* Header */}
        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-full
                bg-primary/10
                text-lg font-semibold
                text-primary
              "
            >
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-foreground">
                {user.name || "-"}
              </h2>

              <p className="truncate text-sm text-muted-foreground">
                User Details
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-5">
          {/* Basic Information */}
          <section>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<UserRound size={17} />}
                label="User Number"
                value={user.userNumber}
              />
              <InfoItem
                icon={<UserRound size={17} />}
                label="Full Name"
                value={user.name}
              />

              <InfoItem
                icon={<Mail size={17} />}
                label="Email Address"
                value={user.email}
              />

              <InfoItem
                icon={<Phone size={17} />}
                label="Phone Number"
                value={user.phone || "-"}
              />

              <InfoItem
                icon={<ShieldCheck size={17} />}
                label="Role"
                value={user.role?.name || "-"}
              />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Account Information */}
          <section>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Account Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Status</p>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
                >
                  {statusLabel}
                </span>
              </div>

              <InfoItem
                icon={<CalendarDays size={17} />}
                label="Created At"
                value={user.createdAt ? formatDate(user.createdAt) : "-"}
              />

              <InfoItem
                icon={<Clock3 size={17} />}
                label="Last Login"
                value={
                  user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"
                }
              />

              <InfoItem
                icon={<ShieldCheck size={17} />}
                label="User ID"
                value={user.id || "-"}
              />
              <InfoItem
                icon={<ShieldCheck size={17} />}
                label="Tenant ID"
                value={user.tenantId || "-"}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border bg-card px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <p className="truncate text-sm font-medium text-foreground">
        {value || "-"}
      </p>
    </div>
  );
}
