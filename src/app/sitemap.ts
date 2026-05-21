// app/sitemap.ts
import { MetadataRoute } from 'next';
import {getAllLightProducts} from "@/features/actions/productActions";
import {Product} from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://auto-parts-beige.vercel.app';

    const products = await getAllLightProducts();

    const productUrls = products.map((product:Product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));



    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/catalog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...productUrls,

    ];
}