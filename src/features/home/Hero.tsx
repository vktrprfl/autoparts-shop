'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative h-[85vh] flex items-center justify-center bg-zinc-950 overflow-hidden">
            {/* Фон */}
            <div className="absolute inset-0 bg-[radial-gradient(at_center,#27272a_0%,transparent_70%)]" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                    Качественные запчасти<br />
                    <span className="text-cyan-400">с гарантией</span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                    Качественные запчасти для вашего автомобиля по лучшим ценам
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/catalog"
                        className="btn-neon px-10 py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 group"
                    >
                        Перейти в каталог
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/catalog?focus=search"
                        className="px-10 py-4 rounded-2xl border border-zinc-700 hover:border-zinc-500 text-lg font-medium transition-colors"
                    >
                        Найти нужную деталь по OEM
                    </Link>
                </div>
            </div>

        </div>
    );
}