import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductByID } from "../actions/get-product-by-id.action"
import type { Product } from "@/interfaces/product.interface";
import { createUpdtProductAction } from "../actions/create-update-product.action";

export const useProduct = (id: string) => {

  const queryClient = useQueryClient();

  const query = useQuery({
      queryKey: ['product', {id}],
      queryFn: () => getProductByID(id),
      retry: false,
      staleTime: 1000 * 60 * 5
  });
  
  const mutation = useMutation({
    mutationFn: createUpdtProductAction,
    onSuccess: (product: Product) =>{

      queryClient.invalidateQueries( {queryKey: ['products']} );
      queryClient.invalidateQueries( {queryKey: ['product', {id: product.id}]} );
      queryClient.setQueryData(['products', {id: product.id}], product);
    }
  });
   
  return{
    ...query,
    mutation
  }
}
