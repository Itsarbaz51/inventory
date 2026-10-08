import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import purchaseReturnService from "@/services/purchaseReturnApi";

export const useUpdatePurchaseReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      purchaseReturnService.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-returns"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "purchase-return",
          variables.id,
        ],
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