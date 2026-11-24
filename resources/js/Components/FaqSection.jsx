import { useMemo, useState } from 'react';
import { Check, Minus, Plus, Search, X } from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';

const FAQ_GROUPS = [
    {
        id: 'shopping',
        label: { id: 'Belanja & Katalog', en: 'Shopping & Catalog' },
        items: [
            {
                id: 'shopping-water-type',
                idCopy: {
                    question: 'Bagaimana cara memilih ikan air tawar, air laut, atau air payau di katalog?',
                    answer: 'Buka menu Katalog di header lalu pilih filter Tipe Air (Air Tawar, Air Laut, atau Air Payau). Setiap halaman produk juga menampilkan parameter pH, suhu air ideal, ukuran, dan tingkat perawatan ikan.',
                },
                enCopy: {
                    question: 'How do I browse freshwater, saltwater, or brackish fish in the catalog?',
                    answer: 'Open Catalog from the header and use the Water Type filter (Freshwater, Saltwater, or Brackish). Every product listing includes ideal pH, temperature range, size stage, and care level.',
                },
            },
            {
                id: 'shopping-captive-bred',
                idCopy: {
                    question: 'Apakah semua ikan di Dunia Ikan berasal dari penangkar terverifikasi?',
                    answer: 'Setiap toko penangkar yang tampil di katalog telah melalui proses verifikasi admin. Asal pembiakan seperti Captive Bred atau Farm Raised dicantumkan langsung pada detail biologis masing-masing ikan.',
                },
                enCopy: {
                    question: 'Are fish on Dunia Ikan listed by verified breeders?',
                    answer: 'Every breeder store visible in the catalog is reviewed by an admin before selling. Breeding origin such as Captive Bred or Farm Raised is listed directly in each fish biological profile.',
                },
            },
            {
                id: 'shopping-beginner',
                idCopy: {
                    question: 'Bagaimana cara tahu ikan mana yang cocok untuk pemula?',
                    answer: 'Gunakan filter Tingkat Perawatan di halaman Katalog dan pilih Pemula, atau tanyakan langsung ke Kiko mengenai ukuran akuarium dan jenis ikan yang ingin Anda pelihara.',
                },
                enCopy: {
                    question: 'How can I tell which fish are suitable for beginners?',
                    answer: 'Select Beginner under the Care Level filter on the Catalog page, or ask Kiko about your tank size and the species you plan to keep.',
                },
            },
        ],
    },
    {
        id: 'shipping',
        label: { id: 'Pengiriman & Garansi DOA', en: 'Shipping & DOA Guarantee' },
        items: [
            {
                id: 'shipping-doa',
                idCopy: {
                    question: 'Apakah garansi ikan hidup 100% berlaku di seluruh Indonesia?',
                    answer: 'Ya, setiap pengiriman ikan hias dari penangkar terverifikasi dilindungi garansi DOA (Dead on Arrival) sesuai kebijakan masing-masing toko dengan syarat melampirkan video unboxing utuh tanpa jeda saat paket diterima.',
                },
                enCopy: {
                    question: 'Does the 100% live arrival guarantee apply across Indonesia?',
                    answer: 'Yes, ornamental fish shipments from verified breeders are covered by each store DOA (Dead on Arrival) guarantee when you provide an unedited unboxing video upon delivery.',
                },
            },
            {
                id: 'shipping-packing',
                idCopy: {
                    question: 'Bagaimana standar packing agar ikan tetap aman selama pengiriman?',
                    answer: 'Penangkar menggunakan kantong oksigen ganda bertekanan, air yang sudah dikondisikan, serta boks styrofoam atau insulasi thermal sesuai jarak dan durasi perjalanan.',
                },
                enCopy: {
                    question: 'What packing standards keep fish safe during shipping?',
                    answer: 'Breeders pack fish in double pressurized oxygen bags with conditioned water inside insulated styrofoam or thermal boxes matched to transit distance.',
                },
            },
            {
                id: 'shipping-claim',
                idCopy: {
                    question: 'Bagaimana cara mengajukan klaim jika ikan tiba dalam kondisi bermasalah?',
                    answer: 'Rekam video unboxing sejak segel paket masih utuh hingga kantong ikan terlihat jelas, lalu hubungi toko terkait melalui detail pesanan Anda pada batas waktu klaim yang tertera di kebijakan DOA toko.',
                },
                enCopy: {
                    question: 'How do I submit a claim if a fish arrives unhealthy or DOA?',
                    answer: 'Record a continuous unboxing video starting before opening the seal until the fish bag is clearly visible, then reach out through your order details within the store DOA claim window.',
                },
            },
        ],
    },
    {
        id: 'payments',
        label: { id: 'Pembayaran & Pesanan', en: 'Payments & Orders' },
        items: [
            {
                id: 'payments-methods',
                idCopy: {
                    question: 'Metode pembayaran apa saja yang tersedia saat checkout?',
                    answer: 'Anda dapat membayar melalui payment gateway Midtrans, transfer bank manual, QRIS, maupun COD (bayar di tempat) sesuai metode yang didukung pada halaman Checkout.',
                },
                enCopy: {
                    question: 'Which payment methods are supported at checkout?',
                    answer: 'You can pay via Midtrans payment gateway, manual bank transfer, QRIS, or Cash on Delivery (COD) depending on the options available at checkout.',
                },
            },
            {
                id: 'payments-escrow',
                idCopy: {
                    question: 'Kapan dana pembayaran diteruskan ke toko penangkar?',
                    answer: 'Dana pembayaran ditahan terlebih dahulu oleh sistem dan baru diteruskan setelah pesanan dikonfirmasi diterima dalam kondisi baik atau melewati batas waktu konfirmasi.',
                },
                enCopy: {
                    question: 'When is payment released to the breeder store?',
                    answer: 'Payment is held by the platform first and released only after you confirm the order arrived in good condition or the confirmation window closes.',
                },
            },
            {
                id: 'payments-multi-store',
                idCopy: {
                    question: 'Bagaimana jika saya membeli ikan dari beberapa toko sekaligus?',
                    answer: 'Pesanan otomatis dipisahkan per toko agar biaya ongkir, packing oksigen, nomor resi, dan kebijakan garansi DOA setiap penangkar tercatat rapi di halaman Pesanan.',
                },
                enCopy: {
                    question: 'What happens if I buy fish from multiple stores in one checkout?',
                    answer: 'Orders are automatically split per store so shipping costs, oxygen packing, tracking numbers, and each breeder DOA policy stay clearly tracked on your Orders page.',
                },
            },
        ],
    },
    {
        id: 'sellers',
        label: { id: 'Penjual & Buka Toko', en: 'Sellers & Opening a Store' },
        items: [
            {
                id: 'sellers-register',
                idCopy: {
                    question: 'Apakah penangkar atau toko aquascape bisa berjualan di Dunia Ikan?',
                    answer: 'Bisa. Anda dapat memilih opsi Ingin Berjualan saat mendaftar akun atau mengajukan pembukaan toko melalui menu Buka Toko. Setelah disetujui admin, Anda langsung bisa mengelola katalog stok, harga, dan pesanan.',
                },
                enCopy: {
                    question: 'Can breeders or aquascape shops sell on Dunia Ikan?',
                    answer: 'Yes. Select Sell on Platform during sign-up or apply via the Open Store menu. Once approved by an admin, you can manage fish listings, inventory, pricing, and orders.',
                },
            },
            {
                id: 'sellers-requirements',
                idCopy: {
                    question: 'Informasi apa yang perlu disiapkan saat mendaftarkan toko?',
                    answer: 'Siapkan nama toko atau farm, kota domisili, nomor kontak aktif, rekening pencairan dana, serta kebijakan garansi DOA yang jelas untuk calon pembeli.',
                },
                enCopy: {
                    question: 'What information is required when registering a store?',
                    answer: 'Prepare your store or farm name, city location, active contact number, payout bank details, and a clear DOA live arrival guarantee policy for buyers.',
                },
            },
        ],
    },
    {
        id: 'assistant',
        label: { id: 'Asisten Kiko & Komunitas', en: 'Kiko AI & Community' },
        items: [
            {
                id: 'assistant-kiko',
                idCopy: {
                    question: 'Apa saja yang bisa dibantu oleh asisten Kiko?',
                    answer: 'Kiko membantu konsultasi awal perawatan akuarium, pengecekan kualitas air, gejala awal kesehatan ikan berdasarkan panduan resmi Dunia Ikan, serta rekomendasi produk yang stoknya sedang tersedia.',
                },
                enCopy: {
                    question: 'What can Kiko assistant help me with?',
                    answer: 'Kiko assists with aquarium care tips, water parameter checks, initial fish health guidance based on official Dunia Ikan guides, and in-stock product recommendations.',
                },
            },
            {
                id: 'assistant-disclaimer',
                idCopy: {
                    question: 'Apakah saran kesehatan dari Kiko menggantikan dokter hewan?',
                    answer: 'Tidak. Jawaban Kiko bersifat panduan pertolongan pertama dan evaluasi parameter air. Untuk gejala berat atau ikan yang sangat lemas, tetap konsultasikan ke ahli kesehatan ikan atau dokter hewan akuatik.',
                },
                enCopy: {
                    question: 'Does Kiko health guidance replace an aquatic veterinarian?',
                    answer: 'No. Kiko provides first-aid steps and water quality checks only. For severe symptoms or critically ill fish, consult an aquatic veterinarian or fish health specialist.',
                },
            },
        ],
    },
];

