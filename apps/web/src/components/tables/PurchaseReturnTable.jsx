"use client";

const STATUS_LABELS = {
  DRAFT: "Draft",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
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

const statusClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const PurchaseReturnTable = ({
  returns = [],
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
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                Return
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Supplier
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Purchase
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Date
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Items
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Amount
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Status
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {returns.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No purchase returns found.
                </td>
              </tr>
            ) : (
              returns.map((returnData) => {
                const items =
                  returnData.items ||
                  returnData.returnItems ||
                  [];

                return (
                  <tr
                    key={returnData.id}
                    className="hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {
                            returnData.returnNumber
                          }
                        </p>

                        <p className="font-mono text-xs text-muted-foreground">
                          {returnData.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">
                        {
                          returnData.supplierId
                        }
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">
                        {returnData.purchaseId ||
                          "-"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(
                        returnData.returnDate,
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {items.length}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(
                        returnData.totalAmount,
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                          returnData.status,
                        )}`}
                      >
                        {STATUS_LABELS[
                          returnData.status
                        ] ||
                          returnData.status ||
                          "-"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            onView(returnData)
                          }
                          className="rounded-md px-2 py-1.5 text-xs font-medium hover:bg-muted"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(returnData)
                          }
                          className="rounded-md px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() =>
                            onDelete(returnData)
                          }
                          className="rounded-md px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
                className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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

export default PurchaseReturnTable;