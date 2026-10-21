import { useQuery } from "@tanstack/react-query";

import saleService from "@/services/saleApi";

export const useSales = (params = {}) => {
  return useQuery({
    queryKey: ["sales", params],

    queryFn: () =>
      saleService.getAll(params),

    placeholderData: (previousData) =>
      previousData,
  });
};