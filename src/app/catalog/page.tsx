// app/catalog/page.tsx
import { Suspense } from 'react';
import CatalogContent from '@/features/catalog/components/CatalogContent';
import { getProductsServer } from '@/features/actions/productActions';
import CatalogSkeleton from "@/features/catalog/components/CatalogSkeleton";

export default async function CatalogPage() {
    // Загружаем только первую страницу на сервере
    const initialData = await getProductsServer({
        page: 1,
        limit: 12,
    });

    return (
        <Suspense fallback={<CatalogSkeleton />}>
            <CatalogContent initialData={initialData} />
        </Suspense>
    );
}