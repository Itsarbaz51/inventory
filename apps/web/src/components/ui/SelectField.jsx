"use client";

import React from "react";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  error,
  required = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        className={`
          h-10
          w-full
          rounded-md
          border
          bg-background
          px-3
          text-sm
          text-foreground
          shadow-sm
          outline-none
          transition-colors
          focus:border-ring
          focus:ring-2
          focus:ring-ring/20
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-input"
          }
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-xs text-destructive">
          {typeof error === "string" ? error : error?.message}
        </p>
      )}
    </div>
  );
};

export default SelectField;
