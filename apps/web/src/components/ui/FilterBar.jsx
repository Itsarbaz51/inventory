"use client";

import React from "react";
import { Search, X } from "lucide-react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

export default function FilterBar({
  search = "",
  onSearchChange,
  filters = [],
  searchPlaceholder = "Search...",
  showClear = true,
  onClear,
  className = "",
}) {
  const hasFilters =
    search || filters.some((filter) => filter.value && filter.value !== "ALL");

  return (
    <div
      className={`
        rounded-xl
        border border-border
        bg-card
        p-4
        shadow-sm
        ${className}
      `}
    >
      <div
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
          lg:grid-cols-[minmax(240px,1fr)_repeat(2,minmax(160px,180px))_auto]
        "
      >
        {/* Search */}
        {onSearchChange && (
          <InputField
            name="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search size={17} />}
          />
        )}

        {/* Filters */}
        {filters.map((filter) => (
          <SelectField
            key={filter.name}
            name={filter.name}
            label={filter.label}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            options={filter.options || []}
            placeholder={filter.placeholder || "Select..."}
            disabled={filter.disabled || false}
            error={filter.error}
            required={filter.required || false}
          />
        ))}

        {/* Clear */}
        {showClear && hasFilters && onClear && (
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClear}
              leftIcon={<X size={16} />}
              className="h-10 w-full sm:w-auto"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
