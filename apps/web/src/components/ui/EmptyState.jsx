"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There is no data to display.",
  icon: Icon = MoreHorizontal,
  className = "",
  children,
}) {
  return (
    <div
      className={`
        rounded-xl
        border border-border
        bg-card
        p-12
        text-center
        ${className}
      `}
    >
      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-muted
          text-muted-foreground
        "
      >
        <Icon size={20} />
      </div>

      <h3 className="mt-4 font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>

      {children && (
        <div className="mt-5">
          {children}
        </div>
      )}
    </div>
  );
}