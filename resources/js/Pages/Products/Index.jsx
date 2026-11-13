import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { 
    Filter, 
    Search, 
    X, 
    SlidersHorizontal, 
    RotateCcw, 
    Fish, 
    AlertCircle 
} from 'lucide-react';

export default function Index({ products, categories, cities, filters }) {
    const [search, setSearch] = useState(filters?.q || '');
    const [category, setCategory] = useState(filters?.category || '');
    const [waterType, setWaterType] = useState(filters?.water_type || '');
    const [sex, setSex] = useState(filters?.sex || '');
    const [careLevel, setCareLevel] = useState(filters?.care_level || '');
    const [temperament, setTemperament] = useState(filters?.temperament || '');
    const [minPrice, setMinPrice] = useState(filters?.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters?.max_price || '');
    const [city, setCity] = useState(filters?.city || '');
    const [sort, setSort] = useState(filters?.sort || 'newest');
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
            sort,
            ...overrides,
        };

        // Bersihkan parameter kosong
        Object.keys(queryParams).forEach((key) => {
            if (!queryParams[key]) delete queryParams[key];
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
        setSort('newest');

        router.get('/products');
    };

    return (
        <AppLayout>
            <Head title="Katalog Ikan Hias & Mutasi Morph - Dunia Ikan" />

            {/* Catalog Banner */}
            <div className="bg-sky-50/60 border-b border-sky-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy tracking-tight">
                                Katalog Ikan Hias & Kebutuhan Akuarium
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Filter spesifik berdasarkan karakteristik morfologi, parameter air, dan penangkar.
                            </p>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                            className="lg:hidden px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-dunia-navy font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-dunia-blue" />
                            Filter Morfologi Ikan
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar (Desktop + Mobile) */}
                    <aside className={`lg:col-span-1 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <span className="font-bold text-sm text-dunia-navy flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-dunia-marine" />
                                    Filter Spesifik
                                </span>
                                <button
                                    onClick={handleReset}
                                    className="text-xs font-semibold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset
                                </button>
                            </div>

                            {/* Search Keyword */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Kata Kunci</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Nama ikan / varian..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua"
                                    />
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Kategori</label>
                                <select
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        applyFilters({ category: e.target.value });
                                    }}
                                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua bg-white"
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* MorphMarket Trait Filters */}
                            <div className="pt-3 border-t border-slate-100 space-y-4">
                                <p className="text-[11px] font-extrabold text-dunia-marine uppercase tracking-wider">
                                    Atribut Morfologi & Biologi
                                </p>

                                {/* Water Type */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tipe Air</label>
                                    <select
                                        value={waterType}
                                        onChange={(e) => {
                                            setWaterType(e.target.value);
                                            applyFilters({ water_type: e.target.value });
                                        }}
                                        className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua bg-white"
                                    >
                                        <option value="">Semua Tipe Air</option>
                                        <option value="freshwater">Air Tawar (Freshwater)</option>
                                        <option value="saltwater">Air Laut (Saltwater)</option>
                                        <option value="brackish">Air Payau (Brackish)</option>
                                    </select>
                                </div>

                                {/* Sex (MorphMarket style) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Kelamin</label>
                                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                                        {[
                                            { id: 'male', label: '♂ Jantan' },
                                            { id: 'female', label: '♀ Betina' },
                                            { id: 'pair', label: 'Sepasang (Pair)' },
                                            { id: 'unsexed', label: 'Unsexed' },
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => {
                                                    const newVal = sex === item.id ? '' : item.id;
                                                    setSex(newVal);
                                                    applyFilters({ sex: newVal });
                                                }}
                                                className={`py-1.5 px-2 rounded-lg text-center font-medium border transition ${
                                                    sex === item.id
                                                        ? 'bg-dunia-blue text-white border-dunia-blue'
                                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
                                                }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Care Level */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tingkat Perawatan</label>
                                    <select
                                        value={careLevel}
                                        onChange={(e) => {
                                            setCareLevel(e.target.value);
                                            applyFilters({ care_level: e.target.value });
                                        }}
                                        className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua bg-white"
                                    >
                                        <option value="">Semua Level</option>
                                        <option value="pemula">Pemula / Mudah</option>
                                        <option value="menengah">Menengah</option>
                                        <option value="mahir">Mahir / Sulit</option>
                                    </select>
                                </div>

                                {/* Temperament */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Temperamen</label>
                                    <select
                                        value={temperament}
                                        onChange={(e) => {
                                            setTemperament(e.target.value);
                                            applyFilters({ temperament: e.target.value });
                                        }}
                                        className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua bg-white"
                                    >
                                        <option value="">Semua Temperamen</option>
                                        <option value="damai">Damai (Peaceful)</option>
                                        <option value="semi-agresif">Semi-Agresif</option>
                                        <option value="agresif">Agresif / Teritorial</option>
                                        <option value="predator">Predator</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="pt-3 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Rentang Harga (Rp)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => applyFilters()}
                                    className="w-full mt-2 py-1.5 rounded-lg bg-sky-50 text-dunia-navy text-xs font-bold hover:bg-sky-100 transition"
                                >
                                    Terapkan Harga
                                </button>
                            </div>

                            {/* City Filter */}
                            <div className="pt-3 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Kota Asal Toko</label>
                                <select
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                        applyFilters({ city: e.target.value });
                                    }}
                                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua bg-white"
                                >
                                    <option value="">Semua Kota</option>
                                    {cities?.map((c, idx) => (
                                        <option key={idx} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Product Listing Main Column */}
                    <main className="lg:col-span-3 space-y-6">
                        {/* Active Filter Chips & Sorting Header */}
                        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <p className="text-xs text-slate-500 font-medium">
                                Menampilkan <strong className="text-slate-900">{products?.total || 0}</strong> produk
                            </p>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <label className="text-xs text-slate-500 font-medium">Urutkan:</label>
                                <select
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        applyFilters({ sort: e.target.value });
                                    }}
                                    className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua bg-white font-semibold text-slate-700"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="price_asc">Harga Terendah</option>
                                    <option value="price_desc">Harga Tertinggi</option>
                                    <option value="popular">Paling Dilihat</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Cards Grid */}
                        {products?.data?.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="p-12 text-center bg-white rounded-2xl border border-sky-100 shadow-xs space-y-3">
                                <div className="w-14 h-14 rounded-full bg-sky-50 text-slate-400 mx-auto flex items-center justify-center">
                                    <AlertCircle className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-base text-slate-800">Tidak ada produk yang cocok</h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Coba ubah kriteria filter biologi, rentang harga, atau cari dengan kata kunci lain.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 rounded-xl bg-dunia-blue text-white text-xs font-bold hover:bg-sky-600 transition"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {products?.links?.length > 3 && (
                            <div className="pt-6 flex justify-center gap-1.5">
                                {products.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                            link.active
                                                ? 'bg-dunia-blue text-white'
                                                : link.url
                                                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-sky-50'
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
