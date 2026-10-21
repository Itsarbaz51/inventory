"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import EmptyState from "@/components/ui/EmptyState";
import FilterBar from "@/components/ui/FilterBar";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import StatsCards from "@/components/ui/StatsCards";
import { formatDate } from "@/lib/utils";

function getRows(payload, resourceKey) {
  if (Array.isArray(payload)) return payload;
  return payload?.[resourceKey] || payload?.data?.[resourceKey] || payload?.data || [];
}

function getPagination(payload, page, limit, count) {
  return payload?.pagination || payload?.data?.pagination || {
    page,
    limit,
    total: count,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
}

function displayValue(row, field) {
  const value = field.value ? field.value(row) : row?.[field.key];
  if (value === null || value === undefined || value === "") return "-";
  if (field.type === "date") return formatDate(value);
  if (field.type === "currency") return `₹${Number(value).toLocaleString("en-IN")}`;
  return String(value);
}

export default function ResourceListPage({
  icon: Icon,
  title,
  description,
  queryKey,
  queryFn,
  resourceKey,
  columns,
  searchPlaceholder = "Search...",
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const params = useMemo(() => ({ page, limit, ...(search.trim() ? { search: search.trim() } : {}) }), [page, search]);
  const query = useQuery({ queryKey: [queryKey, params], queryFn: () => queryFn(params), staleTime: 30_000 });
  const payload = query.data?.data ?? query.data;
  const rows = getRows(payload, resourceKey);
  const pagination = getPagination(payload, page, limit, rows.length);
  const total = Number(pagination.total ?? rows.length);
  const totalPages = Number(pagination.totalPages ?? 1);

  const stats = [
    { id: "total", title: `Total ${title}`, value: total, description: "Records in this account", icon: Icon },
    { id: "shown", title: "Showing", value: rows.length, description: "Records on this page", icon: Search, iconClassName: "bg-green-500/10 text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Icon}
        title={title}
        description={description}
        secondaryAction={{ label: "Refresh", icon: <RefreshCw size={16} className={query.isFetching ? "animate-spin" : ""} />, onClick: query.refetch, disabled: query.isFetching }}
      />

      <StatsCards stats={stats} columns={2} />
      <FilterBar
        search={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder={searchPlaceholder}
        onClear={() => { setSearch(""); setPage(1); }}
      />

      {query.isLoading ? <LoadingState message={`Loading ${title.toLowerCase()}...`} /> : !rows.length ? (
        <EmptyState icon={Icon} title={`No ${title.toLowerCase()} found`} description="Records created through the API will appear here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead className="border-b border-border bg-muted/40">
                <tr>{columns.map((column) => <th key={column.label} className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">{column.label}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => <tr key={row.id} className="hover:bg-muted/30">{columns.map((column) => <td key={column.label} className="px-5 py-4 text-sm text-foreground">{displayValue(row, column)}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
          <Pagination page={Number(pagination.page) || page} totalPages={totalPages} total={total} limit={Number(pagination.limit) || limit} onPageChange={setPage} loading={query.isFetching} />
        </div>
      )}
    </div>
  );
}
