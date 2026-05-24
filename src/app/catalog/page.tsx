
import { Suspense } from 'react';


import CatalogSkeleton from "@/features/catalog/components/CatalogSkeleton";
import CatalogContent from "@/features/catalog/components/CatalogContent";

export const metadata = {
    title: 'Каталог автозапчастей — AutoForge',
    description: 'Большой выбор автозапчастей для иномарок и отечественных авто. Фильтры, поиск по OEM и кросс-номерам.',
    keywords: ['каталог автозапчастей', 'купить запчасти онлайн', 'автозапчасти с доставкой'],
    alternates: {
        canonical: 'https://auto-parts-beige.vercel.app/catalog',
    },
};

export default async function CatalogPage() {
    return (
        <Suspense fallback={<CatalogSkeleton />}>
            <CatalogContent  />
        </Suspense>
    );
}