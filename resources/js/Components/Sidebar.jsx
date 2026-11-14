import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Sparkles, 
    Fish, 
    Waves, 
    Store, 
    ShieldCheck, 
    BookOpen, 
    PanelLeft, 
    ArrowRight,
    Tag,
    X,
    HeartPulse,
    Lightbulb
} from 'lucide-react';

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

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
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
            icon: Sparkles,
            href: '/products?sort=popular',
            active: url.includes('sort=popular'),
        },
        {
            label: 'Air Tawar',
            sublabel: 'Freshwater',
            icon: Fish,
            href: '/products?water_type=freshwater',
            active: url.includes('water_type=freshwater'),
        },
        {
            label: 'Air Laut',
            sublabel: 'Saltwater & Reef',
            icon: Waves,
            href: '/products?water_type=saltwater',
            active: url.includes('water_type=saltwater'),
        },
        {
            label: 'Penangkar',
            sublabel: 'Verified Sellers',
            icon: Store,
            href: '/products',
            active: url === '/products' && !url.includes('?'),
        },
        {
            label: 'Discounts',
            sublabel: 'Garansi D.O.A.',
            badge: 'to 70%',
            icon: Tag,
            href: '/products?min_price=1',
            active: url.includes('min_price'),
        },
        {
            label: 'Panduan',
            sublabel: 'Care Guides',
            icon: BookOpen,
            href: '/guides',
            active: url.startsWith('/guides'),
        },
    ];

    return (
        <>
            {/* Desktop Sidebar: Permanently docked inside the flex app shell */}
            <aside
                className={`hidden md:flex flex-col justify-between bg-white border-r border-[#1E80A0]/10 transition-all duration-300 shrink-0 h-full select-none ${
                    isCollapsed ? 'w-20' : 'w-64 lg:w-72'
                }`}
            >
                {/* Top Section: Brand + Navigation */}
                <div className="p-4 lg:p-5 flex-1 flex flex-col min-h-0 overflow-y-auto">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between pb-5 border-b border-[#1E80A0]/10">
                        {isCollapsed ? (
                            <div className="w-full flex flex-col items-center gap-2">
                                <Link 
                                    href="/" 
                                    className="w-9 h-9 rounded-xl bg-[#0D2E92] text-white flex items-center justify-center shadow-xs hover:scale-105 transition"
                                    title="CATALYST Dunia Ikan"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </Link>
                                <button
                                    type="button"
                                    onClick={onToggleCollapse}
                                    className="p-1.5 text-[#1E80A0] hover:text-[#001454] rounded-lg hover:bg-[#f3f2ff] transition"
                                    title="Perluas Sidebar"
                                    aria-label="Perluas Sidebar"
                                >
                                    <PanelLeft className="w-4 h-4 rotate-180" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-[#0D2E92] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold tracking-widest text-[#001454] uppercase leading-none">
                                            CATALYST
                                        </span>
                                        <span className="text-[9px] font-bold tracking-wider text-[#1E80A0] uppercase mt-0.5">
                                            Dunia Ikan
                                        </span>
                                    </div>
                                </Link>

                                <button
                                    type="button"
                                    onClick={onToggleCollapse}
                                    className="p-1.5 text-[#1E80A0] hover:text-[#001454] rounded-lg hover:bg-[#f3f2ff] transition"
                                    title="Kecilkan Sidebar"
                                    aria-label="Kecilkan Sidebar"
                                >
                                    <PanelLeft className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Nav Items */}
                    <nav className="mt-5 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            if (isCollapsed) {
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition ${
                                            item.active
                                                ? 'bg-[#001454] text-[#4AB8BD] shadow-xs'
                                                : 'text-[#3d4949] hover:text-[#001454] hover:bg-[#f3f2ff]'
                                        }`}
                                        title={item.label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                                        item.active
                                            ? 'bg-[#001454] text-white shadow-xs'
                                            : 'text-[#3d4949] hover:text-[#001454] hover:bg-[#f3f2ff]'
                                    }`}
                                    title={item.label}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Icon className={`w-4 h-4 shrink-0 transition ${
                                            item.active ? 'text-[#4AB8BD]' : 'text-[#1E80A0] group-hover:text-[#001454]'
                                        }`} />
                                        <span className="truncate">{item.label}</span>
                                    </div>

                                    {item.badge && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            item.active ? 'bg-[#FFE4B0] text-[#001454]' : 'bg-[#FFE4B0]/80 text-[#001454]'
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Special Features Nav (Expanded Only) */}
                    {!isCollapsed && (
                        <div className="mt-6 pt-5 border-t border-[#1E80A0]/10 space-y-1.5">
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
                    )}
                </div>

                {/* Bottom Section: TIPS OF THE DAY Widget */}
                {isCollapsed ? (
                    <div className="p-3 border-t border-[#1E80A0]/10 flex justify-center">
                        <button
                            type="button"
                            onClick={nextTip}
                            className="w-10 h-10 rounded-xl bg-[#f3f2ff] text-[#1E80A0] hover:text-[#0684E5] flex items-center justify-center border border-[#1E80A0]/20 hover:bg-[#ececff] transition"
                            title={`Tip: ${currentTip.title}`}
                        >
                            <Lightbulb className="w-4 h-4 text-[#0684E5]" />
                        </button>
                    </div>
                ) : (
                    <div className="p-4 border-t border-[#1E80A0]/10 shrink-0">
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
                )}
            </aside>

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
                                <div className="w-8 h-8 rounded-lg bg-[#0D2E92] text-white flex items-center justify-center shadow-xs">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-extrabold tracking-widest text-[#001454] uppercase leading-none">
                                        CATALYST
                                    </span>
                                    <span className="text-[9px] font-bold tracking-wider text-[#1E80A0] uppercase mt-0.5">
                                        Dunia Ikan
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
