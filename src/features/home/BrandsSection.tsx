import { getBrands } from "@/features/actions/productActions";
import Link from "next/link";

async function BrandsContent() {
    const brands = await getBrands();

    return (
        <div className="bg-zinc-900 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Популярные бренды</h2>

                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                    {brands.slice(0, 24).map((brand: string) => (
                        <div
                            key={brand}
                            className="bg-zinc-950 border border-zinc-800 hover:border-cyan-500/30 rounded-2xl py-6 text-center font-medium transition-all hover:scale-105"
                        >
                            {brand}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href="/catalog" className="text-cyan-400 hover:underline">
                        Все бренды →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default async function BrandsSection() {
    return <BrandsContent />;
}