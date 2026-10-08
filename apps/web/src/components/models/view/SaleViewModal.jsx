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

const SaleViewModal = ({
  open,
  onClose,
  sale,
}) => {
  if (!open || !sale) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-background shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Sale Details
            </h2>

            <p className="text-sm text-muted-foreground">
              {sale.invoiceNumber}
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
          {/* Sale Information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">
              Sale Information
            </h3>

            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Invoice Number"
                value={sale.invoiceNumber}
              />

              <InfoItem
                label="Customer ID"
                value={
                  sale.customerId || "-"
                }
              />

              <InfoItem
                label="Warehouse ID"
                value={sale.warehouseId}
              />

              <InfoItem
                label="Sale Date"
                value={formatDate(
                  sale.saleDate,
                )}
              />

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                    sale.status,
                  )}`}
                >
                  {STATUS_LABELS[
                    sale.status
                  ] ||
                    sale.status ||
                    "-"}
                </span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Payment Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentClass(
                    sale.paymentStatus,
                  )}`}
                >
                  {PAYMENT_STATUS_LABELS[
                    sale.paymentStatus
                  ] ||
                    sale.paymentStatus ||
                    "-"}
                </span>
              </div>
            </div>
          </section>

          {/* Amount Details */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">
              Amount Details
            </h3>

            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-3 lg:grid-cols-4">
              <InfoItem
                label="Subtotal"
                value={formatCurrency(
                  sale.subtotal,
                )}
              />

              <InfoItem
                label="Discount"
                value={formatCurrency(
                  sale.discount,
                )}
              />

              <InfoItem
                label="Tax Amount"
                value={formatCurrency(
                  sale.taxAmount,
                )}
              />

              <InfoItem
                label="Shipping"
                value={formatCurrency(
                  sale.shippingCost,
                )}
              />

              <InfoItem
                label="Grand Total"
                value={formatCurrency(
                  sale.grandTotal,
                )}
              />

              <InfoItem
                label="Paid Amount"
                value={formatCurrency(
                  sale.paidAmount,
                )}
              />

              <InfoItem
                label="Due Amount"
                value={formatCurrency(
                  sale.dueAmount,
                )}
              />
            </div>
          </section>

          {/* Notes */}
          {sale.notes && (
            <section>
              <h3 className="mb-3 text-sm font-semibold">
                Notes
              </h3>

              <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                {sale.notes}
              </div>
            </section>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem
              label="Created At"
              value={
                sale.createdAt
                  ? new Date(
                      sale.createdAt,
                    ).toLocaleString("en-IN")
                  : "-"
              }
            />

            <InfoItem
              label="Updated At"
              value={
                sale.updatedAt
                  ? new Date(
                      sale.updatedAt,
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

export default SaleViewModal;