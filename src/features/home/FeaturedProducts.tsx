import { Suspense } from 'react';
import ProductCard from "@/src/features/catalog/components/ProductCard";
import Link from 'next/link';
import {getFeaturedProducts} from "@/features/actions/productActions";


async function FeaturedProductsContent() {
    const { products } = await getFeaturedProducts();

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex justify-between items-end mb-10">
                <h2 className="text-4xl font-bold">Популярные товары</h2>
                <Link href="/catalog" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-lg">
                    Все товары →
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default function FeaturedProducts() {
    return (
        <Suspense fallback={
            <div className="h-96 bg-zinc-950 flex items-center justify-center">
                <div className="text-zinc-500">Загрузка популярных товаров...</div>
            </div>
        }>
            <FeaturedProductsContent />
        </Suspense>
    );
}