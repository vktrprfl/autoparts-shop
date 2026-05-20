// app/catalog/page.tsx
import { Suspense } from 'react';

import { getProductsServer } from '@/features/actions/productActions';
import CatalogSkeleton from "@/features/catalog/components/CatalogSkeleton";
import CatalogContent from "@/features/catalog/components/CatalogContent";

export default async function CatalogPage() {
    return (
        <Suspense fallback={<CatalogSkeleton />}>
            <CatalogContent  />
        </Suspense>
    );
}