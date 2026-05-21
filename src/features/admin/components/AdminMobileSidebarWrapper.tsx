"use client";

import { useState } from "react";
import AdminMobileHeader from "./AdminMobileHeader";
import AdminSidebar from "./AdminSidebar";

export default function AdminMobileHeaderWrapper() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            {/* Мобильный хедер с бургером */}
            <AdminMobileHeader
                onBurgerClick={() => setSidebarOpen(true)}
            />

            {/* Мобильный сайдбар */}
            <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 transition-transform duration-300`}>
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Затемнение */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}