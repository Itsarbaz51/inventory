import { useQuery } from "@tanstack/react-query";

import purchaseReturnService from "@/services/purchaseReturnApi";

export const usePurchaseReturn = (id) => {
  return useQuery({
    queryKey: ["purchase-return", id],

    queryFn: () =>
      purchaseReturnService.getById(id),

    enabled: !!id,
  });
};