export default function FaqSection() {
    const { pick, isEn } = useLanguage();
    const [activeTopic, setActiveTopic] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openId, setOpenId] = useState(FAQ_GROUPS[0].items[0].id);

    const topics = useMemo(
        () => [
            { id: 'all', label: pick('Semua Topik', 'All Topics') },
            ...FAQ_GROUPS.map((group) => ({
                id: group.id,
                label: isEn ? group.label.en : group.label.id,
            })),
        ],
        [isEn, pick],
    );

    const visibleGroups = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return FAQ_GROUPS.filter((group) => activeTopic === 'all' || group.id === activeTopic)
            .map((group) => {
                const groupLabel = isEn ? group.label.en : group.label.id;
                const filteredItems = group.items
                    .map((item) => ({
                        id: item.id,
                        ...(isEn ? item.enCopy : item.idCopy),
                    }))
                    .filter((item) => {
                        if (!normalizedQuery) {
                            return true;
                        }
                        return (
                            item.question.toLowerCase().includes(normalizedQuery) ||
                            item.answer.toLowerCase().includes(normalizedQuery) ||
                            groupLabel.toLowerCase().includes(normalizedQuery)
                        );
                    });

                return {
                    id: group.id,
                    label: groupLabel,
                    items: filteredItems,
                };
            })
            .filter((group) => group.items.length > 0);
    }, [activeTopic, searchQuery, isEn]);

    const handleSelectTopic = (topicId) => {
        setActiveTopic(topicId);
        const firstMatchingGroup = FAQ_GROUPS.find((g) => topicId === 'all' || g.id === topicId);
        if (firstMatchingGroup?.items[0]) {
            setOpenId(firstMatchingGroup.items[0].id);
        }
    };

    const handleOpenChat = () => {
        window.dispatchEvent(new CustomEvent('dunia-ikan:open-chat'));
    };

    return (
        <section
            id="faq"
            aria-labelledby="faq-heading"
            className="rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#0b1324] border border-[#005A9D]/12 dark:border-[#60C2E6]/15 px-5 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                {/* 1. LEFT SIDEBAR (sticky on desktop): Title + Search + Topics + Compact Support CTA */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    <h2
                        id="faq-heading"
                        className="text-3xl sm:text-[34px] lg:text-[36px] font-semibold tracking-[-0.03em] leading-[1.12] text-[#14335D] dark:text-white"
                    >
                        {pick('Pertanyaan yang', 'Frequently Asked')}
                        <br />
                        {pick('Sering Ditanya', 'Questions')}
                    </h2>

                    {/* Search Input */}
                    <div className="relative">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500"
                        />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label={pick('Cari pertanyaan FAQ', 'Search FAQ questions')}
                            placeholder={pick('Cari pertanyaan...', 'Search')}
                            className="w-full h-11 rounded-xl bg-white dark:bg-[#0f1a30] border border-slate-200/90 dark:border-slate-700/80 pl-10 pr-9 text-sm text-[#14335D] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#005A9D] dark:focus:border-[#60C2E6] focus:ring-2 focus:ring-[#005A9D]/15 dark:focus:ring-[#60C2E6]/20 focus:outline-none transition-colors"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                aria-label={pick('Hapus pencarian', 'Clear search')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-[#14335D] dark:hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Topic Tabs: Horizontal scroll pills on mobile */}
                    <div
                        role="tablist"
                        aria-label={pick('Topik FAQ', 'FAQ Topics')}
                        className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
                    >
                        {topics.map((topic) => {
                            const isActive = activeTopic === topic.id;
                            return (
                                <button
                                    key={topic.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => handleSelectTopic(topic.id)}
                                    className={`shrink-0 min-h-[40px] rounded-full px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                                        isActive
                                            ? 'bg-[#005A9D] text-white dark:bg-[#60C2E6] dark:text-[#0b1324] font-semibold'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 dark:bg-[#111c33] dark:text-slate-300 dark:hover:bg-[#162542]'
                                    }`}
                                >
                                    {topic.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Topic List: Minimal vertical list with active blue left edge on desktop */}
                    <nav
                        aria-label={pick('Topik FAQ', 'FAQ Topics')}
                        className="hidden lg:block border-t border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/80"
                    >
                        {topics.map((topic) => {
                            const isActive = activeTopic === topic.id;
                            return (
                                <button
                                    key={topic.id}
                                    type="button"
                                    aria-current={isActive ? 'true' : undefined}
                                    onClick={() => handleSelectTopic(topic.id)}
                                    className={`relative w-full text-left py-3 pl-3.5 pr-2 text-[13.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] dark:focus-visible:ring-[#60C2E6] rounded-r-lg ${
                                        isActive
                                            ? 'font-semibold text-[#14335D] dark:text-white'
                                            : 'font-medium text-slate-500 hover:text-[#14335D] dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {isActive && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-0 top-2 bottom-2 w-[2.5px] rounded-full bg-[#005A9D] dark:bg-[#60C2E6]"
                                        />
                                    )}
                                    {topic.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Compact Support CTA Card (desktop sidebar) */}
                    <div className="hidden lg:block rounded-2xl bg-[#f4f9fc] dark:bg-[#111c33] border border-[#005A9D]/10 dark:border-[#60C2E6]/15 p-5">
                        <h3 className="text-[15px] font-semibold text-[#14335D] dark:text-white">
                            {pick('Masih ada pertanyaan?', 'Still have questions?')}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            {pick(
                                'Belum menemukan jawaban yang dicari? Tanyakan langsung ke asisten Kiko.',
                                "Didn't find the answer you need? Feel free to ask Kiko directly.",
                            )}
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenChat}
                            className="mt-4 w-full min-h-[44px] rounded-xl border border-slate-300/90 dark:border-slate-600 bg-white dark:bg-[#14335D]/50 hover:border-[#005A9D] hover:text-[#005A9D] dark:hover:border-[#60C2E6] dark:hover:text-[#A1E1EF] px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#14335D] dark:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] dark:focus-visible:ring-[#60C2E6]"
                        >
                            {pick('Tanya Kiko', 'Contact Support')}
                        </button>
                    </div>
                </div>

                {/* 2. RIGHT COLUMN: Grouped Category Pills + Standalone Accordion Cards */}
                <div className="lg:col-span-8">
                    {visibleGroups.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-[#f8fcfe] dark:bg-[#111c33]/60 px-6 py-10 text-center">
                            <p className="text-sm font-semibold text-[#14335D] dark:text-white">
                                {pick(
                                    `Tidak ada pertanyaan yang cocok dengan "${searchQuery.trim()}"`,
                                    `No questions matched "${searchQuery.trim()}"`,
                                )}
                            </p>
                            <p className="mt-1.5 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
                                {pick(
                                    'Coba kata kunci lain seperti garansi, packing, pembayaran, atau tanyakan langsung ke Kiko.',
                                    'Try another keyword such as guarantee, packing, payment, or ask Kiko directly.',
                                )}
                            </p>
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveTopic('all');
                                    }}
                                    className="min-h-[40px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f1a30] px-4 py-2 text-xs font-semibold text-[#14335D] dark:text-white hover:border-[#005A9D] dark:hover:border-[#60C2E6] transition-colors"
                                >
                                    {pick('Reset Pencarian', 'Reset Search')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOpenChat}
                                    className="min-h-[40px] rounded-xl bg-[#005A9D] hover:bg-[#00477C] dark:bg-[#60C2E6] dark:hover:bg-[#A1E1EF] px-4 py-2 text-xs font-semibold text-white dark:text-[#0b1324] transition-colors"
                                >
                                    {pick('Tanya Kiko', 'Ask Kiko')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
                            {visibleGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="py-7 sm:py-8 first:pt-0 last:pb-0"
                                >
                                    <span className="inline-flex items-center rounded-full bg-[#e6f4fa] dark:bg-[#14335D]/80 px-3.5 py-1 text-xs font-medium text-[#005A9D] dark:text-[#A1E1EF]">
                                        {group.label}
                                    </span>

                                    <div className="mt-4 space-y-2.5">
                                        {group.items.map((item) => {
                                            const isExpanded = openId === item.id;
                                            const panelId = `faq-panel-${item.id}`;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`rounded-xl border transition-colors ${
                                                        isExpanded
                                                            ? 'bg-white dark:bg-[#111c33] border-[#005A9D]/30 dark:border-[#60C2E6]/35 shadow-[0_2px_12px_rgba(20,51,93,0.05)]'
                                                            : 'bg-white dark:bg-[#111c33]/75 border-slate-200/90 dark:border-slate-700/80 hover:border-[#005A9D]/35 dark:hover:border-[#60C2E6]/35'
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenId(isExpanded ? null : item.id)}
                                                        aria-expanded={isExpanded}
                                                        aria-controls={panelId}
                                                        className="w-full min-h-[52px] text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] dark:focus-visible:ring-[#60C2E6]"
                                                    >
                                                        <span className="text-sm sm:text-[15px] font-semibold leading-snug text-[#14335D] dark:text-white">
                                                            {item.question}
                                                        </span>
                                                        <span
                                                            aria-hidden="true"
                                                            className={`shrink-0 inline-flex items-center justify-center transition-colors ${
                                                                isExpanded
                                                                    ? 'text-[#005A9D] dark:text-[#60C2E6]'
                                                                    : 'text-slate-500 dark:text-slate-400'
                                                            }`}
                                                        >
                                                            {isExpanded ? (
                                                                <Minus className="w-4 h-4" strokeWidth={1.8} />
                                                            ) : (
                                                                <Plus className="w-4 h-4" strokeWidth={1.8} />
                                                            )}
                                                        </span>
                                                    </button>

                                                    {isExpanded && (
                                                        <div
                                                            id={panelId}
                                                            className="swap-in px-5 sm:px-6 pb-5 pt-0.5 pr-10 sm:pr-12"
                                                        >
                                                            <p className="text-xs sm:text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                                                                {item.answer}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. FULL-WIDTH HORIZONTAL STANDING KIKO AI INTRO BANNER */}
            <div className="group mt-10 sm:mt-12 rounded-2xl bg-gradient-to-r from-[#f0f9fd] via-white to-[#e6f4fa]/80 dark:from-[#101c36] dark:via-[#0e172c] dark:to-[#14335D]/55 border border-[#005A9D]/15 dark:border-[#60C2E6]/20 px-6 sm:px-8 lg:px-10 py-6 sm:py-7">
                <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-9">
                    {/* Standing Kiko Mascot */}
                    <div className="shrink-0 flex flex-col items-center">
                        <img
                            src="/images/kiko/standing.webp"
                            alt={pick('Maskot Kiko berdiri menyapa pengguna Dunia Ikan', 'Standing Kiko mascot waving hello')}
                            width={283}
                            height={367}
                            loading="lazy"
                            decoding="async"
                            className="w-32 sm:w-36 lg:w-40 h-auto object-contain select-none transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-[0_12px_18px_rgba(20,51,93,0.14)]"
                        />
                        <span
                            aria-hidden="true"
                            className="mt-0.5 block h-2 w-24 rounded-full bg-[#14335D]/10 dark:bg-black/40 blur-[2px]"
                        />
                    </div>

                    {/* Intro Copy + Capability Highlights */}
                    <div className="flex-1 min-w-0 text-center md:text-left">
                        <h3 className="text-lg sm:text-xl font-bold tracking-[-0.02em] text-[#14335D] dark:text-white">
                            {pick('Kenalan dengan Kiko AI', 'Meet Kiko AI')}
                        </h3>
                        <p className="mt-1.5 max-w-2xl text-xs sm:text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                            {pick(
                                'Asisten pintar Dunia Ikan yang siap menemani Anda memilih ikan hias, mengecek parameter air, dan membaca gejala awal kesehatan ikan.',
                                "Dunia Ikan's smart assistant ready to help you choose ornamental fish, check water parameters, and review early fish health signs.",
                            )}
                        </p>

                        <ul className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-xs font-medium text-[#14335D] dark:text-slate-200">
                            {[
                                pick('Panduan awal perawatan & kualitas air', 'Early care tips & water quality checks'),
                                pick('Rekomendasi ikan sesuai stok aktif', 'In-stock ornamental fish suggestions'),
                                pick('Bisa kirim foto kondisi ikan langsung', 'Send a fish photo for quick guidance'),
                            ].map((point) => (
                                <li key={point} className="inline-flex items-center gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#005A9D]/12 text-[#005A9D] dark:bg-[#60C2E6]/20 dark:text-[#A1E1EF]"
                                    >
                                        <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                                    </span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Primary Chat CTA */}
                    <div className="shrink-0 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={handleOpenChat}
                            className="w-full md:w-auto min-h-[44px] whitespace-nowrap rounded-xl bg-[#005A9D] hover:bg-[#00477C] dark:bg-[#60C2E6] dark:hover:bg-[#A1E1EF] px-6 py-2.5 text-xs sm:text-[13px] font-semibold text-white dark:text-[#0b1324] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] dark:focus-visible:ring-[#60C2E6]"
                        >
                            {pick('Coba Chat dengan Kiko', 'Chat with Kiko')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
