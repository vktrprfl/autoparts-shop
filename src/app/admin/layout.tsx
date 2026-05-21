// app/admin/layout.tsx
import { redirect } from "next/navigation";
import AdminMobileHeader from "@/features/admin/components/AdminMobileHeader";
import AdminSidebar from "@/features/admin/components/AdminSidebar";
import { createServerClientFn } from "@/lib/supabase/server";
import AdminMobileHeaderWrapper from "@/features/admin/components/AdminMobileSidebarWrapper";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    // const supabase = await createServerClientFn();
    // const { data: { user } } = await supabase.auth.getUser();
    //
    // if (!user) {
    //     redirect("/auth/login");
    // }

    return (
        <div className="flex min-h-screen bg-zinc-950">
            {/* Десктопный сайдбар (только на больших экранах) */}
            <div className="hidden lg:block w-72 border-r border-zinc-800 flex-shrink-0">
                <AdminSidebar />
            </div>

            {/* Основная область */}
            <div className="flex-1 flex flex-col min-w-0 w-full">
                {/* Хедер с бургером (только на мобильных) */}
                <AdminMobileHeaderWrapper/>

                {/* Контент */}
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}