import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    TrendingUp, 
    Fish, 
    Waves, 
    Store, 
    ShieldCheck, 
    BookOpen, 
    ArrowRight,
    Tag,
    X,
    HeartPulse,
    Lightbulb,
    ChevronRight,
    Dna
} from 'lucide-react';
import BrandLogo from '@/Components/BrandLogo';

const TIPS = [
    {
        title: 'Aklimatisasi Suhu',
        text: 'Apungkan kantong ikan di akuarium selama 15-20 menit sebelum dilepas agar suhu air menyesuaikan perlahan.',
    },
    {
        title: 'Stabilitas pH Air',
        text: 'pH stabil jauh lebih aman bagi ikan daripada memaksakan angka tertentu dengan bahan kimia drastis.',
    },
    {
        title: 'Klaim Garansi D.O.A.',
        text: 'Rekam video unboxing utuh tanpa jeda dari paket tersegel untuk klaim garansi ikan hidup 100%.',
    },
    {
        title: 'Pemberian Pakan',
        text: 'Beri pakan sedikit demi sedikit 1-2 kali sehari. Sisa pakan yang tenggelam memicu lonjakan amonia.',
    },
];

export default function Sidebar({ isOpen, onClose }) {
    const { url } = usePage();
    const [tipIndex, setTipIndex] = useState(0);

    const nextTip = () => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
    };

    const currentTip = TIPS[tipIndex];

    const navItems = [
        {
            label: 'Trends',
            sublabel: 'Spesimen Trending',
            icon: TrendingUp,
            href: '/products?sort=popular',
            active: url.includes('sort=popular'),
            badge: 'Hot',
            flyout: {
                title: 'Spesimen Trending & Populer',
                description: 'Koleksi mutasi genetik dan spesimen paling banyak diminati penghobi.',
                links: [
                    { label: 'The Most Trending 100', href: '/products?sort=popular', badge: '100+' },
                    { label: 'Mutasi Rilis Terbaru', href: '/products?sort=newest', badge: 'Baru' },
                    { label: 'Spesimen Show Grade Kontes', href: '/products?category=ikan-hias' },
                    { label: 'Ikan Bergaransi D.O.A. 100%', href: '/products?sort=popular' },
                ],
                footerLink: { label: 'Lihat Semua Koleksi Tren', href: '/products?sort=popular' }
            }
        },
        {
            label: 'Air Tawar',
            sublabel: 'Freshwater Morphs',
            icon: Fish,
            href: '/products?water_type=freshwater',
            active: url.includes('water_type=freshwater'),
            badge: '5 Spesies',
            flyout: {
                title: 'Katalog Ikan Air Tawar & Mutasi',
                description: 'Spesies captive-bred air tawar terpopuler dengan taksonomi morfologi.',
                links: [
                    { label: 'Cupang / Betta Morphs (Halfmoon, Plakat, Rosetail)', href: '/products?category=ikan-hias&q=cupang', badge: 'Show' },
                    { label: 'Channa / Snakehead (Maru Yellow Sentarum, Auranti)', href: '/products?category=ikan-hias&q=channa', badge: 'Predator' },
                    { label: 'Ikan Discus Cichlid (Pigeon Blood, Blue Diamond)', href: '/products?category=ikan-hias&q=discus', badge: 'Eksotis' },
                    { label: 'Guppy Galur Murni (Albino Full Red / AFR, Moscow)', href: '/products?category=ikan-hias&q=guppy', badge: 'Pure' },
                    { label: 'Neon Tetra & Nano Schooling Community', href: '/products?water_type=freshwater&q=tetra' },
                ],
                footerLink: { label: 'Jelajahi Semua Spesimen Air Tawar', href: '/products?water_type=freshwater' }
            }
        },
        {
            label: 'Air Laut',
            sublabel: 'Saltwater & Reef',
            icon: Waves,
            href: '/products?water_type=saltwater',
            active: url.includes('water_type=saltwater'),
            flyout: {
                title: 'Katalog Air Laut & Marine Reef',
                description: 'Spesimen biota laut teraklimatisasi dan aman untuk akuarium terumbu.',
                links: [
                    { label: 'Clownfish Captive-Bred (Amphiprion)', href: '/products?water_type=saltwater&q=clownfish', badge: 'Captive' },
                    { label: 'Surgeonfish & Blue Tang', href: '/products?water_type=saltwater' },
                    { label: 'Terumbu Karang & Coral Frags', href: '/products?water_type=saltwater' },
                    { label: 'Invertebrata Pembersih Karang', href: '/products?water_type=saltwater' },
                ],
                footerLink: { label: 'Jelajahi Semua Biota Laut', href: '/products?water_type=saltwater' }
            }
        },
        {
            label: 'Penangkar',
            sublabel: 'Verified Breeders',
            icon: Store,
            href: '/products',
            active: url === '/products' && !url.includes('?'),
            flyout: {
                title: 'Direktori Penangkar Terakreditasi',
                description: 'Beli langsung dari peternak dan farm resmi di seluruh nusantara.',
                links: [
                    { label: 'Aquatic Heritage Farm (Kota Bandung)', href: '/stores/aquatic-heritage-farm', badge: 'Verified' },
                    { label: 'Nusantara Aquascape (Jakarta Barat)', href: '/stores/nusantara-aquascape', badge: 'Verified' },
                    { label: 'Buka Toko Penangkar Baru (Daftarkan Farm)', href: '/seller/register', badge: 'Daftar' },
                ],
                footerLink: { label: 'Lihat Seluruh Direktori Penangkar', href: '/products' }
            }
        },
        {
            label: 'Discounts',
            sublabel: 'Garansi D.O.A.',
            badge: 'to 70%',
            icon: Tag,
            href: '/products?min_price=1',
            active: url.includes('min_price'),
            flyout: {
                title: 'Promo & Diskon Spesimen',
                description: 'Penawaran harga terbaik langsung dari breeder dengan jaminan D.O.A.',
                links: [
                    { label: 'Spesimen Diskon Hingga 70%', href: '/products?min_price=1', badge: 'To 70%' },
                    { label: 'Paket Schooling Hemat (Multi-Pack)', href: '/products?q=paket' },
                    { label: 'Garansi D.O.A. 100% Hidup Sampai Tujuan', href: '/products?category=ikan-hias' },
                ],
                footerLink: { label: 'Buka Semua Produk Promo', href: '/products?min_price=1' }
            }
        },
        {
            label: 'Panduan',
            sublabel: 'Care Guides',
            icon: BookOpen,
            href: '/guides',
            active: url.startsWith('/guides'),
            flyout: {
                title: 'Fishpedia & Panduan Perawatan',
                description: 'Edukasi parameter air, karantina, dan aklimatisasi spesimen baru.',
                links: [
                    { label: 'Aklimatisasi Suhu & Pelepasan Ikan Baru', href: '/guides' },
                    { label: 'Menjaga Stabilitas pH Air & Siklus Nitrogen', href: '/guides' },
                    { label: 'Prosedur Video Unboxing & Klaim D.O.A.', href: '/guides' },
                    { label: 'Pencegahan & Pengobatan White Spot (Ich)', href: '/guides' },
                ],
                footerLink: { label: 'Buka Seluruh Artikel Fishpedia', href: '/guides' }
            }
        },
    ];

    return (
        <>
            {/* Desktop Sidebar: Hover-Responsive Rail (No clicking required!) */}
            <div className="hidden md:block relative shrink-0 h-full z-40 select-none group/sidebar">
                {/* Fixed Spacer (Holds page layout stable at w-20) */}
                <div className="h-full w-20 transition-all duration-300 ease-in-out" />

                {/* Floating Drawer Surface: Expands smoothly on hover */}
                <aside
                    className="absolute top-0 left-0 h-full bg-white border-r border-[#1E80A0]/10 flex flex-col justify-between transition-all duration-300 ease-in-out z-40 w-20 group-hover/sidebar:w-64 lg:group-hover/sidebar:w-72 group-hover/sidebar:shadow-2xl group-hover/sidebar:border-[#1E80A0]/25"
                >
                    {/* Top Section: Brand + Navigation */}
                    <div className="p-4 lg:p-5 flex-1 flex flex-col min-h-0 overflow-visible">
                        {/* Brand Header: Centered logo unhovered, expands on hover (No toggle button!) */}
                        <div className="flex items-center justify-between pb-5 border-b border-[#1E80A0]/10">
                            {/* Icon-only mode header (visible when unhovered) */}
                            <div className="w-full flex justify-center group-hover/sidebar:hidden">
                                <Link 
                                    href="/" 
                                    className="w-10 h-10 rounded-xl bg-[#0a0a0a] text-white flex items-center justify-center shadow-xs hover:scale-105 border border-neutral-800 transition"
                                    title="Dunia Ikan : MorphMarket Aquatic"
                                >
                                    <BrandLogo className="w-5 h-5 text-white" />
                                </Link>
                            </div>

                            {/* Expanded header (revealed automatically on hover) */}
                            <div className="w-full hidden group-hover/sidebar:flex items-center">
                                <Link href="/" className="flex items-center gap-3 group min-w-0">
                                    <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] text-white flex items-center justify-center shadow-xs group-hover:scale-105 border border-neutral-800 transition shrink-0">
                                        <BrandLogo className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-extrabold tracking-widest text-[#001454] uppercase leading-none truncate">
                                            DUNIA IKAN
                                        </span>
                                        <span className="text-[9px] font-bold tracking-wider text-[#1E80A0] uppercase mt-0.5 truncate">
                                            MorphMarket Edition
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Nav Items with MorphMarket Hover Flyouts */}
                        <nav className="mt-5 space-y-1 relative">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                const isItemActive = item.active;
                                const isLowerItem = index >= 4;

                                return (
                                    <div
                                        key={item.label}
                                        className="relative group/nav"
                                    >
                                        <Link
                                            href={item.href}
                                            className={`flex items-center rounded-xl transition-all w-11 h-11 mx-auto justify-center group-hover/sidebar:w-full group-hover/sidebar:px-3.5 group-hover/sidebar:py-2.5 group-hover/sidebar:justify-between ${
                                                isItemActive
                                                    ? 'bg-[#001454] text-white shadow-xs'
                                                    : 'text-[#3d4949] hover:text-[#001454] hover:bg-[#f3f2ff]'
                                            }`}
                                            title={item.label}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Icon className={`w-4 h-4 shrink-0 transition ${
                                                    isItemActive ? 'text-[#4AB8BD]' : 'text-[#1E80A0] group-hover/nav:text-[#001454]'
                                                }`} />
                                                <span className="text-xs font-semibold truncate hidden group-hover/sidebar:inline">
                                                    {item.label}
                                                </span>
                                            </div>

                                            {/* Badges & Arrow */}
                                            <div className="items-center gap-1.5 shrink-0 hidden group-hover/sidebar:flex">
                                                {item.badge && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE4B0] text-[#001454]">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                <ChevronRight className="w-3.5 h-3.5 text-[#1E80A0]/60 group-hover/nav:text-[#001454] transition-transform group-hover/nav:translate-x-0.5" />
                                            </div>
                                        </Link>

                                        {/* MorphMarket Hover Flyout Card (Opens INSTANTLY on hover without clicking!) */}
                                        {item.flyout && (
                                            <div
                                                className={`absolute left-full ${
                                                    isLowerItem ? 'bottom-0' : 'top-0'
                                                } ml-2.5 z-50 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#1E80A0]/15 p-4 space-y-3 opacity-0 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:pointer-events-auto transition-all duration-200 transform translate-x-1 group-hover/nav:translate-x-0 before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-4 before:content-['']`}
                                            >
                                                {/* Header */}
                                                <div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#001454] flex items-center gap-1.5">
                                                            <Dna className="w-3.5 h-3.5 text-[#4AB8BD]" />
                                                            <span>{item.flyout.title}</span>
                                                        </h4>
                                                        {item.badge && (
                                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFE4B0] text-[#001454]">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-[#6d797a] mt-1 leading-relaxed">
                                                        {item.flyout.description}
                                                    </p>
                                                </div>

                                                {/* Sub-links */}
                                                <div className="space-y-1 border-t border-[#1E80A0]/10 pt-2">
                                                    {item.flyout.links.map((link) => (
                                                        <Link
                                                            key={link.label}
                                                            href={link.href}
                                                            className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-[#001454] hover:bg-[#f3f2ff] hover:text-[#0684E5] transition group/sub"
                                                        >
                                                            <span className="truncate">{link.label}</span>
                                                            {link.badge && (
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#ececff] text-[#1E80A0] shrink-0 ml-1">
                                                                    {link.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Footer link */}
                                                {item.flyout.footerLink && (
                                                    <div className="pt-2 border-t border-[#1E80A0]/10">
                                                        <Link
                                                            href={item.flyout.footerLink.href}
                                                            className="text-[11px] font-bold text-[#0684E5] hover:text-[#0060aa] flex items-center justify-between"
                                                        >
                                                            <span>{item.flyout.footerLink.label}</span>
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Special Features Nav */}
                        <div className="mt-6 pt-5 border-t border-[#1E80A0]/10 space-y-1.5 hidden group-hover/sidebar:block">
                            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#1E80A0]">
                                Fitur Spesial
                            </p>
                            <Link
                                href="/guides"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#3d4949] hover:text-[#001454] hover:bg-[#f3f2ff] transition"
                            >
                                <HeartPulse className="w-4 h-4 text-[#4AB8BD] shrink-0" />
                                <span>Pusat Kesehatan Ikan</span>
                            </Link>
                            <Link
                                href="/products?category=ikan-hias"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#3d4949] hover:text-[#001454] hover:bg-[#f3f2ff] transition"
                            >
                                <ShieldCheck className="w-4 h-4 text-[#0684E5] shrink-0" />
                                <span>Garansi D.O.A. 100%</span>
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Section: TIPS OF THE DAY Widget */}
                    {/* Compact Icon (Visible when not hovered) */}
                    <div className="p-3 border-t border-[#1E80A0]/10 flex justify-center group-hover/sidebar:hidden">
                        <button
                            type="button"
                            onClick={nextTip}
                            className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#1E80A0] hover:text-[#0684E5] flex items-center justify-center border border-[#1E80A0]/20 hover:bg-[#ececff] transition"
                            title={`Tip: ${currentTip.title}`}
                        >
                            <Lightbulb className="w-4 h-4 text-[#0684E5]" />
                        </button>
                    </div>

                    {/* Full Card (Revealed on hover) */}
                    <div className="p-4 border-t border-[#1E80A0]/10 shrink-0 hidden group-hover/sidebar:block">
                        <div className="bg-[#f3f2ff] rounded-2xl p-4 border border-[#1E80A0]/15 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E80A0]">
                                TIPS OF THE DAY
                            </p>
                            <h5 className="text-xs font-extrabold text-[#001454] leading-tight">
                                {currentTip.title}
                            </h5>
                            <p className="text-[11px] text-[#3d4949] leading-relaxed line-clamp-3">
                                {currentTip.text}
                            </p>
                            <div className="pt-1 flex items-center justify-between text-[11px] font-medium text-[#1E80A0]">
                                <span>{tipIndex + 1} of {TIPS.length}</span>
                                <button
                                    type="button"
                                    onClick={nextTip}
                                    className="text-[#0684E5] hover:text-[#0060aa] font-bold flex items-center gap-1 transition"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Mobile Drawer (Screens < 768px) */}
            <div 
                className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div 
                    onClick={onClose} 
                    className="fixed inset-0 bg-[#001454]/40 backdrop-blur-xs" 
                />

                {/* Sliding Drawer */}
                <aside 
                    className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out ${
                        isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="p-5 flex-1 flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between pb-5 border-b border-[#1E80A0]/10">
                            <Link href="/" onClick={onClose} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center shadow-xs border border-neutral-800">
                                    <BrandLogo className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-extrabold tracking-widest text-[#001454] uppercase leading-none">
                                        DUNIA IKAN
                                    </span>
                                    <span className="text-[9px] font-bold tracking-wider text-[#1E80A0] uppercase mt-0.5">
                                        MorphMarket Edition
                                    </span>
                                </div>
                            </Link>

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 text-[#1E80A0] hover:text-[#001454] rounded-lg hover:bg-[#f3f2ff]"
                                aria-label="Tutup Menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="mt-5 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                                            item.active
                                                ? 'bg-[#001454] text-white shadow-xs'
                                                : 'text-[#3d4949] hover:text-[#001454] hover:bg-[#f3f2ff]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-[#4AB8BD]' : 'text-[#1E80A0]'}`} />
                                            <span className="truncate">{item.label}</span>
                                        </div>
                                        {item.badge && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE4B0] text-[#001454]">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-6 pt-5 border-t border-[#1E80A0]/10 space-y-1.5">
                            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#1E80A0]">
                                Fitur Spesial
                            </p>
                            <Link
                                href="/guides"
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#3d4949] hover:text-[#001454] hover:bg-[#f3f2ff] transition"
                            >
                                <HeartPulse className="w-4 h-4 text-[#4AB8BD] shrink-0" />
                                <span>Pusat Kesehatan Ikan</span>
                            </Link>
                            <Link
                                href="/products?category=ikan-hias"
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#3d4949] hover:text-[#001454] hover:bg-[#f3f2ff] transition"
                            >
                                <ShieldCheck className="w-4 h-4 text-[#0684E5] shrink-0" />
                                <span>Garansi D.O.A. 100%</span>
                            </Link>
                        </div>
                    </div>

                    <div className="p-4 border-t border-[#1E80A0]/10">
                        <div className="bg-[#f3f2ff] rounded-2xl p-4 border border-[#1E80A0]/15 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E80A0]">
                                TIPS OF THE DAY
                            </p>
                            <h5 className="text-xs font-extrabold text-[#001454] leading-tight">
                                {currentTip.title}
                            </h5>
                            <p className="text-[11px] text-[#3d4949] leading-relaxed">
                                {currentTip.text}
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
