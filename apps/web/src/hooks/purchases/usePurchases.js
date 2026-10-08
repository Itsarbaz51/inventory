import { useQuery } from "@tanstack/react-query";
import purchaseService from "@/services/purchaseApi";

export const usePurchases = (params = {}) => {
  return useQuery({
    queryKey: ["purchases", params],
    queryFn: () => purchaseService.getAll(params),
    placeholderData: (previousData) => previousData,
  });
};