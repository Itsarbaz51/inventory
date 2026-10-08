"use client";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const PurchaseItemTable = ({
  items = [],
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
                Product
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Purchase
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Quantity
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Received
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Pending
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Rate
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Discount
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Tax
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Total
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No purchase items found.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const quantity =
                  Number(item.quantity) || 0;

                const received =
                  Number(item.receivedQuantity) || 0;

                const pending = Math.max(
                  0,
                  quantity - received,
                );

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-mono text-xs">
                          {item.productId}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Product
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">
                        {item.purchaseId}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-medium">
                      {quantity}
                    </td>

                    <td className="px-4 py-3 text-right text-green-600">
                      {received}
                    </td>

                    <td className="px-4 py-3 text-right text-orange-600">
                      {pending}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {formatCurrency(item.rate)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {formatCurrency(item.discount)}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {Number(
                        item.taxRate || 0,
                      )}
                      %
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(item.total)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="rounded-md px-2 py-1.5 text-xs hover:bg-muted"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-md px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => onDelete(item)}
                          className="rounded-md px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
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

export default PurchaseItemTable;