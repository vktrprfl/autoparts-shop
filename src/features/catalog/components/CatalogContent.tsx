// features/catalog/components/CatalogContent.tsx
'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import Navbar from "@/src/features/Navbar/components/Navbar";
import Filters from "@/src/features/catalog/components/Filters";
import ProductCard from "@/src/features/catalog/components/ProductCard";
import ProductCardSkeleton from "@/src/features/catalog/components/ProductCardSkeleton";
import Pagination from "@/src/features/catalog/components/Pagination";

import { useCatalogFilters } from "@/src/hooks/useCatalogFilters";
import { getProductsServer } from "@/features/actions/productActions";
import {useBrands} from "@/features/catalog/hooks/useBrands";
import {Product} from "@/types";

type InitialData = {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
};

export default function CatalogContent({ initialData }: { initialData: InitialData }) {
    const searchParams = useSearchParams();
    const {
        filters,
        handleSearchChange,
        handleFilterChange,
        handleReset,
        changePage,
    } = useCatalogFilters();

    const page = parseInt(searchParams.get("page") || "1");

    // Основной запрос (использует initialData при первой загрузке)
    const { data, isLoading } = useQuery({
        queryKey: ["products", filters, page],
        queryFn: () => getProductsServer({ ...filters, page, limit: 12 }),
        initialData: page === 1 && !filters.search && !filters.brand && !filters.onlyInStock
            ? initialData
            : undefined,
        staleTime: 60_000,
    });

    const { data: brands = [], isLoading: brandsLoading } = useBrands();

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;
    const total = data?.total || 0;

    return (
        <>
            <Navbar onSearchChange={handleSearchChange} searchValue={filters.search} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-80 flex-shrink-0">
                        <Filters
                            filters={filters}
                            setFilters={handleFilterChange}
                            resetFilters={handleReset}
                            brands={brands}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="mb-8 flex justify-between items-center">
                            <h1 className="text-4xl font-bold">Каталог</h1>
                            <p className="text-zinc-400">Найдено: {total} товаров</p>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product:Product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        onPageChange={changePage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}