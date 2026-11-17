import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { AquaticCanvasBackdrop, HeroWaveTransition } from '@/Components/AquaticMotifs';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const SORT_OPTIONS = [
    { id: 'newest', labelId: 'Terbaru', labelEn: 'Newest' },
    { id: 'popular', labelId: 'Paling Populer', labelEn: 'Most Popular' },
    { id: 'price_asc', labelId: 'Harga Terendah', labelEn: 'Lowest Price' },
    { id: 'price_desc', labelId: 'Harga Tertinggi', labelEn: 'Highest Price' },
];

const WATER_OPTIONS = [
    { id: '', labelId: 'Semua', labelEn: 'All' },
    { id: 'freshwater', labelId: 'Air Tawar', labelEn: 'Freshwater' },
    { id: 'saltwater', labelId: 'Air Laut', labelEn: 'Saltwater' },
    { id: 'brackish', labelId: 'Air Payau', labelEn: 'Brackish' },
];

const WATER_BANNERS = {
    saltwater: '/images/banners/air-laut.jpg',
    freshwater: '/images/banners/air-tawar.jpg',
    brackish: '/images/banners/air-payau.jpg',
};

const CATEGORY_BANNERS = {
    'ikan-hias': '/images/products/cupang-halfmoon.jpg',
    'perlengkapan-aquarium': '/images/products/aquarium-rimless.jpg',
    'pakan-ikan': '/images/products/pelet-spirulina.jpg',
    'perawatan-ikan': '/images/banners/aquascape.jpg',
    aquascape: '/images/banners/aquascape.jpg',
};

const SEX_OPTIONS = [
    { id: '', labelId: 'Semua', labelEn: 'All' },
    { id: 'male', labelId: 'Jantan', labelEn: 'Male' },
    { id: 'female', labelId: 'Betina', labelEn: 'Female' },
    { id: 'pair', labelId: 'Sepasang', labelEn: 'Pair' },
];

