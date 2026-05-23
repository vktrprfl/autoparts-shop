// src/features/admin/components/AdminMobileHeader.tsx
"use client";

import { Menu } from "lucide-react";
import {useState} from "react";


interface AdminMobileHeaderProps {
    onBurgerClick: () => void;
}

export default function AdminMobileHeader({ onBurgerClick }: AdminMobileHeaderProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (

        <header className="lg:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBurgerClick}
                    className="p-2 hover:bg-zinc-800 rounded-xl transition-colors"
                >
                    <Menu className="w-6 h-6 text-white" />
                </button>
                <div>
                    <h1 className="font-bold text-lg text-white">Admin Panel</h1>
                    <p className="text-xs text-zinc-500 -mt-0.5">AutoPart Pro</p>
                </div>
            </div>
        </header>
    );
}