"use server";

import pool from "@/src/lib/db/pg";
import { generateSearchText } from "@/features/admin/utils/generateSearchText";

export async function importProducts(productsInput: any[]) {
    const startTime = Date.now();
    const client = await pool.connect();

    try {
        const preparedMap = new Map<string, any>();

        for (const p of productsInput) {
            const oem = p.oem?.toString().trim().toUpperCase();
            if (!oem || !p.name || !p.brand) continue;

            const crossNumbers: string[] = typeof p.crossNumbers === "string"
                ? p.crossNumbers.split(/[;,|]/).map((s: string) => s.trim().toUpperCase()).filter(Boolean)
                : Array.isArray(p.crossNumbers) ? p.crossNumbers : [];

            const applicability: string[] = Array.isArray(p.applicability)
                ? p.applicability
                : typeof p.applicability === "string"
                    ? p.applicability.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean)
                    : [];

            const specifications = p.specifications
                ? typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications
                : {};

            preparedMap.set(oem, {
                id: crypto.randomUUID(),
                oem,
                name: p.name.toString().trim(),
                brand: p.brand.toString().trim(),
                price: parseFloat(p.price) || 0,
                stock: parseInt(p.stock as string) || 0,
                category: p.category?.toString().trim() || "Разное",
                description: p.description?.toString().trim() || null,
                images: Array.isArray(p.images) ? p.images : [],
                applicability,
                crossNumbers,
                specifications,
                searchText: generateSearchText({ name: p.name, oem, brand: p.brand, crossNumbers }),
            });
        }

        const prepared = Array.from(preparedMap.values());

        if (prepared.length === 0) {
            return { success: true, added: 0, updated: 0, total: 0, duration: 0 };
        }

        const valuesPlaceholders = prepared.map((_, idx) => {
            const base = idx * 14;   // теперь 14 полей
            return `($${base+1}, $${base+2}, $${base+3}, $${base+4}, $${base+5}, 
                     $${base+6}, $${base+7}, $${base+8}, $${base+9}, $${base+10}, 
                     $${base+11}, $${base+12}, $${base+13}, $${base+14})`;
        }).join(", ");

        const flatValues: any[] = [];

        for (const item of prepared) {
            flatValues.push(
                item.id,
                item.oem,
                item.name,
                item.brand,
                item.price,
                item.stock,
                item.category,
                item.description,
                item.images,
                item.applicability,
                item.crossNumbers,
                item.specifications,
                item.searchText,
                new Date()
            );
        }

        const query = `
            INSERT INTO "products" (
                id, oem, name, brand, price, stock, category, description,
                images, applicability, "crossNumbers", specifications, "searchText", "updatedAt"
            )
            VALUES ${valuesPlaceholders}
                ON CONFLICT (oem) DO UPDATE SET
                name = EXCLUDED.name,
                                         brand = EXCLUDED.brand,
                                         price = EXCLUDED.price,
                                         stock = EXCLUDED.stock,
                                         category = EXCLUDED.category,
                                         description = EXCLUDED.description,
                                         images = EXCLUDED.images,
                                         applicability = EXCLUDED.applicability,
                                         "crossNumbers" = EXCLUDED."crossNumbers",
                                         specifications = EXCLUDED.specifications,
                                         "searchText" = EXCLUDED."searchText",
                                         "updatedAt" = NOW()
        `;

        await client.query(query, flatValues);

        const duration = Date.now() - startTime;

        console.log(`🎉 Импорт успешно завершён за ${duration}мс | Товаров: ${prepared.length}`);

        return {
            success: true,
            added: 0,
            updated: prepared.length,
            total: productsInput.length,
            duration,
        };

    } catch (error: any) {
        console.error("Import error:", error);
        return { success: false, error: error.message || "Ошибка импорта" };
    } finally {
        client.release();
    }
}