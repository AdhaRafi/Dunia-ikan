import { Head, Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import Reveal from '@/Components/Reveal';
import StoreRatingSection from '@/Components/StoreRatingSection';
import { useLanguage } from '@/lib/i18n';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

export default function Show({ store, products, storeRating }) {
    const { pick } = useLanguage();
    const featured = products?.data?.[0];
    const avgRating = storeRating?.count > 0 ? Number(storeRating.average).toFixed(1) : null;

    return (
        <AppLayout>
            <Head title={`${store.name} — ${pick('Toko Penangkar', 'Breeder Store')}`}>
                <meta
                    head-key="description"
                    name="description"
                    content={String(store.description || `${store.name} — ${store.city}, ${store.province}`).slice(0, 155)}
                />
            </Head>

            <section
                data-nav-theme="dark"
                className="-mt-16 pt-16 bg-field4 text-white"
            >
                <div className="container-page grid gap-8 py-12 md:py-16 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-4 mb-4">
                            {store.logo_url ? (
                                <img
                                    src={store.logo_url}
                                    alt={store.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white/25 shrink-0"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center font-bold text-xl text-white shrink-0">
                                    {store.name.charAt(0)}
                                </div>
                            )}
                            <span className="text-sm text-white/75">
                                {store.city}, {store.province}
                            </span>
                        </div>
                        <h1 className="text-mask display-type max-w-[16ch]">
                            <span className="text-mask-inner">
                                {store.name}
                            </span>
                        </h1>

                        <p className="text-mask mt-5 max-w-[48ch] text-[20px] leading-snug">
                            <span className="text-mask-inner text-mask-delay-1">
                                {pick(
                                    `Penangkar ikan hias di ${store.city}, ${store.province}. Setiap produk membawa kebijakan garansi hidup toko ini.`,
                                    `Ornamental fish breeder in ${store.city}, ${store.province}. Every item carries this store's live arrival guarantee policy.`,
                                )}
                            </span>
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[16px] text-white/80">
                            <span>{store.phone}</span>
                            <a
                                href="#rating-toko"
                                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25 transition"
                            >
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {avgRating
                                    ? pick(`${avgRating}/5 (${storeRating.count} ulasan)`, `${avgRating}/5 (${storeRating.count} reviews)`)
                                    : pick('Belum ada rating', 'No ratings yet')}
                            </a>
                            <Link
                                href="/products"
                                className="press underline decoration-2 underline-offset-4 hover:text-white"
                            >
                                {pick('Katalog', 'Catalog')}
                            </Link>
                        </div>
                    </div>

                    {featured && (
                        <Link
                            href={`/products/${featured.slug}`}
                            className="press block min-w-0 lg:col-span-5"
                        >
                            <img
                                src={featured.image}
                                alt={featured.name}
                                width="800"
                                height="600"
                                className="aspect-[4/3] w-full object-cover"
                            />
                            <div className="mt-2 flex min-w-0 items-baseline justify-between gap-3 text-[16px] text-white/90">
                                <span className="min-w-0 truncate">
                                    {featured.name}
                                </span>
                                <span className="shrink-0 tabular-nums">
                                    {formatPrice(featured.price)}
                                </span>
                            </div>
                        </Link>
                    )}
                </div>
            </section>

            <section className="container-page py-14 md:py-20">
                <div className="grid gap-8 lg:grid-cols-12">
                    <Reveal className="lg:col-span-7">
                        <h2 className="text-[20px] font-medium tracking-[-0.02em]">
                            {pick('Tentang toko', 'About the store')}
                        </h2>
                        <p className="mt-3 max-w-[62ch] whitespace-pre-line text-[16px] leading-relaxed">
                            {store.description ||
                                pick('Belum ada deskripsi untuk toko ini.', 'No description provided for this store yet.')}
                        </p>
                    </Reveal>

                    <Reveal className="lg:col-span-5" delay={80}>
                        <div className="bg-surface p-6">
                            <h2 className="text-[20px] font-medium tracking-[-0.02em]">
                                {pick('Garansi hidup', 'Live arrival guarantee')}
                            </h2>
                            <p className="mt-3 text-[16px] leading-relaxed">
                                {store.doa_policy ||
                                    pick(
                                        'Garansi hidup standar berlaku dengan video unboxing tanpa jeda.',
                                        'Standard live arrival guarantee applies with an unedited unboxing video.',
                                    )}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="container-page pb-24">
                <Reveal className="flex flex-wrap items-end justify-between gap-3">
                    <h2 className="head-type">{pick('Produk toko', 'Store catalog')}</h2>
                    <p className="text-[16px] tabular-nums text-muted">
                        {products?.total ?? 0} {pick('produk', 'items')}
                    </p>
                </Reveal>

                {products?.data?.length > 0 ? (
                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product, index) => (
                            <Reveal key={product.id} delay={index * 40}>
                                <ProductCard product={product} />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <p className="mt-6 bg-surface p-6 text-[16px]">
                        {pick('Toko ini belum memiliki produk aktif.', 'This store does not have any active products yet.')}
                    </p>
                )}

                {products?.links?.length > 3 && (
                    <nav
                        className="mt-12 flex flex-wrap gap-1.5"
                        aria-label={pick('Halaman produk toko', 'Store product pages')}
                    >
                        {products.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`flex h-10 min-w-10 items-center justify-center px-2 text-[13px] ${
                                    link.active
                                        ? 'bg-ink text-bone'
                                        : link.url
                                          ? 'bg-surface text-ink hover:bg-field3'
                                          : 'cursor-not-allowed bg-surface text-muted/40'
                                }`}
                            />
                        ))}
                    </nav>
                )}

                <StoreRatingSection store={store} storeRating={storeRating} />
            </section>
        </AppLayout>
    );
}
