import { useQuery } from "@tanstack/react-query";
import {getBrands} from "@/features/actions/productActions";


export const useBrands = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: getBrands,
    });
};