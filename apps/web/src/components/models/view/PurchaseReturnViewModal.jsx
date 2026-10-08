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

const PurchaseReturnViewModal = ({
  open,
  onClose,
  returnData,
}) => {
  if (!open || !returnData) {
    return null;
  }

  const items =
    returnData.items ||
    returnData.returnItems ||
    [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-background shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Purchase Return Details
            </h2>

            <p className="text-sm text-muted-foreground">
              {returnData.returnNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Basic Information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">
              Return Information
            </h3>

            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Return Number"
                value={returnData.returnNumber}
              />

              <InfoItem
                label="Supplier ID"
                value={returnData.supplierId}
              />

              <InfoItem
                label="Purchase ID"
                value={
                  returnData.purchaseId ||
                  "-"
                }
              />

              <InfoItem
                label="Return Date"
                value={formatDate(
                  returnData.returnDate,
                )}
              />

              <InfoItem
                label="Total Amount"
                value={formatCurrency(
                  returnData.totalAmount,
                )}
              />

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                    returnData.status,
                  )}`}
                >
                  {STATUS_LABELS[
                    returnData.status
                  ] ||
                    returnData.status ||
                    "-"}
                </span>
              </div>
            </div>
          </section>

          {/* Items */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Return Items
              </h3>

              <span className="text-xs text-muted-foreground">
                {items.length} item
                {items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Product
                    </th>

                    <th className="px-4 py-3 text-right">
                      Quantity
                    </th>

                    <th className="px-4 py-3 text-right">
                      Rate
                    </th>

                    <th className="px-4 py-3 text-right">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        No return items found.
                      </td>
                    </tr>
                  ) : (
                    items.map(
                      (item, index) => (
                        <tr key={item.id || index}>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs">
                              {item.productId}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right">
                            {item.quantity}
                          </td>

                          <td className="px-4 py-3 text-right">
                            {formatCurrency(
                              item.rate,
                            )}
                          </td>

                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(
                              item.total,
                            )}
                          </td>
                        </tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reason */}
          {returnData.reason && (
            <section>
              <h3 className="mb-3 text-sm font-semibold">
                Reason
              </h3>

              <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                {returnData.reason}
              </div>
            </section>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem
              label="Created At"
              value={
                returnData.createdAt
                  ? new Date(
                      returnData.createdAt,
                    ).toLocaleString("en-IN")
                  : "-"
              }
            />

            <InfoItem
              label="Updated At"
              value={
                returnData.updatedAt
                  ? new Date(
                      returnData.updatedAt,
                    ).toLocaleString("en-IN")
                  : "-"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-muted-foreground">
      {label}
    </p>

    <p className="mt-1 break-all text-sm font-medium">
      {value ?? "-"}
    </p>
  </div>
);

export default PurchaseReturnViewModal;