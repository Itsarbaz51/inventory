"use client";

import React from "react";

export default function LoadingState({
  message = "Loading...",
  className = "",
}) {
  return (
    <div
      className={`
        flex
        min-h-32
        items-center
        justify-center
        rounded-xl
        border
        border-border
        bg-card
        p-10
        text-center
        text-sm
        text-muted-foreground
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <span
          className="
            h-4
            w-4
            animate-spin
            rounded-full
            border-2
            border-muted-foreground/30
            border-t-primary
          "
        />

        <span>{message}</span>
      </div>
    </div>
  );
}
