import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import purchaseItemService from "@/services/purchaseItemApi";

export const useDeletePurchaseItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseItemService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-items"],
      });

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