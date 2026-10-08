import { useMutation, useQueryClient } from "@tanstack/react-query";
import purchaseService from "@/services/purchaseApi";

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stock-movements"],
      });
    },
  });
};