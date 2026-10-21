import { useQuery } from "@tanstack/react-query";
import purchaseItemService from "@/services/purchaseItemApi";

export const usePurchaseItems = (params = {}) => {
  return useQuery({
    queryKey: ["purchase-items", params],
    queryFn: () => purchaseItemService.getAll(params),
    placeholderData: (previousData) => previousData,
  });
};