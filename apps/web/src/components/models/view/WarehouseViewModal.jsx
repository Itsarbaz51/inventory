"use client";

import React from "react";
import {
  Warehouse,
  Hash,
  MapPin,
  Phone,
  UserRound,
  CalendarDays,
  Activity,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function WarehouseViewModal({ open, warehouse, onClose }) {
  if (!open || !warehouse) return null;

  const isActive = warehouse?.isActive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Overlay */}
      <div
        className="
          absolute inset-0
          bg-black/50
          backdrop-blur-sm
        "
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
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <Warehouse size={23} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">
                {warehouse?.name || "-"}
              </h2>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Hash size={13} />
                {warehouse?.code || "-"}
              </div>
            </div>

            <div className="ml-auto">
              <span
                className={`
                  inline-flex
                  rounded-full
                  px-2.5 py-1
                  text-xs font-medium
                  ${
                    isActive
                      ? "bg-green-500/10 text-green-600"
                      : "bg-destructive/10 text-destructive"
                  }
                `}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div className="space-y-6 px-6 py-5">
          {/* Location */}
          <section>
            <h3 className="mb-4 text-sm font-semibold">Location Information</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<MapPin size={17} />}
                label="Address"
                value={warehouse?.address}
              />

              <InfoItem
                icon={<MapPin size={17} />}
                label="City"
                value={warehouse?.city}
              />

              <InfoItem
                icon={<MapPin size={17} />}
                label="State"
                value={warehouse?.state}
              />

              <InfoItem
                icon={<MapPin size={17} />}
                label="Pincode"
                value={warehouse?.pincode}
              />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Manager */}
          <section>
            <h3 className="mb-4 text-sm font-semibold">Manager Information</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<UserRound size={17} />}
                label="Manager Name"
                value={warehouse?.managerName}
              />

              <InfoItem
                icon={<Phone size={17} />}
                label="Phone"
                value={warehouse?.phone}
              />
            </div>
          </section>

          <div className="border-t border-border" />

          {/* Account */}
          <section>
            <h3 className="mb-4 text-sm font-semibold">
              Warehouse Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<Activity size={17} />}
                label="Status"
                value={isActive ? "Active" : "Inactive"}
              />

              <InfoItem
                icon={<CalendarDays size={17} />}
                label="Created At"
                value={
                  warehouse?.createdAt ? formatDate(warehouse.createdAt) : "-"
                }
              />

              <InfoItem
                icon={<CalendarDays size={17} />}
                label="Updated At"
                value={
                  warehouse?.updatedAt ? formatDate(warehouse.updatedAt) : "-"
                }
              />

              <InfoItem
                icon={<Hash size={17} />}
                label="Warehouse ID"
                value={warehouse?.id}
              />
            </div>
          </section>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            flex justify-end
            border-t border-border
            bg-card
            px-6 py-4
          "
        >
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
