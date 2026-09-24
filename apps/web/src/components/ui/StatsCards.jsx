"use client";

import React from "react";

export default function StatsCards({
  stats = [],
  columns = 4,
  className = "",
}) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <div
      className={`grid gap-4 ${gridCols[columns] || gridCols[4]} ${className}`}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id || stat.title || index}
            className="
              rounded-xl
              border
              border-border
              bg-card
              p-5
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {stat.value ?? 0}
                </p>

                {stat.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                )}

                {stat.trend && (
                  <div
                    className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                      stat.trendType === "negative"
                        ? "text-destructive"
                        : "text-green-600"
                    }`}
                  >
                    {stat.trend}
                  </div>
                )}
              </div>

              {Icon && (
                <div
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    ${stat.iconClassName || "bg-primary/10 text-primary"}
                  `}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
