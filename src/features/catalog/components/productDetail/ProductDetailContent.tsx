// features/catalog/components/ProductDetailContent.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Product } from '@/types';
import ProductActions from "@/src/features/parts-detail/components/ProductActions";

export default function ProductDetailContent({ product }: { product: Product }) {
    const [activeTab, setActiveTab] = useState<"description" | "applicability">("description");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);   // ← Добавили!

    const images = product.images?.length > 0
        ? product.images
        : ['/images/placeholder.svg'];

    const currentImage = images[currentImageIndex];

    const applicabilityArray = Array.isArray(product.applicability)
        ? product.applicability
        : product.applicability ? [product.applicability] : [];

    return (
        <div className="min-h-screen bg-zinc-950 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

                {/* Кнопка назад */}
                <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-400 mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Назад в каталог
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* Галерея */}
                    <div className="lg:col-span-7">
                        <div className="relative aspect-video bg-zinc-900 rounded-3xl overflow-hidden">
                            <Image
                                src={currentImage}
                                alt={`${product.name} - фото ${currentImageIndex + 1}`}
                                fill
                                className="object-contain p-8"
                                priority
                            />
                        </div>

                        {/* Миниатюры */}
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-6 justify-center">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                            index === currentImageIndex
                                                ? 'border-cyan-400 scale-110'
                                                : 'border-zinc-700 hover:border-zinc-500'
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} - миниатюра ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Правая колонка */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* H1 — главный заголовок */}
                        <div>
                            <p className="uppercase tracking-widest text-sm text-zinc-500">
                                {product.brand} • {product.category}
                            </p>
                            <h1 className="text-4xl font-bold leading-tight mt-2">
                                {product.name}
                            </h1>
                            <p className="text-cyan-400 mt-3">
                                OEM: <span className="text-white font-mono">{product.oem}</span>
                            </p>
                        </div>

                        {/* Цена и наличие */}
                        <div className="flex items-end gap-4">
                            <p className="text-5xl font-bold">
                                {Number(product.price).toLocaleString('ru-RU')} ₽
                            </p>
                            <p className={`text-lg ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? `В наличии • ${product.stock} шт.` : 'Под заказ'}
                            </p>
                        </div>

                        <ProductActions product={product} />

                        {/* Табы */}
                        <div className="mt-10 border-b border-zinc-800 flex">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`px-8 py-4 font-medium transition-all border-b-2 ${
                                    activeTab === "description"
                                        ? "border-cyan-400 text-white"
                                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                Описание
                            </button>
                            <button
                                onClick={() => setActiveTab("applicability")}
                                className={`px-8 py-4 font-medium transition-all border-b-2 ${
                                    activeTab === "applicability"
                                        ? "border-cyan-400 text-white"
                                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                Применяемость
                            </button>
                        </div>

                        <div className="pt-8">
                            {activeTab === "description" && (
                                <div className="prose prose-invert text-zinc-300 leading-relaxed">
                                    {product.description || <p className="text-zinc-500 italic">Описание отсутствует</p>}
                                </div>
                            )}

                            {activeTab === "applicability" && (
                                <div className="flex flex-wrap gap-3">
                                    {applicabilityArray.length > 0 ? (
                                        applicabilityArray.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-zinc-800 border border-zinc-700 px-5 py-3 rounded-2xl text-sm"
                                            >
                                                {item}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-zinc-500 italic">Информация о применяемости отсутствует</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Характеристики — теперь выше, как обычно в магазинах */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="mt-10">
                                <h2 className="uppercase text-xs tracking-widest text-zinc-500 mb-4">Характеристики</h2>
                                <div className="space-y-3 text-sm">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between border-b border-zinc-800 pb-2">
                                            <span className="text-zinc-400">{key}</span>
                                            <span className="text-white text-right">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* JSON-LD для SEO (структурированные данные) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.name,
                        "brand": {
                            "@type": "Brand",
                            "name": product.brand
                        },
                        "sku": product.oem,
                        "image": product.images?.[0] || '',
                        "description": product.description || '',
                        "offers": {
                            "@type": "Offer",
                            "url": `https://auto-parts-beige.vercel.app/products/${product.id}`,
                            "priceCurrency": "RUB",
                            "price": Number(product.price),
                            "availability": product.stock > 0
                                ? "https://schema.org/InStock"
                                : "https://schema.org/OutOfStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "AutoForge"
                            }
                        }
                    })
                }}
            />
        </div>
    );
}