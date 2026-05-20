// src/hooks/useCatalogFilters.ts
'use client';

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductsFilter } from "@/src/types";

export function useCatalogFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [filters, setFilters] = useState<ProductsFilter>({
        search: searchParams.get("search") || "",
        brand: searchParams.get("brand") || "",
        onlyInStock: searchParams.get("onlyInStock") === "true",
        sort: (searchParams.get("sort") as any) || "default",
    });

    // Автоматический редирект на /catalog при наличии параметров
    useEffect(() => {
        if (pathname === "/" && (searchParams.toString() || filters.search)) {
            router.replace(`/catalog?${searchParams.toString()}`);
        }
    }, [pathname, searchParams, router, filters.search]);

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

    const changePage = useCallback((page: number) => {
        const query = createQueryString({ page: page.toString() });
        router.push(`/catalog?${query}`, { scroll: false });
    }, [router, createQueryString]);

    const handleSearchChange = useCallback((search: string) => {
        setFilters(prev => ({ ...prev, search }));

        const query = createQueryString({
            search: search.trim() || null,
            page: "1",
        });
        router.push(`/catalog?${query}`, { scroll: false });
    }, [router, createQueryString]);

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

    const handleReset = useCallback(() => {
        setFilters({
            search: "",
            brand: "",
            onlyInStock: false,
            sort: "default",
        });
        router.push('/catalog', { scroll: false });
    }, [router]);

    return {
        filters,
        setFilters,
        changePage,
        handleSearchChange,
        handleFilterChange,
        handleReset,
    };
}