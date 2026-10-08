import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import purchaseItemService from "@/services/purchaseItemApi";

export const useUpdatePurchaseItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      purchaseItemService.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-items"],
      });

      queryClient.invalidateQueries({
        queryKey: ["purchase-item", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });
    },
  });
};