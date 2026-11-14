import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Reveal from '@/Components/Reveal';
import { Search } from 'lucide-react';

const SPECIES = [
    {
        label: 'Cupang',
        query: 'Cupang',
        image: '/images/products/cupang-halfmoon.jpg',
        alt: 'Cupang halfmoon super red',
        tone: 'field1',
    },
    {
        label: 'Guppy',
        query: 'Guppy',
        image: '/images/products/guppy-albino-full-red.jpg',
        alt: 'Guppy albino full red',
        tone: 'field4',
    },
    {
        label: 'Channa',
        query: 'Channa',
        image: '/images/products/channa-maru.jpg',
        alt: 'Channa marulioides',
        tone: 'field3',
    },
    {
        label: 'Air tawar',
        query: 'Air Tawar',
        image: '/images/products/aquarium-rimless.jpg',
        alt: 'Akuarium air tawar',
        tone: 'field2',
    },
];

export default function Index({ guides, categories, filters }) {
    const [search, setSearch] = useState(filters?.q || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || '',
    );

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/guides',
            { q: search, category: selectedCategory },
            { preserveState: true },
        );
    };

    const handleCategoryClick = (category) => {
        const next = selectedCategory === category ? '' : category;
        setSelectedCategory(next);
        router.get(
            '/guides',
            { q: search, category: next },
            { preserveState: true },
        );
    };

    return (
        <AppLayout>
            <Head title="Panduan Kesehatan Ikan — Dunia Ikan" />

            <section className="container-page pt-10 md:pt-16">
                <Reveal>
                    <div className="flex items-end justify-between gap-4">
                        <h1 className="display-type">Panduan</h1>
                        <p className="hidden text-[16px] tabular-nums text-muted sm:block">
                            {guides?.total ?? 0} panduan
                        </p>
                    </div>
                    <p className="mt-3 max-w-[56ch] text-[20px] leading-snug">
                        Gejala, penyebab, dan langkah pertama untuk penyakit ikan
                        air tawar. Disusun dari praktik aquarist dan pedoman
                        kesehatan akuakultur.
                    </p>
                </Reveal>

                <Reveal className="mt-8" delay={80}>
                    <form
                        onSubmit={handleSearch}
                        className="flex max-w-[560px] gap-2"
                    >
                        <div className="relative min-w-0 flex-1">
                            <input
                                type="search"
                                placeholder="Cari penyakit atau gejala"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-12 w-full border-0 bg-surface py-2 pl-10 pr-3 text-[16px] text-ink placeholder:text-muted focus:ring-2 focus:ring-accent"
                            />
                            <Search className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-muted" />
                        </div>
                        <button
                            type="submit"
                            className="press bg-ink px-5 text-[16px] font-medium text-bone hover:bg-accent"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[16px]">
                        <button
                            type="button"
                            onClick={() => handleCategoryClick('')}
                            className={`press underline-offset-4 hover:text-accent ${
                                selectedCategory === ''
                                    ? 'text-ink underline decoration-2'
                                    : 'text-muted'
                            }`}
                        >
                            Semua kategori
                        </button>
                        {categories?.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryClick(category)}
                                className={`press underline-offset-4 hover:text-accent ${
                                    selectedCategory === category
                                        ? 'text-ink underline decoration-2'
                                        : 'text-muted'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </Reveal>

                <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
                    {SPECIES.map((species, index) => (
                        <Reveal key={species.label} delay={index * 50}>
                            <Link
                                href={`/guides?q=${encodeURIComponent(species.query)}`}
                                className="block"
                            >
                                <div
                                    className={`specimen-tile aspect-[4/5] ${species.tone}`}
                                >
                                    <img
                                        src={species.image}
                                        alt={species.alt}
                                        loading="lazy"
                                        width="600"
                                        height="750"
                                        className="drift"
                                    />
                                </div>
                                <p className="pt-2 text-[16px] font-medium">
                                    {species.label}
                                </p>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="container-page pb-24 pt-10">
                {guides?.data?.length > 0 ? (
                    <div>
                        {guides.data.map((guide, index) => (
                            <Reveal key={guide.id} delay={index * 40}>
                                <Link
                                    href={`/guides/${guide.id}`}
                                    className={`grid gap-2 px-5 py-6 hover:bg-field3/50 md:grid-cols-12 md:items-baseline md:gap-4 ${
                                        index % 2 === 0 ? 'bg-surface' : ''
                                    }`}
                                >
                                    <p className="text-[13px] leading-relaxed text-muted md:col-span-3">
                                        {guide.category} · {guide.fish_type}
                                    </p>
                                    <p className="text-[20px] font-medium leading-snug tracking-[-0.02em] md:col-span-6">
                                        {guide.title}
                                    </p>
                                    <p className="line-clamp-2 text-[16px] leading-relaxed md:col-span-3">
                                        {guide.symptoms}
                                    </p>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface p-8">
                        <h2 className="text-[20px] font-medium">
                            Tidak ada panduan yang cocok
                        </h2>
                        <p className="mt-2 max-w-[46ch] text-[16px] leading-relaxed">
                            Coba kata kunci lain atau pilih semua kategori.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('');
                                router.get('/guides');
                            }}
                            className="press mt-5 bg-ink px-5 py-2.5 text-[13px] font-medium text-bone hover:bg-accent"
                        >
                            Reset pencarian
                        </button>
                    </div>
                )}

                {guides?.links?.length > 3 && (
                    <nav
                        className="mt-12 flex flex-wrap gap-1.5"
                        aria-label="Halaman panduan"
                    >
                        {guides.links.map((link, index) => (
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
