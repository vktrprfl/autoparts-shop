"use client";

import Link from "next/link";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 overflow-hidden">
            <div className="max-w-lg w-full text-center">
                {/* Большой 404 с неоновым эффектом */}
                <div className="relative mb-8">
                    <div className="text-[120px] md:text-[160px] font-bold text-zinc-900 tracking-tighter leading-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
                            ОЙ...
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <AlertCircle className="w-16 h-16 text-cyan-500" />
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                    Страница не найдена
                </h1>

                <p className="text-zinc-400 text-lg mb-10 max-w-sm mx-auto">
                    К сожалению, страница, которую вы ищете, не существует или была перемещена.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="group flex items-center justify-center gap-3 bg-white hover:bg-cyan-400 hover:text-black text-black transition-all duration-300 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-cyan-500/20"
                    >
                        <Home size={22} />
                        На главную
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center justify-center gap-3 border border-zinc-700 hover:border-cyan-500 hover:text-cyan-400 text-zinc-300 transition-all duration-300 px-8 py-4 rounded-2xl font-semibold text-lg"
                    >
                        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        Назад
                    </button>
                </div>

                <div className="mt-12 text-zinc-500 text-sm">
                    Если считаете, что это ошибка — напишите нам в поддержку
                </div>
            </div>
        </div>
    );
}