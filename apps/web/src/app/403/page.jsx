"use client";

import Link from "next/link";
import {
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  LockKeyhole,
} from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldAlert
            size={42}
            strokeWidth={1.7}
            className="text-destructive"
          />
        </div>

        {/* Error Code */}
        <p className="mb-2 text-7xl font-bold tracking-tight text-foreground">
          403
        </p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>

        {/* Permission info */}
        <div className="mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-xl border border-border bg-card p-4 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <LockKeyhole size={19} className="text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              Insufficient permissions
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Your role doesn't have access to this resource.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-border
              bg-background
              px-4
              text-sm
              font-medium
              text-foreground
              transition-colors
              hover:bg-muted
            "
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link
            href="/dashboard"
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-primary
              px-4
              text-sm
              font-medium
              text-primary-foreground
              transition-colors
              hover:bg-primary/90
            "
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
