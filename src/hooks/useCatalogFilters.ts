// src/hooks/useCatalogFilters.ts
'use client';

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductsFilter } from "@/src/types";
import { useDebounce } from "@/features/Navbar/hooks/useDebounce";

export function useCatalogFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [rawSearch, setRawSearch] = useState(searchParams.get("search") || "");
    const debouncedSearch = useDebounce(rawSearch, 5);

    // Основное состояние фильтров (синхронизируем с URL)
    const [filters, setFilters] = useState<ProductsFilter>({
        search: searchParams.get("search") || "",
        brand: searchParams.get("brand") || "",
        onlyInStock: searchParams.get("onlyInStock") === "true",
        sort: (searchParams.get("sort") as any) || "default",
    });

    // Синхронизация при изменении URL (важно для пагинации!)
    useEffect(() => {
        setFilters({
            search: searchParams.get("search") || "",
            brand: searchParams.get("brand") || "",
            onlyInStock: searchParams.get("onlyInStock") === "true",
            sort: (searchParams.get("sort") as any) || "default",
        });
        setRawSearch(searchParams.get("search") || "");
    }, [searchParams]);

    const createQueryString = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value == null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        return params.toString();
    }, [searchParams]);

    const handleSearchChange = useCallback((search: string) => {
        setRawSearch(search);
    }, []);

    const handleFilterChange = useCallback((newFilters: Partial<ProductsFilter>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));

        const updates: Record<string, string | null> = { page: "1" };
        Object.entries(newFilters).forEach(([key, value]) => {
            updates[key] = (value === false || value === "" || value == null)
                ? null
                : String(value);
        });

        const query = createQueryString(updates);
        router.push(`/catalog?${query}`, { scroll: false });
    }, [router, createQueryString]);

    const changePage = useCallback((page: number) => {
        const query = createQueryString({ page: page.toString() });
        router.push(`/catalog?${query}`, { scroll: false });
    }, [router, createQueryString]);

    const handleReset = useCallback(() => {
        setRawSearch("");
        setFilters({
            search: "",
            brand: "",
            onlyInStock: false,
            sort: "default",
        });
        router.push('/catalog', { scroll: false });
    }, [router]);

    return {
        filters: { ...filters, search: debouncedSearch }, // используем debouncedSearch
        setFilters,
        changePage,
        handleSearchChange,
        handleFilterChange,
        handleReset,
    };
}