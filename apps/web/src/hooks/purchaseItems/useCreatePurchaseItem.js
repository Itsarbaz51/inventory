import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import purchaseItemService from "@/services/purchaseItemApi";

export const useCreatePurchaseItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseItemService.create,

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