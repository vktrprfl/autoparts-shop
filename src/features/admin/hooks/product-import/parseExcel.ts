import * as XLSX from "xlsx";
import { z } from "zod";
import { ImportProduct, ImportResult } from "./types";

const ProductSchema = z.object({
    name: z.string().min(1, "Название обязательно").transform(v => String(v).trim()),
    oem: z.string().min(3, "OEM обязателен").transform(v => String(v).trim().toUpperCase()),
    brand: z.string().min(1, "Бренд обязателен").transform(v => String(v).trim()),

    price: z.union([z.number(), z.string()])
        .transform(v => Number(v) || 0)
        .default(0),

    stock: z.union([z.number(), z.string()]).transform(v => Number(v) || 0).default(0),
    category: z.string().default("Разное"),
    description: z.string().optional().default(""),
    applicability: z.array(z.string()).default([]),
    crossNumbers: z.string().default(""),
    specifications: z.record(z.string(), z.any()).default({}),
}).passthrough();

function generateSearchText(product: any): string {
    const parts = [
        product.name,
        product.oem,
        product.brand,
        ...(product.crossNumbers ? String(product.crossNumbers).split(/[;,|]/).map((s: string) => s.trim()) : [])
    ].filter(Boolean);
    return parts.join(" | ");
}

function getColumnMap(headers: any[]): Record<string, number> {
    const map: Record<string, number> = {};
    const texts = headers.map(h => String(h || '').toLowerCase().trim());

    const rules: [string, string[]][] = [
        ['oem', ['oem', 'артикул', 'код']],
        ['name', ['название', 'наименование']],
        ['brand', ['бренд', 'brand', 'производитель']],
        ['price', ['цена', 'price']],
        ['stock', ['остаток', 'stock']],
        ['category', ['категория']],
        ['description', ['описание']],
        ['applicability', ['применяемость']],
        ['analogs', ['аналоги', 'cross']],
        ['specifications', ['характеристики', 'specifications', 'specs', 'spec', 'параметры']],
    ];

    for (const [key, keywords] of rules) {
        for (let i = 0; i < texts.length; i++) {
            if (keywords.some(k => texts[i].includes(k))) {
                map[key] = i;
                break;
            }
        }
    }
    return map;
}

function parseSpecifications(raw: any): Record<string, any> {
    if (!raw) return {};

    if (typeof raw === 'object' && !Array.isArray(raw)) return raw;

    const str = String(raw).trim();
    if (!str) return {};

    // JSON
    if (str.startsWith('{') && str.endsWith('}')) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.warn("Не удалось распарсить JSON specifications:", str);
        }
    }

    // Ключ: Значение
    const specs: Record<string, string> = {};
    const pairs = str.split(';').map(p => p.trim()).filter(Boolean);

    for (const pair of pairs) {
        const colonIndex = pair.indexOf(':');
        if (colonIndex > 0) {
            const key = pair.substring(0, colonIndex).trim();
            const value = pair.substring(colonIndex + 1).trim();
            if (key) specs[key] = value;
        } else if (pair.includes('=')) {
            const [key, value] = pair.split('=').map(s => s.trim());
            if (key) specs[key] = value || '';
        }
    }

    return specs;
}

export async function parseExcelFile(
    excelFile: File,
    existingOems: string[] = []
): Promise<ImportResult> {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });

                const toAdd: ImportProduct[] = [];
                const toUpdate: ImportProduct[] = [];
                const errors: string[] = [];
                let processed = 0;

                const existingOemSet = new Set(existingOems.map(o => String(o).trim().toUpperCase()));

                workbook.SheetNames.forEach(sheetName => {
                    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        defval: "",
                        header: 1,
                        raw: false
                    }) as any[][];

                    if (sheetData.length < 2) return;

                    const headers = sheetData[0];
                    const colMap = getColumnMap(headers);
                    const dataRows = sheetData.slice(1);

                    dataRows.forEach((row, rowIdx) => {
                        if (!row || row.length === 0 || row.every(c => c == null || String(c).trim() === '')) return;

                        processed++;

                        // === Извлечение данных с fallback ===
                        const oemRaw = colMap.oem !== undefined ? String(row[colMap.oem] || '') : String(row[0] || '');
                        const nameRaw = colMap.name !== undefined ? String(row[colMap.name] || '') : String(row[1] || '');
                        const brandRaw = colMap.brand !== undefined ? String(row[colMap.brand] || '') : String(row[2] || '');
                        const priceRaw = colMap.price !== undefined ? String(row[colMap.price] || '') : String(row[3] || '');
                        const stockRaw = colMap.stock !== undefined ? String(row[colMap.stock] || '') : String(row[4] || '');
                        const categoryRaw = colMap.category !== undefined ? String(row[colMap.category] || '') : String(row[5] || 'Разное');
                        const descriptionRaw = colMap.description !== undefined ? String(row[colMap.description] || '') : String(row[6] || '');
                        const applicabilityRaw = colMap.applicability !== undefined ? String(row[colMap.applicability] || '') : String(row[7] || row[8] || '');
                        const analogsRaw = colMap.analogs !== undefined ? String(row[colMap.analogs] || '') : String(row[8] || row[9] || '');
                        const specificationsRaw = colMap.specifications !== undefined
                            ? row[colMap.specifications]
                            : row[10] || row[11] || ''; // увеличил fallback

                        const oem = oemRaw.trim().toUpperCase();
                        if (!oem || oem.length < 3) return;

                        const productBase = {
                            name: nameRaw.trim(),
                            oem,
                            brand: brandRaw.trim() || "Без бренда",
                            price: Number(priceRaw) || 0,
                            stock: Number(stockRaw) || 0,
                            category: categoryRaw.trim(),
                            description: descriptionRaw.trim() || undefined,
                            applicability: applicabilityRaw.split(/[;,|]/).map(s => s.trim()).filter(Boolean),
                            crossNumbers: analogsRaw.split(/[;,|]/)
                                .map(s => s.trim().toUpperCase())
                                .filter(s => s && s !== oem)
                                .join(';'),
                            images: [],
                            specifications: parseSpecifications(specificationsRaw),
                        };

                        const searchText = generateSearchText(productBase);
                        const finalProduct: ImportProduct = { ...productBase, searchText };

                        if (existingOemSet.has(oem)) {
                            toUpdate.push(finalProduct);
                        } else {
                            toAdd.push(finalProduct);
                        }
                    });
                });

                resolve({
                    toAdd,
                    toUpdate,
                    errors,
                    stats: {
                        total: processed,
                        new: toAdd.length,
                        updates: toUpdate.length,
                        errors: errors.length,
                    },
                });
            } catch (err) {
                console.error("Ошибка парсинга Excel:", err);
                resolve({
                    toAdd: [],
                    toUpdate: [],
                    errors: ["Ошибка чтения файла"],
                    stats: { total: 0, new: 0, updates: 0, errors: 1 }
                });
            }
        };

        reader.readAsArrayBuffer(excelFile);
    });
}