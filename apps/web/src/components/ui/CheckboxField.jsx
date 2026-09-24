"use client";

import React from "react";

const CheckboxField = ({
  label,
  description,
  name,
  checked = false,
  onChange,
  disabled = false,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label
        className={`
          flex
          cursor-pointer
          items-center
          gap-3
          rounded-lg
          border
          border-border
          bg-muted/30
          p-3
          transition-colors
          hover:bg-muted/50
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="
            h-4
            w-4
            shrink-0
            rounded
            border-input
            accent-primary
            focus:ring-2
            focus:ring-ring/20
          "
          {...props}
        />

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
      </label>

      {error && (
        <p className="mt-1 text-xs text-destructive">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}
    </div>
  );
};

export default CheckboxField;
