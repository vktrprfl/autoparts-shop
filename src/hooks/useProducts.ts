// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/features/Navbar/hooks/useDebounce";
import { ProductsFilter } from "@/src/types";
import {usePathname, useSearchParams} from "next/navigation";
import {getProducts} from "@/features/actions/productActions";


export const useProducts = (filters: ProductsFilter) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const isCatalogPage = pathname === "/catalog";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6;

    const debouncedSearch = useDebounce(filters.search?.trim() || "", 400);

    return useQuery({
        queryKey: ["products", {
            search: debouncedSearch,
            brand: filters.brand,
            onlyInStock: filters.onlyInStock,
            sort: filters.sort,
            page,
            limit,
        }],

        queryFn: () => getProducts({
        search: debouncedSearch,
        brand: filters.brand,
        onlyInStock: filters.onlyInStock,
        sort: filters.sort,
        page,
        limit,
    }),

        enabled: isCatalogPage && !!debouncedSearch !== undefined
    });
};