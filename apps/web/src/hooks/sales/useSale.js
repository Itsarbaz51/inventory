import { useQuery } from "@tanstack/react-query";

import saleService from "@/services/saleApi";

export const useSale = (id) => {
  return useQuery({
    queryKey: ["sale", id],

    queryFn: () => saleService.getById(id),

    enabled: !!id,
  });
};