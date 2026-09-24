"use client";

import React from "react";
import Button from "@/components/ui/Button";

export default function PageHeader({
  icon: Icon,
  title,
  description,

  primaryAction,
  secondaryAction,

  className = "",
}) {
  return (
    <div
      className={`
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
        ${className}
      `}
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <Icon size={20} strokeWidth={2} />
          </div>
        )}

        <div className="min-w-0">
          <h1
            className="
              truncate
              text-2xl
              font-bold
              tracking-tight
              text-foreground
            "
          >
            {title}
          </h1>

          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {secondaryAction && (
            <Button
              type="button"
              variant="outline"
              disabled={secondaryAction.disabled}
              loading={secondaryAction.loading}
              onClick={secondaryAction.onClick}
              leftIcon={secondaryAction.icon}
            >
              {secondaryAction.label}
            </Button>
          )}

          {primaryAction && (
            <Button
              type="button"
              variant={primaryAction.variant || "primary"}
              disabled={primaryAction.disabled}
              loading={primaryAction.loading}
              onClick={primaryAction.onClick}
              leftIcon={primaryAction.icon}
              rightIcon={primaryAction.rightIcon}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
