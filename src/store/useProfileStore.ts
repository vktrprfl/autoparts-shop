import { create } from "zustand";
import { getUserOrders } from "@/features/actions/orderActions";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useCartStore } from "@/src/store/useCartStore";
import { toast } from "react-hot-toast";

interface ProfileStore {
    orders: any[];
    isLoading: boolean;

    loadOrders: () => Promise<void>;

    repeatOrder: (orderId: string) => Promise<boolean>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
    orders: [],
    isLoading: false,

    loadOrders: async () => {
        set({ isLoading: true });
        const { user } = useAuthStore.getState();

        if (!user?.id) {
            set({ orders: [], isLoading: false });
            return;
        }

        try {
            const orders = await getUserOrders();
            set({ orders });
        } catch (err) {
            console.error("Ошибка загрузки заказов:", err);
        } finally {
            set({ isLoading: false });
        }
    },

    repeatOrder: async (orderId: string) => {
        const order = get().orders.find(o => o.id === orderId);

        if (!order?.items?.length) {
            toast.error("В заказе нет товаров");
            return false;
        }

        try {
            const { addItem, openCart } = useCartStore.getState();

            let addedCount = 0;
            let unavailableCount = 0;
            const unavailableNames: string[] = [];

            order.items.forEach((item: any) => {
                const productName = item.name || item.product?.name || "Товар";
                const productOem = item.oem || item.product?.oem || "";
                const productStock = item.stock ?? item.product?.stock ?? 0;
                const productActive = item.active ?? item.product?.active ?? true;
                const productImage = item.image || item.product?.images?.[0] || "";

                const isAvailable = productActive === true && productStock > 0;

                if (isAvailable) {
                    addItem({
                        id: item.id || item.productId,
                        name: productName,
                        oem: productOem,
                        price: Number(item.price),
                        image: productImage,
                        stock: productStock,
                    });
                    addedCount++;
                } else {
                    unavailableCount++;
                    unavailableNames.push(productName);
                }
            });

            // Результаты
            if (addedCount > 0) {
                toast.success(`Добавлено ${addedCount} товар${addedCount > 1 ? 'ов' : ''} в корзину`);
                openCart();
            }

            if (unavailableCount > 0) {
                toast.error(
                    `${unavailableCount} товар${unavailableCount > 1 ? 'ов' : ''} сейчас недоступен`,
                );
            }

            if (addedCount === 0) {
                toast.error("К сожалению, все товары из этого заказа сейчас недоступны");
            }

            return addedCount > 0;

        } catch (err) {
            console.error("Ошибка repeatOrder:", err);
            toast.error("Не удалось повторить заказ");
            return false;
        }
    },
}));