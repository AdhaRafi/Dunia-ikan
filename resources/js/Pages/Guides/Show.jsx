import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Reveal from '@/Components/Reveal';

const GUIDE_IMAGES = {
    'Penyakit Parasit': '/images/products/cupang-halfmoon.jpg',
    'Infeksi Bakteri / Jamur': '/images/products/cupang-plakat.jpg',
    'Gangguan Pencernaan & Organ': '/images/products/discus.jpg',
    'Kualitas Air & Filter': '/images/products/aquarium-rimless.jpg',
};

const SPECIES = [
    {
        name: 'Cupang',
        image: '/images/products/cupang-plakat.jpg',
        tone: 'field1',
    },
    {
        name: 'Guppy',
        image: '/images/products/guppy-afr.jpg',
        tone: 'field4',
    },
    {
        name: 'Channa',
        image: '/images/products/channa-maru.jpg',
        tone: 'field3',
    },
    {
        name: 'Neon tetra',
        image: '/images/products/neon-tetra.jpg',
        tone: 'field2',
    },
];

const SECTIONS = [
    { key: 'symptoms', title: 'Gejala' },
    { key: 'possible_causes', title: 'Kemungkinan penyebab' },
    { key: 'care_instructions', title: 'Penanganan' },
    { key: 'prevention', title: 'Pencegahan' },
];

export default function Show({ guide, relatedGuides }) {
    const heroImage =
        GUIDE_IMAGES[guide.category] ?? '/images/products/aquarium-rimless.jpg';

    return (
        <AppLayout>
            <Head title={`${guide.title} — Panduan Dunia Ikan`} />

            <article className="container-page pb-24 pt-8 md:pt-12">
                <Reveal>
                    <h1 className="head-type">{guide.title}</h1>

                    <p className="mt-4 text-[16px] text-ink/80">
                        {guide.category} · {guide.fish_type}
                    </p>
                </Reveal>

                <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
                    <Reveal className="min-w-0 lg:col-span-5">
                        <nav aria-label="Di halaman ini">
                            <p className="text-[16px] font-medium">
                                Di halaman ini
                            </p>
                            <ul className="mt-2 space-y-1 text-[16px]">
                                {SECTIONS.filter(
                                    (section) => guide[section.key],
                                ).map((section) => (
                                    <li key={section.key}>
                                        <a
                                            href={`#${section.key}`}
                                            className="underline decoration-1 underline-offset-4 hover:text-accent"
                                        >
                                            {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="mt-8 max-w-[56ch] border-l-4 border-field3 bg-surface p-5">
                            <p className="text-[16px] font-medium">
                                Konsultasi awal, bukan diagnosis medis
                            </p>
                            <p className="mt-1 text-[16px] leading-relaxed">
                                Jika ikan sangat lemah, mengalami pendarahan,
                                atau gejala menyebar ke seluruh akuarium, hubungi
                                dokter hewan akuatik.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal className="min-w-0 lg:col-span-7" delay={80}>
                        <div className="specimen-tile specimen-tile--bleed aspect-[4/5] field4">
                            <img
                                src={heroImage}
                                alt={guide.fish_type}
                                className="drift"
                                width="800"
                                height="1000"
                            />
                        </div>
                        <p className="mt-2 text-[13px] text-muted">
                            Spesimen air tawar dari katalog Dunia Ikan.
                        </p>
                    </Reveal>
                </div>

                <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="min-w-0 lg:col-span-8">
                        {SECTIONS.map((section, index) => {
                            const body = guide[section.key];

                            if (!body) {
                                return null;
                            }

                            return (
                                <Reveal key={section.key} delay={index * 50}>
                                    <section
                                        id={section.key}
                                        className="mt-10 max-w-[68ch] scroll-mt-24 first:mt-0"
                                    >
                                        <h2 className="text-[20px] font-medium tracking-[-0.02em]">
                                            {section.title}
                                        </h2>
                                        <p className="mt-3 whitespace-pre-line text-[16px] leading-relaxed">
                                            {body}
                                        </p>
                                    </section>
                                </Reveal>
                            );
                        })}

                        {guide.source && (
                            <Reveal>
                                <p className="mt-10 max-w-[68ch] text-[13px] text-muted">
                                    Sumber: {guide.source}
                                </p>
                            </Reveal>
                        )}

                        <Reveal>
                            <Link
                                href="/guides"
                                className="press mt-10 inline-block text-[16px] underline decoration-1 underline-offset-4 hover:text-accent"
                            >
                                Semua panduan
                            </Link>
                        </Reveal>
                    </div>

                    <aside className="min-w-0 lg:col-span-4">
                        <p className="text-[16px] font-medium">
                            Spesies yang perlu dipantau
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-4">
                            {SPECIES.map((species, index) => (
                                <Reveal key={species.name} delay={index * 50}>
                                    <Link
                                        href={`/guides?q=${encodeURIComponent(species.name)}`}
                                        className="block"
                                    >
                                        <div
                                            className={`specimen-tile aspect-[4/5] ${species.tone}`}
                                        >
                                            <img
                                                src={species.image}
                                                alt={species.name}
                                                loading="lazy"
                                                width="600"
                                                height="750"
                                                className="drift"
                                            />
                                        </div>
                                        <p className="pt-2 text-[16px] font-medium">
                                            {species.name}
                                        </p>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </aside>
                </div>

                {relatedGuides?.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-[20px] font-medium tracking-[-0.02em]">
                            Panduan terkait
                        </h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            {relatedGuides.map((related, index) => (
                                <Reveal key={related.id} delay={index * 50}>
                                    <Link
                                        href={`/guides/${related.id}`}
                                        className="block h-full bg-surface p-4 hover:bg-field3/50"
                                    >
                                        <p className="text-[13px] text-muted">
                                            {related.category}
                                        </p>
                                        <p className="mt-2 text-[16px] font-medium leading-snug">
                                            {related.title}
                                        </p>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </AppLayout>
    );
}
