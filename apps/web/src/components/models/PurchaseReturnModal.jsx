"use client";

import PurchaseReturnForm from "../forms/PurchaseReturnForm";

const PurchaseReturnModal = ({
  open,
  onClose,
  returnData = null,
  onSubmit,
  isLoading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-background shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              {returnData
                ? "Edit Purchase Return"
                : "Create Purchase Return"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {returnData
                ? "Update purchase return details"
                : "Create a new purchase return"}
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
          <PurchaseReturnForm
            returnData={returnData}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturnModal;