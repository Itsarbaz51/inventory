"use client";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const PurchaseItemViewModal = ({
  open,
  onClose,
  item,
}) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Purchase Item Details
            </h2>

            <p className="text-sm text-muted-foreground">
              {item.id}
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
          {/* References */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">
              References
            </h3>

            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
              <InfoItem
                label="Purchase ID"
                value={item.purchaseId}
              />

              <InfoItem
                label="Product ID"
                value={item.productId}
              />
            </div>
          </section>

          {/* Quantity */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">
              Quantity & Pricing
            </h3>

            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-3">
              <InfoItem
                label="Quantity"
                value={item.quantity}
              />

              <InfoItem
                label="Received Quantity"
                value={item.receivedQuantity}
              />

              <InfoItem
                label="Pending Quantity"
                value={Math.max(
                  0,
                  Number(item.quantity || 0) -
                    Number(item.receivedQuantity || 0),
                )}
              />

              <InfoItem
                label="Rate"
                value={formatCurrency(item.rate)}
              />

              <InfoItem
                label="Discount"
                value={formatCurrency(
                  item.discount,
                )}
              />

              <InfoItem
                label="Tax Rate"
                value={`${Number(
                  item.taxRate || 0,
                )}%`}
              />

              <InfoItem
                label="Tax Amount"
                value={formatCurrency(
                  item.taxAmount,
                )}
              />

              <InfoItem
                label="Total"
                value={formatCurrency(item.total)}
              />
            </div>
          </section>

          {/* Dates */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoItem
              label="Created At"
              value={
                item.createdAt
                  ? new Date(
                      item.createdAt,
                    ).toLocaleString("en-IN")
                  : "-"
              }
            />

            <InfoItem
              label="Updated At"
              value={
                item.updatedAt
                  ? new Date(
                      item.updatedAt,
                    ).toLocaleString("en-IN")
                  : "-"
              }
            />
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
      {value ?? "-"}
    </p>
  </div>
);

export default PurchaseItemViewModal;