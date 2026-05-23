// src/features/admin/hooks/useAdminProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductAction, getAdminProducts } from "@/features/admin/actions/adminProductActions";

export function useAdminProducts() {
    const queryClient = useQueryClient();

    const {
        data: products = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["adminProducts"],
        queryFn: getAdminProducts,
        staleTime: 0,
        gcTime: 1000 * 60 * 5,
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const deleteProduct = useMutation({
        mutationFn: deleteProductAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
        },
    });

    return {
        products,
        isLoading,
        deleteProduct: deleteProduct.mutate,
        isDeleting: deleteProduct.isPending,
        error,
        refetch,
    };
}