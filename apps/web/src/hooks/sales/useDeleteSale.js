import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import saleService from "@/services/saleApi";

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saleService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
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