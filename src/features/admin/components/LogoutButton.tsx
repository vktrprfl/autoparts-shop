"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();

        await supabase.auth.signOut({ scope: 'global' });

        // Жёсткая очистка
        document.cookie = "sb-htfngurhtimmmdqhsdsm-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        toast.success("Вы вышли из аккаунта");
        router.push("/");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-400 hover:text-red-500 transition-colors flex items-center gap-2"
        >
            Выйти
        </button>
    );
}