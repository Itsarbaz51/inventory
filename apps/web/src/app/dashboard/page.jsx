"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          Welcome to your inventory dashboard.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">0</h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Stock</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">0</h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">₹0.00</h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Purchases</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">₹0.00</h2>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Sales
          </h2>

          <p className="mt-4 text-sm text-muted-foreground">
            No recent sales available.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Low Stock</h2>

          <p className="mt-4 text-sm text-muted-foreground">
            No low-stock products.
          </p>
        </div>
      </div>
    </div>
  );
}
