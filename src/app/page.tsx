// app/page.tsx
import { Suspense } from 'react';
import Hero from "@/features/home/Hero";
import FeaturedProducts from "@/features/home/FeaturedProducts";
import BrandsSection from "@/features/home/BrandsSection";




export default function HomePage() {
    return (
        <main className="bg-zinc-950 min-h-screen">
            <Hero />

            <Suspense fallback={<div className="h-96 bg-zinc-950" />}>
                <FeaturedProducts />
            </Suspense>

            <Suspense fallback={<div className="h-64 bg-zinc-950" />}>
                <BrandsSection />
            </Suspense>


        </main>
    );
}