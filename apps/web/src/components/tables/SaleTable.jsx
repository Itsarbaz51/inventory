"use client";

const STATUS_LABELS = {
  DRAFT: "Draft",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const PAYMENT_STATUS_LABELS = {
  UNPAID: "Unpaid",
  PARTIAL: "Partial",
  PAID: "Paid",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-muted text-muted-foreground";
  }
};

const getPaymentClass = (status) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";

    case "PARTIAL":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-red-100 text-red-700";
  }
};

const SaleTable = ({
  sales = [],
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
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                Invoice
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Customer
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
            {sales.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No sales found.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">
                        {sale.invoiceNumber}
                      </p>

                      <p className="font-mono text-xs text-muted-foreground">
                        {sale.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">
                      {sale.customerId ||
                        "Walk-in"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">
                      {sale.warehouseId}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {formatDate(
                      sale.saleDate,
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(
                      sale.grandTotal,
                    )}
                  </td>

                  <td className="px-4 py-3 text-right text-green-600">
                    {formatCurrency(
                      sale.paidAmount,
                    )}
                  </td>

                  <td className="px-4 py-3 text-right text-red-600">
                    {formatCurrency(
                      sale.dueAmount,
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        sale.status,
                      )}`}
                    >
                      {STATUS_LABELS[
                        sale.status
                      ] ||
                        sale.status ||
                        "-"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentClass(
                        sale.paymentStatus,
                      )}`}
                    >
                      {PAYMENT_STATUS_LABELS[
                        sale.paymentStatus
                      ] ||
                        sale.paymentStatus ||
                        "-"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          onView(sale)
                        }
                        className="rounded-md px-2 py-1.5 text-xs font-medium hover:bg-muted"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(sale)
                        }
                        className="rounded-md px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(sale)
                        }
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
      {pagination &&
        pagination.totalPages > 1 && (
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
                  onPageChange(
                    pagination.page - 1,
                  )
                }
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  pagination.page >=
                  pagination.totalPages
                }
                onClick={() =>
                  onPageChange(
                    pagination.page + 1,
                  )
                }
                className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default SaleTable;