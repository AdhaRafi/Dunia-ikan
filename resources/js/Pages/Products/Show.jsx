import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import { 
    ShoppingCart, 
    ShieldCheck, 
    MapPin, 
    Phone, 
    Droplets, 
    Thermometer, 
    Scale, 
    HeartPulse, 
    Store as StoreIcon, 
    Check, 
    ArrowLeft,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function Show({ product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const fish = product.fishDetail;
    const store = product.store;

    const handleAddToCart = () => {
        if (product.stock <= 0 || adding) return;

        setAdding(true);
        router.post('/cart', {
            product_id: product.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAdding(false);
                setSuccessMessage('Produk berhasil ditambahkan ke keranjang!');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: () => {
                setAdding(false);
            }
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getSexLabel = (s) => {
        switch (s) {
            case 'male': return '♂ Jantan (Male)';
            case 'female': return '♀ Betina (Female)';
            case 'pair': return 'Pasangan (1 Jantan + 1 Betina)';
            default: return 'Unsexed (Belum Dipisahkan)';
        }
    };

    const getWaterLabel = (w) => {
        switch (w) {
            case 'saltwater': return 'Air Laut (Marine / Saltwater)';
            case 'brackish': return 'Air Payau (Brackish)';
            default: return 'Air Tawar (Freshwater)';
        }
    };

    const getOriginLabel = (o) => {
        switch (o) {
            case 'wild_caught': return 'Tangkapan Liar Teraklimatisasi';
            case 'farm_raised': return 'Peternakan / Kolam Terbuka';
            default: return 'Captive Bred (Hasil Budidaya Penangkar)';
        }
    };

    return (
        <AppLayout>
            <Head title={`${product.name} - Dunia Ikan`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
                    <Link href="/products" className="hover:text-dunia-blue flex items-center gap-1">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Katalog
                    </Link>
                    <span>/</span>
                    <Link href={`/products?category=${product.category?.slug}`} className="hover:text-dunia-blue">
                        {product.category?.name}
                    </Link>
                    <span>/</span>
                    <span className="text-slate-800 truncate max-w-xs">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Product Images */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="aspect-4/5 rounded-3xl overflow-hidden bg-slate-100 border border-sky-100 shadow-md relative">
                            <img
                                src={product.image || 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b27?auto=format&fit=crop&w=800&q=80'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {store?.doa_policy && (
                                <div className="absolute top-4 left-4 bg-dunia-navy/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                                    <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                                    Garansi Hidup (DOA)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Buy Info & Bio-specs */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Title & Category */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-dunia-marine">
                                    {product.category?.name}
                                </span>
                                {fish?.morph_trait && (
                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-dunia-aqua border border-dunia-aqua/30">
                                        Morph: {fish.morph_trait}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy leading-tight">
                                {product.name}
                            </h1>

                            {fish?.species_name && (
                                <p className="text-sm italic text-slate-500 mt-1 font-serif">
                                    Spesies: {fish.species_name}
                                </p>
                            )}
                        </div>

                        {/* Price Card */}
                        <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Harga Satuan</p>
                                <p className="text-3xl font-extrabold text-dunia-blue tracking-tight">
                                    {formatPrice(product.price)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 font-medium">Status Ketersediaan</p>
                                {product.stock > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                                        <Check className="w-4 h-4" /> Ready Stock ({product.stock} ekor)
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-rose-600">
                                        Stok Habis
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart Actions */}
                        {product.stock > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-bold text-sm text-slate-900">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 transition"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={adding}
                                        className="flex-1 py-3 px-6 rounded-2xl bg-dunia-blue hover:bg-sky-600 text-white font-bold text-sm shadow-lg shadow-dunia-blue/20 transition flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        {adding ? 'Memproses...' : 'Tambah ke Keranjang'}
                                    </button>
                                </div>

                                {successMessage && (
                                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>{successMessage}</span>
                                        <Link href="/cart" className="underline ml-auto font-bold">
                                            Lihat Keranjang
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium">
                                Produk ini saat ini sedang habis dari penangkar.
                            </div>
                        )}

                        {/* MorphMarket-Inspired Biological Specification Grid */}
                        {fish && (
                            <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-4">
                                <h3 className="font-bold text-sm text-dunia-navy uppercase tracking-wider flex items-center gap-2">
                                    <HeartPulse className="w-4 h-4 text-dunia-marine" />
                                    Karakteristik Biologi & Kebutuhan Akuarium (Morph Data)
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Jenis Kelamin</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">
                                            {getSexLabel(fish.sex)}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Ukuran / Fase</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">
                                            {fish.size_stage || 'Ukuran Standar'}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Tipe Air</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">
                                            {getWaterLabel(fish.water_type)}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Min. Volume Tank</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">
                                            {fish.min_tank_liters ? `${fish.min_tank_liters} Liter` : 'Fleksibel'}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Suhu Air Ideal</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">
                                            {fish.temp_min && fish.temp_max ? `${fish.temp_min} - ${fish.temp_max} °C` : '24 - 28 °C'}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Rentang pH</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block">
                                            {fish.ph_min && fish.ph_max ? `${fish.ph_min} - ${fish.ph_max}` : '6.5 - 7.5'}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Level Perawatan</span>
                                        <span className="font-bold text-slate-900 capitalize mt-0.5 block">
                                            {fish.care_level}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Temperamen</span>
                                        <span className="font-bold text-slate-900 capitalize mt-0.5 block">
                                            {fish.temperament}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block font-medium">Asal Pembiakan</span>
                                        <span className="font-bold text-slate-900 mt-0.5 block truncate">
                                            {getOriginLabel(fish.breeding_origin)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Store Info & Live Arrival (DOA) Guarantee Card */}
                        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-dunia-navy flex items-center justify-center font-bold">
                                        <StoreIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <Link href={`/stores/${store?.slug}`} className="font-bold text-sm text-slate-900 hover:text-dunia-blue">
                                            {store?.name}
                                        </Link>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3" /> {store?.city}, {store?.province}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={`/stores/${store?.slug}`}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-dunia-navy hover:bg-sky-50 transition"
                                >
                                    Kunjungi Toko
                                </Link>
                            </div>

                            {/* DOA Policy Terms */}
                            {store?.doa_policy && (
                                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs space-y-1 text-slate-700">
                                    <p className="font-bold text-dunia-navy flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                                        Ketentuan Garansi Ikan Hidup (DOA Policy):
                                    </p>
                                    <p className="leading-relaxed text-slate-600">
                                        {store.doa_policy}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2 pt-2">
                            <h3 className="font-bold text-sm text-dunia-navy uppercase tracking-wider">
                                Deskripsi Produk
                            </h3>
                            <div className="prose prose-sm text-slate-600 max-w-none whitespace-pre-line leading-relaxed">
                                {product.description}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-slate-100 space-y-6">
                        <h2 className="text-xl font-extrabold text-dunia-navy">
                            Produk Terkait di Kategori Ini
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                            {relatedProducts.map((rel) => (
                                <ProductCard key={rel.id} product={rel} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
