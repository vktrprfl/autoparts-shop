// app/page.tsx
import { Suspense } from 'react';
import Hero from "@/src/features/home/Hero";           // ← создадим
import FeaturedProducts from "@/src/features/home/FeaturedProducts"; // ← создадим
import BrandsSection from "@/src/features/home/BrandsSection";     // ← создадим


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