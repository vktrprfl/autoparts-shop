import Link from 'next/link';

const promotions = [
    {
        id: 1,
        title: "Пополнение тормозных колодок",
        subtitle: "Более 150 новых позиций",
        badge: "Новое",
        color: "emerald",
        link: "/catalog",
    },
    {
        id: 2,
        title: "Скидки на фильтры",
        subtitle: "До -25% на масляные и воздушные",
        badge: "Акция",
        color: "emerald",
        link: "/catalog",
    },
    {
        id: 3,
        title: "Подвеска в наличии",
        subtitle: "Амортизаторы, рычаги, сайлентблоки",
        badge: "Хит",
        color: "cyan",
        link: "/catalog",
    },
    {
        id: 4,
        title: "Запчасти для авто",
        subtitle: "Toyota, Hyundai, Kia, Volkswagen",
        badge: "Выбор",
        color: "violet",
        link: "/catalog",
    },
];

export default function FeaturedProducts() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            {/* Заголовок */}
            <div className="flex justify-between items-end mb-8 md:mb-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold">Акции и спецпредложения</h2>
                    <p className="text-zinc-400 mt-1.5 text-sm md:text-base">
                        Выгодные предложения и новинки
                    </p>
                </div>

                {/* Скрываем на мобильных */}
                <Link
                    href="/catalog"
                    className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-lg font-medium"
                >
                    Все предложения →
                </Link>
            </div>

            {/* Карточки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {promotions.map((promo) => (
                    <Link
                        key={promo.id}
                        href={promo.link}
                        className="group"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-8 h-full hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">

                            {/* Бейдж */}
                            <div className={`inline-block px-4 py-1 text-xs md:text-sm font-semibold rounded-full mb-5 w-fit
                                ${promo.color === 'emerald' ? 'bg-emerald-500 text-black' : ''}
                                ${promo.color === 'cyan' ? 'bg-cyan-500 text-black' : ''}
                                ${promo.color === 'violet' ? 'bg-violet-500 text-black' : ''}`}
                            >
                                {promo.badge}
                            </div>

                            {/* Заголовок */}
                            <h3 className="text-lg md:text-2xl font-semibold leading-tight mb-3 group-hover:text-cyan-400 transition-colors">
                                {promo.title}
                            </h3>

                            {/* Описание */}
                            <p className="text-zinc-400 text-sm md:text-base flex-1 leading-relaxed">
                                {promo.subtitle}
                            </p>

                            {/* Кнопка "Подробнее" */}
                            <div className="mt-6 md:mt-8 text-cyan-400 font-medium flex items-center gap-2 text-sm md:text-base group-hover:gap-3 transition-all">
                                Подробнее
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Мобильная кнопка "Все предложения" */}
            <div className="flex justify-center mt-8 md:hidden">
                <Link
                    href="/catalog"
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 text-base"
                >
                    Все акции и предложения →
                </Link>
            </div>
        </div>
    );
}