export default function Index({ products, categories, cities, filters }) {
    const { pick, trCategory, isEn } = useLanguage();
    const filterObj = Array.isArray(filters) ? {} : filters || {};
    const [search, setSearch] = useState(typeof filterObj.q === 'string' ? filterObj.q : '');
    const [category, setCategory] = useState(typeof filterObj.category === 'string' ? filterObj.category : '');
    const [waterType, setWaterType] = useState(typeof filterObj.water_type === 'string' ? filterObj.water_type : '');
    const [sex, setSex] = useState(typeof filterObj.sex === 'string' ? filterObj.sex : '');
    const [minPrice, setMinPrice] = useState(typeof filterObj.min_price === 'string' ? filterObj.min_price : '');
    const [maxPrice, setMaxPrice] = useState(typeof filterObj.max_price === 'string' ? filterObj.max_price : '');
    const [city, setCity] = useState(typeof filterObj.city === 'string' ? filterObj.city : '');
    const [sortBy, setSortBy] = useState(typeof filterObj.sort === 'string' && filterObj.sort ? filterObj.sort : 'newest');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    useEffect(() => {
        setSearch(typeof filterObj.q === 'string' ? filterObj.q : '');
        setCategory(typeof filterObj.category === 'string' ? filterObj.category : '');
        setWaterType(typeof filterObj.water_type === 'string' ? filterObj.water_type : '');
        setSex(typeof filterObj.sex === 'string' ? filterObj.sex : '');
        setMinPrice(typeof filterObj.min_price === 'string' ? filterObj.min_price : '');
        setMaxPrice(typeof filterObj.max_price === 'string' ? filterObj.max_price : '');
        setCity(typeof filterObj.city === 'string' ? filterObj.city : '');
        setSortBy(typeof filterObj.sort === 'string' && filterObj.sort ? filterObj.sort : 'newest');
        setOpenSections((prev) => ({
            ...prev,
            water: prev.water || Boolean(filterObj.water_type),
            sex: prev.sex || Boolean(filterObj.sex),
            city: prev.city || Boolean(filterObj.city),
            price: prev.price || Boolean(filterObj.min_price || filterObj.max_price),
        }));
    }, [filters]);

    const [openSections, setOpenSections] = useState({
        categories: true,
        water: Boolean(filterObj.water_type),
        sex: Boolean(filterObj.sex),
        city: Boolean(filterObj.city),
        price: Boolean(filterObj.min_price || filterObj.max_price),
    });

    const toggleSection = (key) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const applyFilters = (overrides = {}) => {
        const queryParams = {
            q: search,
            category,
            water_type: waterType,
            sex,
            min_price: minPrice,
            max_price: maxPrice,
            city,
            sort: sortBy,
            ...overrides,
        };

        Object.keys(queryParams).forEach((key) => {
            if (!queryParams[key]) {
                delete queryParams[key];
            }
        });

        router.get('/products', queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setCategory('');
        setWaterType('');
        setSex('');
        setMinPrice('');
        setMaxPrice('');
        setCity('');
        setSortBy('newest');
        router.get('/products');
    };

    const hasActiveFilters = Boolean(search || category || waterType || sex || minPrice || maxPrice || city || (sortBy && sortBy !== 'newest'));
    const appliedCategorySlug = typeof filterObj.category === 'string' ? filterObj.category : '';
    const appliedWaterType = typeof filterObj.water_type === 'string' ? filterObj.water_type : '';
    const appliedSearch = typeof filterObj.q === 'string' ? filterObj.q.trim() : '';

    const rawCategoryName = categories?.find((item) => item.slug === appliedCategorySlug)?.name;
    const activeCategoryName = rawCategoryName ? trCategory(rawCategoryName) : null;
    const activeWaterObj = WATER_OPTIONS.find((item) => item.id && item.id === appliedWaterType);
    const activeWaterLabel = activeWaterObj ? (isEn ? activeWaterObj.labelEn : activeWaterObj.labelId) : null;

    const bannerTitle = activeCategoryName || activeWaterLabel || pick('Katalog', 'Catalog');
    const sectionTitle =
        activeCategoryName && activeWaterLabel
            ? `${activeCategoryName} · ${activeWaterLabel}`
            : activeCategoryName ||
              activeWaterLabel ||
              (appliedSearch ? pick(`Hasil: "${appliedSearch}"`, `Results: "${appliedSearch}"`) : pick('Semua Produk', 'All Products'));
    const bannerImage =
        appliedWaterType && (!appliedCategorySlug || appliedCategorySlug === 'ikan-hias')
            ? WATER_BANNERS[appliedWaterType]
            : CATEGORY_BANNERS[appliedCategorySlug] ||
              WATER_BANNERS[appliedWaterType] ||
              '/images/hero/aquarium-poster.webp';
    const bannerSizeClass =
        bannerTitle.length > 14
            ? 'text-3xl sm:text-5xl lg:text-6xl'
            : bannerTitle.length > 9
            ? 'text-4xl sm:text-6xl lg:text-7xl'
            : 'text-5xl sm:text-7xl lg:text-8xl';

    return (
        <AppLayout>
            <Head title={`${bannerTitle} — Dunia Ikan`}>
                <meta
                    head-key="description"
                    name="description"
                    content={pick(
                        'Jelajahi katalog ikan hias captive-bred, morph langka, tanaman aquascape, pakan, dan perlengkapan akuarium Dunia Ikan.',
                        'Browse curated captive-bred ornamental fish, rare morphs, aquatic plants, and aquarium equipment on Dunia Ikan.',
                    )}
                />
            </Head>

            {/* Editorial Top Banner */}
            <section
                data-nav-theme="dark"
                className="-mt-16 relative h-[296px] sm:h-[344px] lg:h-[376px] w-full overflow-hidden bg-[#0b1320]"
            >
                <img
                    src={bannerImage}
                    alt={`${bannerTitle} Dunia Ikan`}
                    className="w-full h-full object-cover object-center opacity-80 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/30" />
                <div className="absolute inset-0 pt-16 pb-6 flex items-center justify-center pointer-events-none px-6">
                    <span className={`${bannerSizeClass} font-black tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] leading-none select-none text-center`}>
                        {bannerTitle}
                    </span>
                </div>
                <HeroWaveTransition variant="sheet" />
            </section>

            {/* Floating Rounded Content Sheet */}
            <div className="-mt-6 relative isolate z-10 overflow-x-clip rounded-t-[28px] aquatic-canvas-ambient min-h-screen">
                <AquaticCanvasBackdrop variant="auth" />
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-14">
                    {/* Sheet Header Row: Headline + Pill Search Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-neutral-800">
                        <div>
                            <h1 className="text-mask text-xl sm:text-2xl font-extrabold tracking-tight text-[#001454] dark:text-white">
                                <span className="text-mask-inner">
                                    {sectionTitle}
                                </span>
                            </h1>
                            <p className="text-mask text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                                <span className="text-mask-inner text-mask-delay-1">
                                    {pick(
                                        `Menampilkan ${products?.data?.length ?? 0} dari ${products?.total ?? 0} produk tersedia`,
                                        `Showing ${products?.data?.length ?? 0} of ${products?.total ?? 0} available items`,
                                    )}
                                </span>
                            </p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                applyFilters();
                            }}
                            className="flex items-center w-full sm:w-auto sm:min-w-[340px] rounded-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-neutral-700 p-1 pl-4 shadow-2xs"
                        >
                            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                            <input
                                type="search"
                                placeholder={pick('Cari ikan, filter, tanaman...', 'Search fish, filters, plants...')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 min-w-0 bg-transparent border-0 p-0 text-xs text-[#001454] dark:text-white placeholder:text-slate-400 focus:ring-0 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="btn-motion btn-sheen px-4 py-1.5 rounded-full bg-[#001454] dark:bg-[#4AB8BD] text-white dark:text-[#001454] text-xs font-bold hover:opacity-95 shrink-0"
                            >
                                {pick('Cari', 'Search')}
                            </button>
                        </form>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                        className="mt-5 mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0f172a] px-4 py-2.5 text-xs font-bold text-[#001454] dark:text-white lg:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        {mobileFilterOpen ? pick('Tutup Filter', 'Close Filters') : pick('Filter & Kategori', 'Filters & Categories')}
                    </button>

                    {/* 2-Column Minimalist Shop Layout */}
                    <div className="grid gap-8 lg:grid-cols-12 pt-6">
                        {/* Left Sidebar: Clean Tree + Lightweight Accordions */}
                        <aside className={`lg:col-span-3 space-y-5 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-extrabold text-[#001454] dark:text-white">
                                        {pick('Kategori', 'Categories')}
                                    </h2>
                                    {hasActiveFilters && (
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="text-[11px] font-semibold text-slate-400 hover:text-[#0684E5] transition"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection('categories')}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                                            !category
                                                ? 'bg-white dark:bg-[#0f172a] text-[#001454] dark:text-white shadow-2xs border border-slate-200/80 dark:border-neutral-800'
                                                : 'text-slate-600 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-[#0f172a]'
                                        }`}
                                    >
                                        <span>{pick('Semua Produk', 'All Products')}</span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="px-1.5 py-0.5 rounded-full bg-[#001454] dark:bg-[#4AB8BD] text-white dark:text-[#001454] text-[10px] font-bold">
                                                {products?.total ?? 0}
                                            </span>
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSections.categories ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>

                                    {openSections.categories && (
                                        <div className="ml-3 pl-3 border-l border-slate-200 dark:border-neutral-800 space-y-0.5 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCategory('');
                                                    applyFilters({ category: '' });
                                                }}
                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                                                    category === ''
                                                        ? 'font-bold text-[#0684E5] dark:text-[#4AB8BD]'
                                                        : 'text-slate-600 dark:text-neutral-400 hover:text-[#001454] dark:hover:text-white'
                                                }`}
                                            >
                                                {pick('Semua Kategori', 'All Categories')}
                                            </button>
                                            {categories?.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setCategory(item.slug);
                                                        applyFilters({ category: item.slug });
                                                    }}
                                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                                                        category === item.slug
                                                            ? 'font-bold text-[#0684E5] dark:text-[#4AB8BD]'
                                                            : 'text-slate-600 dark:text-neutral-400 hover:text-[#001454] dark:hover:text-white'
                                                    }`}
                                                >
                                                    {trCategory(item.name)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Sort List */}
                            <div className="border-t border-slate-200/80 dark:border-neutral-800 pt-4 space-y-1.5">
                                <p className="text-xs font-bold text-[#001454] dark:text-white px-1 mb-2">
                                    {pick('Urutkan', 'Sort By')}
                                </p>
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => {
                                            setSortBy(option.id);
                                            applyFilters({ sort: option.id });
                                        }}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                                            sortBy === option.id
                                                ? 'font-bold text-[#001454] dark:text-white bg-white dark:bg-[#0f172a] shadow-2xs'
                                                : 'text-slate-600 dark:text-neutral-400 hover:text-[#001454] dark:hover:text-white'
                                        }`}
                                    >
                                        {isEn ? option.labelEn : option.labelId}
                                    </button>
                                ))}
                            </div>

                            {/* Collapsible Water Type */}
                            <div className="border-t border-slate-200/80 dark:border-neutral-800 pt-3">
                                <button
                                    type="button"
                                    onClick={() => toggleSection('water')}
                                    className="w-full flex items-center justify-between px-1 py-1 text-xs font-bold text-[#001454] dark:text-white"
                                >
                                    <span>{pick('Tipe Air', 'Water Type')}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSections.water ? 'rotate-180' : ''}`} />
                                </button>
                                {openSections.water && (
                                    <div className="mt-1.5 space-y-0.5 pl-1">
                                        {WATER_OPTIONS.map((option) => (
                                            <button
                                                key={option.id || 'all'}
                                                type="button"
                                                onClick={() => {
                                                    setWaterType(option.id);
                                                    applyFilters({ water_type: option.id });
                                                }}
                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                                                    waterType === option.id
                                                        ? 'font-bold text-[#0684E5] dark:text-[#4AB8BD]'
                                                        : 'text-slate-600 dark:text-neutral-400 hover:text-[#001454]'
                                                }`}
                                            >
                                                {isEn ? option.labelEn : option.labelId}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Collapsible Sex */}
                            <div className="border-t border-slate-200/80 dark:border-neutral-800 pt-3">
                                <button
                                    type="button"
                                    onClick={() => toggleSection('sex')}
                                    className="w-full flex items-center justify-between px-1 py-1 text-xs font-bold text-[#001454] dark:text-white"
                                >
                                    <span>{pick('Jenis Kelamin', 'Sex')}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSections.sex ? 'rotate-180' : ''}`} />
                                </button>
                                {openSections.sex && (
                                    <div className="mt-1.5 space-y-0.5 pl-1">
                                        {SEX_OPTIONS.map((option) => (
                                            <button
                                                key={option.id || 'all'}
                                                type="button"
                                                onClick={() => {
                                                    setSex(option.id);
                                                    applyFilters({ sex: option.id });
                                                }}
                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                                                    sex === option.id
                                                        ? 'font-bold text-[#0684E5] dark:text-[#4AB8BD]'
                                                        : 'text-slate-600 dark:text-neutral-400 hover:text-[#001454]'
                                                }`}
                                            >
                                                {isEn ? option.labelEn : option.labelId}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Collapsible City */}
                            <div className="border-t border-slate-200/80 dark:border-neutral-800 pt-3">
                                <button
                                    type="button"
                                    onClick={() => toggleSection('city')}
                                    className="w-full flex items-center justify-between px-1 py-1 text-xs font-bold text-[#001454] dark:text-white"
                                >
                                    <span>{pick('Kota Penjual', 'Seller City')}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSections.city ? 'rotate-180' : ''}`} />
                                </button>
                                {openSections.city && (
                                    <div className="mt-1.5 space-y-0.5 pl-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCity('');
                                                applyFilters({ city: '' });
                                            }}
                                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                                                city === '' ? 'font-bold text-[#0684E5] dark:text-[#4AB8BD]' : 'text-slate-600 dark:text-neutral-400 hover:text-[#001454]'
                                            }`}
                                        >
                                            {pick('Semua Kota', 'All Cities')}
                                        </button>
                                        {cities?.map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => {
                                                    setCity(item);
                                                    applyFilters({ city: item });
                                                }}
                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                                                    city === item ? 'font-bold text-[#0684E5] dark:text-[#4AB8BD]' : 'text-slate-600 dark:text-neutral-400 hover:text-[#001454]'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Collapsible Price */}
                            <div className="border-t border-slate-200/80 dark:border-neutral-800 pt-3">
                                <button
                                    type="button"
                                    onClick={() => toggleSection('price')}
                                    className="w-full flex items-center justify-between px-1 py-1 text-xs font-bold text-[#001454] dark:text-white"
                                >
                                    <span>{pick('Rentang Harga', 'Price Range')}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
                                </button>
                                {openSections.price && (
                                    <div className="mt-2 space-y-2 px-1">
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min Rp"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0f172a] px-2.5 py-1.5 text-xs focus:border-[#4AB8BD] focus:outline-none"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max Rp"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0f172a] px-2.5 py-1.5 text-xs focus:border-[#4AB8BD] focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => applyFilters()}
                                            className="w-full rounded-full bg-[#001454] dark:bg-[#4AB8BD] text-white dark:text-[#001454] font-bold py-1.5 text-xs hover:opacity-90 transition"
                                        >
                                            {pick('Terapkan', 'Apply')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Right Catalog Grid */}
                        <div className="lg:col-span-9 min-w-0 space-y-8">
                            {products?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                                    {products.data.map((product, idx) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            className="overlap-enter"
                                            style={{ '--overlap-i': idx }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0f172a] p-12 text-center space-y-3">
                                    <h3 className="text-base font-bold text-[#001454] dark:text-white">
                                        {pick('Produk tidak ditemukan', 'No products found')}
                                    </h3>
                                    <p className="mx-auto max-w-sm text-xs text-slate-500 dark:text-neutral-400">
                                        {pick(
                                            'Coba ubah kategori, filter, atau kata kunci pencarian lainnya.',
                                            'Try adjusting your category, filters, or search keywords.',
                                        )}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="rounded-full bg-[#001454] dark:bg-[#4AB8BD] px-5 py-2 text-xs font-bold text-white dark:text-[#001454] hover:opacity-90 transition"
                                    >
                                        {pick('Reset Filter', 'Reset Filters')}
                                    </button>
                                </div>
                            )}

                            {/* Clean Pagination */}
                            {products?.links?.length > 3 && (
                                <div className="pt-4 border-t border-slate-200/80 dark:border-neutral-800 flex flex-wrap items-center justify-center gap-1.5">
                                    {products.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                                link.active
                                                    ? 'bg-[#001454] dark:bg-[#4AB8BD] text-white dark:text-[#001454] font-bold'
                                                    : link.url
                                                    ? 'text-slate-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-[#0f172a]'
                                                    : 'text-slate-300 dark:text-neutral-600 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
