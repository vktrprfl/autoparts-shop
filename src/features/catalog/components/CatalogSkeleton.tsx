// features/catalog/components/CatalogSkeleton.tsx
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function CatalogSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                {/* Левая колонка — фильтры */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-zinc-900 rounded-3xl p-6">
                        <div className="h-8 bg-zinc-800 rounded-xl mb-6 animate-pulse" />
                        <div className="space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-10 bg-zinc-800 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Правая колонка — товары */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <div className="h-10 w-64 bg-zinc-800 rounded-2xl animate-pulse" />
                        <div className="h-6 w-32 bg-zinc-800 rounded-xl animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}