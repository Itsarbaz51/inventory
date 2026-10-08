import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import saleService from "@/services/saleApi";

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      saleService.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });

      queryClient.invalidateQueries({
        queryKey: ["sale", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stock-movements"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};