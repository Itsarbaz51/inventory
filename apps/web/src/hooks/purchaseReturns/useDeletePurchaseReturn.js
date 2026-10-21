import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import purchaseReturnService from "@/services/purchaseReturnApi";

export const useDeletePurchaseReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseReturnService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-returns"],
      });

      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: ["purchase-items"],
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