import { useQuery } from "@tanstack/react-query";
import purchaseService from "@/services/purchaseApi";

export const usePurchase = (id) => {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: () => purchaseService.getById(id),
    enabled: !!id,
  });
};