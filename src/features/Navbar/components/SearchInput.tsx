'use client';

import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
                                                                        value,
                                                                        onChange,
                                                                        placeholder = "Поиск по названию, OEM, бренду, кросс-номеру или автомобилю..."
                                                                    }, ref) => {
    return (
        <div className="relative w-full max-w-2xl">
            <div className="relative group">
                {/* Иконка поиска */}
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none transition-colors group-focus-within:text-cyan-400" />

                <input
                    ref={ref}                    // ← Вот это было нужно
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl
                             pl-12 pr-12 py-3.5 text-base placeholder:text-zinc-500
                             focus:outline-none
                             focus:border-cyan-400
                             focus:ring-2 focus:ring-cyan-400/30
                             focus:shadow-[0_0_0_4px_rgba(34,211,238,0.15)]
                             transition-all duration-300"
                />

                {/* Кнопка очистки */}
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;