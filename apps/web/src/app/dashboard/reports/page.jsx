"use client";

import { useState } from "react";
import { BarChart3, CalendarDays, RefreshCw, ShoppingBag, ShoppingCart, Wallet, Undo2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import EmptyState from "@/components/ui/EmptyState";
import InputField from "@/components/ui/InputField";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import StatsCards from "@/components/ui/StatsCards";
import { reportsApi } from "@/services/inventoryApi";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function ReportSection({ title, icon: Icon, rows }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={18} className="text-primary" />
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0 last:pb-0">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-semibold text-foreground">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const query = useQuery({
    queryKey: ["reports", fromDate, toDate],
    queryFn: () => reportsApi.getSummary({ ...(fromDate ? { fromDate } : {}), ...(toDate ? { toDate } : {}) }),
    staleTime: 30_000,
  });

  const report = query.data?.data;

  if (query.isLoading) return <LoadingState message="Loading reports..." />;
  if (query.isError || !report) return <EmptyState icon={BarChart3} title="Reports unavailable" description={query.error?.response?.data?.message || "Unable to load report data."} />;

  const stats = [
    { id: "sales", title: "Sales", value: money(report.sales.total), description: `${report.sales.count} invoices`, icon: ShoppingCart },
    { id: "purchases", title: "Purchases", value: money(report.purchases.total), description: `${report.purchases.count} purchases`, icon: ShoppingBag, iconClassName: "bg-orange-500/10 text-orange-600" },
    { id: "payments", title: "Payments", value: money(report.payments.total), description: `${report.payments.count} transactions`, icon: Wallet, iconClassName: "bg-green-500/10 text-green-600" },
    { id: "returns", title: "Returns", value: money(report.returns.salesTotal + report.returns.purchasesTotal), description: `${report.returns.salesCount + report.returns.purchasesCount} returns`, icon: Undo2, iconClassName: "bg-red-500/10 text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={BarChart3} title="Reports" description="Review sales, purchase and payment performance" secondaryAction={{ label: "Refresh", icon: <RefreshCw size={16} className={query.isFetching ? "animate-spin" : ""} />, onClick: query.refetch, disabled: query.isFetching }} />

      <div className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2">
        <InputField label="From date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} leftIcon={<CalendarDays size={17} />} />
        <InputField label="To date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} leftIcon={<CalendarDays size={17} />} />
      </div>

      <StatsCards stats={stats} columns={4} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection title="Sales summary" icon={ShoppingCart} rows={[{ label: "Collected", value: money(report.sales.paid) }, { label: "Outstanding", value: money(report.sales.due) }, { label: "Invoices", value: report.sales.count }]} />
        <ReportSection title="Purchase summary" icon={ShoppingBag} rows={[{ label: "Paid", value: money(report.purchases.paid) }, { label: "Outstanding", value: money(report.purchases.due) }, { label: "Purchases", value: report.purchases.count }]} />
        <ReportSection title="Payment summary" icon={Wallet} rows={[{ label: "Total transactions", value: report.payments.count }, { label: "Total amount", value: money(report.payments.total) }]} />
        <ReportSection title="Return summary" icon={Undo2} rows={[{ label: "Sales returns", value: `${report.returns.salesCount} · ${money(report.returns.salesTotal)}` }, { label: "Purchase returns", value: `${report.returns.purchasesCount} · ${money(report.returns.purchasesTotal)}` }]} />
      </div>
    </div>
  );
}
