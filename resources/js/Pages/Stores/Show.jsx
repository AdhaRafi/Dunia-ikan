import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ProductCard from '@/Components/ProductCard';
import Reveal from '@/Components/Reveal';

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
}

export default function Show({ store, products }) {
    const featured = products?.data?.[0];

    return (
        <AppLayout>
            <Head title={`${store.name} — Toko Penangkar`} />

            <section className="bg-field4 text-white">
                <div className="container-page grid gap-8 py-12 md:py-16 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <h1 className="display-type max-w-[16ch]">
                            {store.name}
                        </h1>

                        <p className="mt-5 max-w-[48ch] text-[20px] leading-snug">
                            Penangkar ikan hias di {store.city},{' '}
                            {store.province}. Setiap produk membawa kebijakan
                            garansi hidup toko ini.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[16px] text-white/80">
                            <span>{store.phone}</span>
                            <Link
                                href="/products"
                                className="press underline decoration-2 underline-offset-4 hover:text-white"
                            >
                                Katalog
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
                            Tentang toko
                        </h2>
                        <p className="mt-3 max-w-[62ch] whitespace-pre-line text-[16px] leading-relaxed">
                            {store.description ||
                                'Belum ada deskripsi untuk toko ini.'}
                        </p>
                    </Reveal>

                    <Reveal className="lg:col-span-5" delay={80}>
                        <div className="bg-surface p-6">
                            <h2 className="text-[20px] font-medium tracking-[-0.02em]">
                                Garansi hidup
                            </h2>
                            <p className="mt-3 text-[16px] leading-relaxed">
                                {store.doa_policy ||
                                    'Garansi hidup standar berlaku dengan video unboxing tanpa jeda.'}
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="container-page pb-24">
                <Reveal className="flex flex-wrap items-end justify-between gap-3">
                    <h2 className="head-type">Produk toko</h2>
                    <p className="text-[16px] tabular-nums text-muted">
                        {products?.total ?? 0} produk
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
                        Toko ini belum memiliki produk aktif.
                    </p>
                )}

                {products?.links?.length > 3 && (
                    <nav
                        className="mt-12 flex flex-wrap gap-1.5"
                        aria-label="Halaman produk toko"
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
            </section>
        </AppLayout>
    );
}
