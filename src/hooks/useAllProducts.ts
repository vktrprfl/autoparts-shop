import { useQuery } from "@tanstack/react-query";
import { getAllLightProducts } from "@/features/actions/productActions";
import { Product } from "@/types";

export const useAllProducts = () => {
    return useQuery<Product[]>({
        queryKey: ["allProducts"],           // ← Фиксированный ключ!
        queryFn: getAllLightProducts,
        staleTime: 30 * 60 * 1000,          // 30 минут
        gcTime: 60 * 60 * 1000,             // 1 час
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
};