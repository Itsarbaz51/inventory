import { useQuery } from "@tanstack/react-query";

import purchaseReturnService from "@/services/purchaseReturnApi";

export const usePurchaseReturns = (params = {}) => {
  return useQuery({
    queryKey: ["purchase-returns", params],

    queryFn: () =>
      purchaseReturnService.getAll(params),

    placeholderData: (previousData) =>
      previousData,
  });
};