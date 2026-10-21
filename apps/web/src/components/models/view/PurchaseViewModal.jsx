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

const PurchaseViewModal = ({
  open,
  onClose,
  purchase,
}) => {
  if (!open || !purchase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-background shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Purchase Details
            </h2>

            <p className="text-sm text-muted-foreground">
              {purchase.purchaseNumber}
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
          {/* Basic */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">
              Purchase Information
            </h3>

            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Purchase Number"
                value={purchase.purchaseNumber}
              />

              <InfoItem
                label="Supplier ID"
                value={purchase.supplierId}
              />

              <InfoItem
                label="Warehouse ID"
                value={purchase.warehouseId}
              />

              <InfoItem
                label="Purchase Date"
                value={formatDate(purchase.purchaseDate)}
              />

              <InfoItem
                label="Expected Date"
                value={formatDate(purchase.expectedDate)}
              />

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                    purchase.status,
                  )}`}
                >
                  {STATUS_LABELS[purchase.status] ||
                    purchase.status ||
                    "-"}
                </span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Payment Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentClass(
                    purchase.paymentStatus,
                  )}`}
                >
                  {PAYMENT_LABELS[
                    purchase.paymentStatus
                  ] ||
                    purchase.paymentStatus ||
                    "-"}
                </span>
              </div>
            </div>
          </section>

          {/* Amounts */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">
              Amount Details
            </h3>

            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-3 lg:grid-cols-4">
              <InfoItem
                label="Subtotal"
                value={formatCurrency(purchase.subtotal)}
              />

              <InfoItem
                label="Discount"
                value={formatCurrency(purchase.discount)}
              />

              <InfoItem
                label="Tax"
                value={formatCurrency(purchase.taxAmount)}
              />

              <InfoItem
                label="Shipping"
                value={formatCurrency(
                  purchase.shippingCost,
                )}
              />

              <InfoItem
                label="Grand Total"
                value={formatCurrency(
                  purchase.grandTotal,
                )}
              />

              <InfoItem
                label="Paid Amount"
                value={formatCurrency(
                  purchase.paidAmount,
                )}
              />

              <InfoItem
                label="Due Amount"
                value={formatCurrency(
                  purchase.dueAmount,
                )}
              />
            </div>
          </section>

          {/* Notes */}
          {purchase.notes && (
            <section>
              <h3 className="mb-3 text-sm font-semibold">
                Notes
              </h3>

              <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                {purchase.notes}
              </div>
            </section>
          )}

          {/* Dates */}
          <section>
            <div className="grid grid-cols-1 gap-4 text-xs text-muted-foreground sm:grid-cols-2">
              <InfoItem
                label="Created At"
                value={formatDate(purchase.createdAt)}
              />

              <InfoItem
                label="Updated At"
                value={formatDate(purchase.updatedAt)}
              />
            </div>
          </section>
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
      {value || "-"}
    </p>
  </div>
);

export default PurchaseViewModal;