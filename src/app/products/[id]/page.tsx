// app/products/[id]/page.tsx
import { Metadata } from 'next';
import { getProduct } from '@/features/actions/productActions';
import ProductDetailContent from "@/features/catalog/components/productDetail/ProductDetailContent";


type Props = {
    params: Promise<{ id: string }>;   // ← Изменили на Promise
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;       // ← Добавили await

    const product = await getProduct(id);

    const currentUrl = `https://auto-parts-beige.vercel.app/products/${id}`;

    return {
        title: `${product.name} — ${product.brand} ${product.oem} | AutoForge`,
        description: product.description
            ? `${product.description.substring(0, 155)}...`
            : `Купить ${product.name} ${product.brand} по цене ${Number(product.price).toLocaleString('ru-RU')} ₽ с доставкой`,

        keywords: [
            product.name,
            product.brand,
            product.oem,
            'автозапчасти',
            'запчасти',
            `${product.brand} ${product.oem}`
        ],

        alternates: {
            canonical: currentUrl,
        },

        openGraph: {
            title: product.name,
            description: product.description || '',
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;       // ← Добавили await

    const product = await getProduct(id);

    return <ProductDetailContent product={product} />;
}