import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { Search, SlidersHorizontal, RotateCcw, Filter, AlertCircle } from 'lucide-react';

const SEX_OPTIONS = [
    { id: 'male', label: '♂ Jantan' },
    { id: 'female', label: '♀ Betina' },
    { id: 'pair', label: 'Sepasang' },
    { id: 'unsexed', label: 'Unsexed' },
];

export default function Index({ products, categories, cities, filters }) {
    const filterObj = Array.isArray(filters) ? {} : (filters || {});
    const [search, setSearch] = useState(typeof filterObj.q === 'string' ? filterObj.q : '');
    const [category, setCategory] = useState(typeof filterObj.category === 'string' ? filterObj.category : '');
    const [waterType, setWaterType] = useState(typeof filterObj.water_type === 'string' ? filterObj.water_type : '');
    const [sex, setSex] = useState(typeof filterObj.sex === 'string' ? filterObj.sex : '');
    const [careLevel, setCareLevel] = useState(typeof filterObj.care_level === 'string' ? filterObj.care_level : '');
    const [temperament, setTemperament] = useState(typeof filterObj.temperament === 'string' ? filterObj.temperament : '');
    const [minPrice, setMinPrice] = useState(typeof filterObj.min_price === 'string' ? filterObj.min_price : '');
    const [maxPrice, setMaxPrice] = useState(typeof filterObj.max_price === 'string' ? filterObj.max_price : '');
    const [city, setCity] = useState(typeof filterObj.city === 'string' ? filterObj.city : '');
    const [sortBy, setSortBy] = useState(typeof filterObj.sort === 'string' && filterObj.sort ? filterObj.sort : 'newest');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const applyFilters = (overrides = {}) => {
        const queryParams = {
            q: search,
            category,
            water_type: waterType,
            sex,
            care_level: careLevel,
            temperament,
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
        setCareLevel('');
        setTemperament('');
        setMinPrice('');
        setMaxPrice('');
        setCity('');
        setSortBy('newest');
        router.get('/products');
    };

    return (
        <AppLayout>
            <Head title="Katalog Ikan Hias & Morph Terpercaya — Dunia Ikan" />

            {/* Header banner */}
            <div className="bg-[#0E1719] text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-xs font-bold text-[#00C882] uppercase tracking-widest flex items-center gap-2 mb-2">
                        <span className="w-5 h-0.5 bg-[#00C882]" />
                        Katalog Spesimen
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Katalog Ikan Hias & Morph
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                                Filter spesifik berdasarkan karakteristik morfologi, parameter biologi air, dan lokasi penangkar.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-slate-300 bg-[#142224] border border-slate-700/60 px-3.5 py-2 rounded-lg self-start sm:self-auto">
                            {products?.total ?? 0} spesimen terdaftar
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Mobile Filter Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E1719] px-4 py-3 text-xs font-bold text-[#00C882] lg:hidden shadow-sm"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    {mobileFilterOpen ? 'Tutup Filter Morfologi' : 'Buka Filter Morfologi & Biologi'}
                </button>

                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Filters Sidebar */}
                    <aside className={`lg:col-span-1 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                    <Filter className="h-4 w-4 text-[#00C882]" />
                                    Filter Spesimen
                                </span>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Reset
                                </button>
                            </div>

                            {/* Search */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Kata Kunci
                                </label>
                                <div className="relative">
                                    <input
                                        type="search"
                                        placeholder="Nama ikan / morph..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:border-[#00C882] focus:bg-white focus:outline-none transition"
                                    />
                                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Kategori
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        applyFilters({ category: e.target.value });
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#00C882] focus:outline-none"
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories?.map((item) => (
                                        <option key={item.id} value={item.slug}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* MorphMarket Trait: Sex */}
                            <div className="border-t border-slate-100 pt-3">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Jenis Kelamin
                                </label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {SEX_OPTIONS.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                const next = sex === item.id ? '' : item.id;
                                                setSex(next);
                                                applyFilters({ sex: next });
                                            }}
                                            className={`rounded-lg py-2 text-xs font-bold transition border ${
                                                sex === item.id
                                                    ? 'bg-[#00C882] text-slate-950 border-[#00C882]'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Water Type */}
                            <div className="border-t border-slate-100 pt-3">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Tipe Air
                                </label>
                                <select
                                    value={waterType}
                                    onChange={(e) => {
                                        setWaterType(e.target.value);
                                        applyFilters({ water_type: e.target.value });
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#00C882] focus:outline-none"
                                >
                                    <option value="">Semua Tipe Air</option>
                                    <option value="freshwater">Air Tawar (Freshwater)</option>
                                    <option value="saltwater">Air Laut (Saltwater)</option>
                                    <option value="brackish">Air Payau (Brackish)</option>
                                </select>
                            </div>

                            {/* Care Level */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Tingkat Perawatan
                                </label>
                                <select
                                    value={careLevel}
                                    onChange={(e) => {
                                        setCareLevel(e.target.value);
                                        applyFilters({ care_level: e.target.value });
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#00C882] focus:outline-none"
                                >
                                    <option value="">Semua Tingkat</option>
                                    <option value="pemula">Pemula / Mudah</option>
                                    <option value="menengah">Menengah</option>
                                    <option value="mahir">Mahir / Sulit</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div className="border-t border-slate-100 pt-3">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Rentang Harga (Rp)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#00C882] focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#00C882] focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => applyFilters()}
                                    className="mt-2 w-full rounded-lg bg-emerald-50 text-[#00C882] font-bold py-1.5 text-xs hover:bg-emerald-100 transition"
                                >
                                    Terapkan Harga
                                </button>
                            </div>

                            {/* City */}
                            <div className="border-t border-slate-100 pt-3">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Kota Asal Toko
                                </label>
                                <select
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                        applyFilters({ city: e.target.value });
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#00C882] focus:outline-none"
                                >
                                    <option value="">Semua Kota</option>
                                    {cities?.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid & Sorting */}
                    <main className="lg:col-span-3 space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <p className="text-xs text-slate-600 font-medium">
                                Menampilkan <strong>{products?.data?.length ?? 0}</strong> dari{' '}
                                <strong>{products?.total ?? 0}</strong> spesimen
                            </p>

                            <div className="flex items-center gap-2">
                                <label className="text-xs text-slate-500 font-medium">
                                    Urutkan:
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        applyFilters({ sort: e.target.value });
                                    }}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#00C882] focus:outline-none"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="price_asc">Harga Terendah</option>
                                    <option value="price_desc">Harga Tertinggi</option>
                                    <option value="popular">Paling Dilihat</option>
                                </select>
                            </div>
                        </div>

                        {products?.data?.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs space-y-3">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                    <AlertCircle className="h-7 w-7" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800">
                                    Tidak ada spesimen yang cocok
                                </h3>
                                <p className="mx-auto max-w-sm text-xs text-slate-500">
                                    Coba ubah kriteria filter biologi, jenis kelamin, atau cari dengan kata kunci lain.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="rounded-xl bg-[#00C882] px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {products?.links?.length > 3 && (
                            <div className="pt-6 flex justify-center gap-1.5">
                                {products.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                            link.active
                                                ? 'bg-[#00C882] text-slate-950 font-bold'
                                                : link.url
                                                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AppLayout>
    );
}
