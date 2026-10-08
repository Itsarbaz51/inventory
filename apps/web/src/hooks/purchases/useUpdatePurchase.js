import { useMutation, useQueryClient } from "@tanstack/react-query";
import purchaseService from "@/services/purchaseApi";

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      purchaseService.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: ["purchase", variables.id],
      });
    },
  });
};