"use client";

import React from "react";

export default function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  size = "md",
}) {
  const sizes = {
    sm: {
      wrapper: "h-5 w-9",
      circle: "h-4 w-4",
      translate: "translate-x-4",
    },
    md: {
      wrapper: "h-6 w-11",
      circle: "h-5 w-5",
      translate: "translate-x-5",
    },
    lg: {
      wrapper: "h-7 w-13",
      circle: "h-6 w-6",
      translate: "translate-x-6",
    },
  };

  const currentSize = sizes[size] || sizes.md;

  const handleToggle = () => {
    if (disabled) return;

    onChange?.(!checked);
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      {(label || description) && (
        <div className="min-w-0">
          {label && (
            <p className="text-sm font-medium text-foreground">{label}</p>
          )}

          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex shrink-0
          ${currentSize.wrapper}
          items-center rounded-full
          transition-colors duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-primary/30
          ${checked ? "bg-primary" : "bg-muted-foreground/30"}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className={`
            inline-block
            ${currentSize.circle}
            translate-x-0.5
            rounded-full
            bg-white
            shadow-sm
            ring-0
            transition-transform duration-200
            ${checked ? currentSize.translate : ""}
          `}
        />
      </button>
    </div>
  );
}
