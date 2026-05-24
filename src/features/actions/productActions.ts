"use server";

import { prisma } from "@/src/lib/prisma";
import {toPlain} from "@/lib/utils/toPlain";

export async function getBrands() {
    const brands = await prisma.product.findMany({
        where: { brand: { not: undefined } },
        select: { brand: true },
        distinct: ['brand'],
        orderBy: { brand: 'asc' },
    });

    return brands.map(item => item.brand).filter(Boolean);
}

export async function getProduct(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id , active: true},
        });

        if (!product) {
            throw new Error("Товар не найден");
        }

        return toPlain(product);
    } catch (error) {
        console.error("getProduct error:", error);
        throw error;
    }
}



export async function getAllLightProducts() {
    const products = await prisma.product.findMany({
        where: { active: true },
        select: {
            id: true,
            name: true,
            oem: true,
            price: true,
            brand: true,
            stock: true,
            images: true,
            crossNumbers: true,

            description: true,
            specifications: true,
            applicability: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return toPlain(products);
}



