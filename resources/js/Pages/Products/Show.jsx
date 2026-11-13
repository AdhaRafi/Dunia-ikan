import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import Reveal from '@/Components/Reveal';
import { ShoppingCart } from 'lucide-react';

const TONES = ['field3', 'field4', 'field2', 'field1'];

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

function getSexLabel(sex) {
    switch (sex) {
        case 'male':
            return 'Jantan';
        case 'female':
            return 'Betina';
        case 'pair':
            return 'Sepasang';
        default:
            return 'Unsexed';
    }
}

function getWaterLabel(water) {
    switch (water) {
        case 'saltwater':
            return 'Air laut';
        case 'brackish':
            return 'Air payau';
        default:
            return 'Air tawar';
    }
}

function getOriginLabel(origin) {
    switch (origin) {
        case 'wild_caught':
            return 'Tangkapan liar teraklimatisasi';
        case 'farm_raised':
            return 'Peternakan';
        default:
            return 'Captive bred';
    }
}

export default function Show({ product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const fish = product.fish_detail;
    const store = product.store;

    const handleAddToCart = () => {
        if (product.stock <= 0 || adding) {
            return;
        }

        setAdding(true);
        router.post(
            '/cart',
            { product_id: product.id, quantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAdding(false);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 3000);
                },
                onError: () => setAdding(false),
            },
        );
    };

    return (
        <AppLayout>
            <Head title={`${product.name} — Dunia Ikan`} />

            <section className="container-page pt-6 md:pt-10">
                <nav
                    className="flex flex-wrap items-center gap-2 text-[13px] text-muted"
                    aria-label="Breadcrumb"
                >
                    <Link href="/products" className="hover:text-ink">
                        Katalog
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/products?category=${product.category?.slug}`}
                        className="hover:text-ink"
                    >
                        {product.category?.name}
                    </Link>
                    <span>/</span>
                    <span className="max-w-[28ch] truncate text-ink">
                        {product.name}
                    </span>
                </nav>

                <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-12">
                    <Reveal className="order-2 min-w-0 lg:col-span-6 lg:col-start-1 lg:row-span-2 lg:row-start-1">
                        <div
                            className={`specimen-tile specimen-tile--bleed aspect-[3/4] ${
                                TONES[Number(product.id) % TONES.length]
                            }`}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="drift"
                                width="800"
                                height="1000"
                            />
                        </div>
                    </Reveal>

                    <Reveal
                        className="order-1 min-w-0 lg:col-span-6 lg:col-start-7 lg:row-start-1"
                        delay={80}
                    >
                        <h1 className="head-type">{product.name}</h1>

                        <p className="mt-2 text-[16px] text-ink/80">
                            {product.category?.name}
                            {fish?.species_name
                                ? ` · ${fish.species_name}`
                                : ''}
                        </p>
                    </Reveal>

                    <Reveal
                        className="order-3 min-w-0 lg:col-span-6 lg:col-start-7 lg:row-start-2"
                        delay={140}
                    >
                        <div className="flex flex-wrap items-baseline justify-between gap-4 bg-surface p-4">
                            <p className="text-[44px] font-medium tabular-nums leading-none tracking-[-0.03em]">
                                {formatPrice(product.price)}
                            </p>
                            <p className="text-[13px] text-muted">
                                {product.stock > 0
                                    ? `Stok ${product.stock}`
                                    : 'Stok habis'}
                            </p>
                        </div>

                        {product.stock > 0 ? (
                            <div className="mt-4 space-y-3">
                                <div className="flex gap-2">
                                    <div className="flex items-center bg-surface">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="press h-12 w-11 text-[20px] hover:bg-field3"
                                            aria-label="Kurangi jumlah"
                                        >
                                            −
                                        </button>
                                        <span className="w-10 text-center text-[16px] tabular-nums">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        product.stock,
                                                        quantity + 1,
                                                    ),
                                                )
                                            }
                                            className="press h-12 w-11 text-[20px] hover:bg-field3"
                                            aria-label="Tambah jumlah"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={adding}
                                        className="press flex h-12 flex-1 items-center justify-center gap-2 bg-ink px-6 text-[16px] font-medium text-bone hover:bg-accent disabled:opacity-50"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        {adding
                                            ? 'Memproses'
                                            : 'Tambah ke keranjang'}
                                    </button>
                                </div>

                                {added && (
                                    <div className="flex flex-wrap items-center gap-3 bg-field4 px-4 py-3 text-[13px] text-white">
                                        <span>Masuk ke keranjang.</span>
                                        <Link
                                            href="/cart"
                                            className="underline underline-offset-4"
                                        >
                                            Lihat keranjang
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="mt-4 bg-surface p-4 text-[16px]">
                                Produk ini sedang habis dari penangkar.
                            </p>
                        )}

                        {fish && (
                            <div className="mt-8">
                                <h2 className="text-[20px] font-medium tracking-[-0.02em]">
                                    Data air
                                </h2>
                                <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
                                    <div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Spesies
                                            </span>
                                            <span className="data-value italic">
                                                {fish.species_name}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Kelamin
                                            </span>
                                            <span className="data-value">
                                                {getSexLabel(fish.sex)}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Ukuran
                                            </span>
                                            <span className="data-value">
                                                {fish.size_stage || '—'}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Tipe air
                                            </span>
                                            <span className="data-value">
                                                {getWaterLabel(fish.water_type)}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Volume tank
                                            </span>
                                            <span className="data-value">
                                                {fish.min_tank_liters
                                                    ? `${fish.min_tank_liters} L`
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Suhu
                                            </span>
                                            <span className="data-value">
                                                {fish.temp_min != null
                                                    ? `${fish.temp_min}–${fish.temp_max} °C`
                                                    : '—'}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="data-row">
                                            <span className="data-label">pH</span>
                                            <span className="data-value">
                                                {fish.ph_min != null
                                                    ? `${fish.ph_min}–${fish.ph_max}`
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Perawatan
                                            </span>
                                            <span className="data-value capitalize">
                                                {fish.care_level || '—'}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Temperamen
                                            </span>
                                            <span className="data-value capitalize">
                                                {fish.temperament || '—'}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Pakan
                                            </span>
                                            <span className="data-value">
                                                {fish.diet_type || '—'}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Asal
                                            </span>
                                            <span className="data-value">
                                                {getOriginLabel(
                                                    fish.breeding_origin,
                                                )}
                                            </span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">
                                                Stok
                                            </span>
                                            <span className="data-value">
                                                {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 bg-surface p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-[16px] font-medium">
                                        {store?.name}
                                    </p>
                                    <p className="mt-1 text-[13px] text-muted">
                                        {store?.city}, {store?.province} ·{' '}
                                        {store?.phone}
                                    </p>
                                </div>
                                <Link
                                    href={`/stores/${store?.slug}`}
                                    className="press text-[13px] underline decoration-1 underline-offset-4 hover:text-accent"
                                >
                                    Kunjungi toko
                                </Link>
                            </div>

                            {store?.doa_policy && (
                                <div className="mt-4">
                                    <p className="text-[13px] text-muted">
                                        Kebijakan garansi hidup
                                    </p>
                                    <p className="mt-1 text-[16px] leading-relaxed">
                                        {store.doa_policy}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-[20px] font-medium tracking-[-0.02em]">
                                Deskripsi
                            </h2>
                            <p className="mt-2 whitespace-pre-line text-[16px] leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {relatedProducts?.length > 0 && (
                <section className="container-page py-20 md:py-24">
                    <Reveal>
                        <h2 className="head-type">Produk terkait</h2>
                    </Reveal>
                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
                        {relatedProducts.map((related, index) => (
                            <Reveal key={related.id} delay={index * 50}>
                                <ProductCard product={related} />
                            </Reveal>
                        ))}
                    </div>
                </section>
            )}
        </AppLayout>
    );
}
