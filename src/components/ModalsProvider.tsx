"use client";



import CartModal from "@/features/Navbar/components/cart/CartModal";
import {useCartStore} from "@/store/useCartStore";

export default function ModalsProvider() {
    const isCartOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);

    return (
        <>
            <CartModal
                isOpen={isCartOpen}
                onClose={closeCart}
            />


            {/* Сюда можно будет добавлять другие модалки позже */}
        </>
    );
}