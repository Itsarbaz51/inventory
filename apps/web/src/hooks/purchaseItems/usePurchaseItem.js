import { useQuery } from "@tanstack/react-query";
import purchaseItemService from "@/services/purchaseItemApi";

export const usePurchaseItem = (id) => {
  return useQuery({
    queryKey: ["purchase-item", id],
    queryFn: () => purchaseItemService.getById(id),
    enabled: !!id,
  });
};