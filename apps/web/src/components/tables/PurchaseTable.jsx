"use client";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const STATUS_LABELS = {
  DRAFT: "Draft",
  ORDERED: "Ordered",
  PARTIALLY_RECEIVED: "Partially Received",
  RECEIVED: "Received",
  CANCELLED: "Cancelled",
};

const PAYMENT_LABELS = {
  UNPAID: "Unpaid",
  PARTIAL: "Partial",
  PAID: "Paid",
};

const getStatusClass = (status) => {
  switch (status) {
    case "RECEIVED":
      return "bg-green-100 text-green-700";

    case "PARTIALLY_RECEIVED":
      return "bg-yellow-100 text-yellow-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    case "ORDERED":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-muted text-muted-foreground";
  }
};

const PurchaseTable = ({
  purchases = [],
  pagination,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  isDeleting = false,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                Purchase
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Supplier
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Warehouse
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Date
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Grand Total
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Paid
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Due
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Status
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Payment
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {purchases.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No purchases found.
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">
                        {purchase.purchaseNumber}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {purchase.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">
                      {purchase.supplierId}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">
                      {purchase.warehouseId}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {formatDate(purchase.purchaseDate)}
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(purchase.grandTotal)}
                  </td>

                  <td className="px-4 py-3 text-right text-green-600">
                    {formatCurrency(purchase.paidAmount)}
                  </td>

                  <td className="px-4 py-3 text-right text-red-600">
                    {formatCurrency(purchase.dueAmount)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        purchase.status,
                      )}`}
                    >
                      {STATUS_LABELS[purchase.status] ||
                        purchase.status ||
                        "-"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {PAYMENT_LABELS[
                      purchase.paymentStatus
                    ] ||
                      purchase.paymentStatus ||
                      "-"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(purchase)}
                        className="rounded-md px-2 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(purchase)}
                        className="rounded-md px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(purchase)}
                        disabled={isDeleting}
                        className="rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() =>
                onPageChange(pagination.page - 1)
              }
              className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                pagination.page >= pagination.totalPages
              }
              onClick={() =>
                onPageChange(pagination.page + 1)
              }
              className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseTable;