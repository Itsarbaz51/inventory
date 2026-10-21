"use client";

import PurchaseItemForm from "../forms/PurchaseItemForm";

const PurchaseItemModal = ({
  open,
  onClose,
  item = null,
  onSubmit,
  isLoading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-background shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              {item
                ? "Edit Purchase Item"
                : "Add Purchase Item"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {item
                ? "Update purchase item details"
                : "Add a product to a purchase"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <PurchaseItemForm
            item={item}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseItemModal;