import { Link } from '@inertiajs/react';
import Reveal from '@/Components/Reveal';
import BrandWordmark from '@/Components/BrandWordmark';

const CATALOGUE = [
    {
        name: 'Cupang halfmoon',
        image: '/images/products/cupang-halfmoon.jpg',
        tone: 'field1',
    },
    {
        name: 'Guppy albino full red',
        image: '/images/products/guppy-albino-full-red.jpg',
        tone: 'field4',
    },
    {
        name: 'Channa marulioides',
        image: '/images/products/channa-maru.jpg',
        tone: 'field3',
    },
    {
        name: 'Discus blue diamond',
        image: '/images/products/discus-pigeon-blood.jpg',
        tone: 'field2',
    },
];

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-bone text-ink">
            <header className="container-page">
                <div className="flex h-[72px] items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center"
                    >
                        <BrandWordmark className="h-8" />
                    </Link>
                    <Link
                        href="/"
                        className="press text-[16px] underline decoration-1 underline-offset-4 hover:text-accent"
                    >
                        Kembali ke beranda
                    </Link>
                </div>
            </header>

            <main className="container-page pb-16 pt-6 md:pt-10">
                <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
                    <Reveal className="order-2 min-w-0 lg:order-1 lg:col-span-7">
                        <div className="specimen-tile specimen-tile--bleed aspect-[4/5] field4">
                            <img
                                src="/images/products/aquarium-rimless.jpg"
                                alt="Penangkar menata akuarium air tawar"
                                className="drift"
                                width="800"
                                height="1000"
                            />
                        </div>
                        <p className="mt-2 text-[13px] text-muted">
                            Penangkar menata akuarium tanamannya.
                        </p>
                    </Reveal>

                    <div className="order-1 min-w-0 lg:order-2 lg:col-span-5">
                        <Reveal delay={80}>
                            <div>{children}</div>
                        </Reveal>

                        <div className="mt-10">
                            <p className="text-[16px] font-medium">
                                Dari katalog
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                {CATALOGUE.map((item, index) => (
                                    <Reveal
                                        key={item.name}
                                        delay={120 + index * 40}
                                    >
                                        <div
                                            className={`specimen-tile aspect-[4/5] ${item.tone}`}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                loading="lazy"
                                                width="400"
                                                height="500"
                                                className="drift"
                                            />
                                        </div>
                                        <p className="pt-1.5 text-[13px] text-muted">
                                            {item.name}
                                        </p>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
