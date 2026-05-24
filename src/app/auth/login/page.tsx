import { Suspense } from 'react';
import LoginAdminForm from "@/features/admin/components/LoginAdminForm";



export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-white">Загрузка...</div>
            </div>
        }>
            <LoginAdminForm />
        </Suspense>
    );
}