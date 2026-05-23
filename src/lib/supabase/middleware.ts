// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll(); },
                setAll() {}, // не меняем cookies здесь
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

    // Если идёт в админку
    if (isAdminPath) {
        if (!session) {
            // Не залогинен → на главную с открытием модалки
            return NextResponse.redirect(new URL('/?openLogin=true', request.url));
        }
        // Если залогинен — пропускаем дальше (проверку роли сделаем в layout)
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};