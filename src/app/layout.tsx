import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/src/common/components/Footer";
import {startMagicTokenCleanup} from "@/lib/cron/clean-magic-tokens";
import { SpeedInsights } from '@vercel/speed-insights/next';
import ModalsProvider from "@/components/ModalsProvider";


export const metadata: Metadata = {
    metadataBase: new URL('https://auto-parts-beige.vercel.app'),
    title: 'AutoForge — Автозапчасти с доставкой',
    description: 'Большой выбор автозапчастей для иномарок и отечественных автомобилей.',

    alternates: {
        canonical: 'https://auto-parts-beige.vercel.app',
    },
    keywords: ['автозапчасти', 'запчасти для авто', 'купить автозапчасти', 'автозапчасти онлайн', 'оригинальные запчасти'],
    authors: [{ name: 'AutoForge' }],
    icons: {
        icon: [
            '/icon-512.png',
            '/icon-192.png',
            '/icon-32.png',
            '/icon-16.png',
        ],
        apple: '/apple-touch-icon.png',
        shortcut: '/icon-16.png',
    },
    openGraph: {
        title: 'AutoForge — Автозапчасти с доставкой',
        description: 'Качественные автозапчасти по лучшим ценам с быстрой доставкой',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'AutoForge — Автозапчасти',
            },
        ],
        type: 'website',
        locale: 'ru_RU',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AutoForge — Автозапчасти с доставкой',
        description: 'Качественные автозапчасти по лучшим ценам',
    },

};

export default function RootLayout({
                                       children,}: {
    children: React.ReactNode;
}) {

    if (typeof window === "undefined") {
        startMagicTokenCleanup();
    }


    return (
        <html lang="ru" className="dark">
        <body className="bg-background text-foreground antialiased min-h-screen">
        <Providers>

            {children}
            <ModalsProvider />

            <SpeedInsights />
            <Footer />
        </Providers>
        </body>
        </html>
    );
}