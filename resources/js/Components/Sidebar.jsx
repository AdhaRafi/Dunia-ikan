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
                className={`hidden md:flex flex-col justify-between bg-white border-r border-slate-200/80 transition-all duration-300 shrink-0 h-full select-none ${
                    isCollapsed ? 'w-20' : 'w-64 lg:w-72'
                }`}
            >
                {/* Top Section: Brand + Navigation */}
                <div className="p-4 lg:p-5 flex-1 flex flex-col min-h-0 overflow-y-auto">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                        {isCollapsed ? (
                            <div className="w-full flex flex-col items-center gap-2">
                                <Link 
                                    href="/" 
                                    className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs hover:scale-105 transition"
                                    title="CATALYST Dunia Ikan"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </Link>
                                <button
                                    type="button"
                                    onClick={onToggleCollapse}
                                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                                    title="Perluas Sidebar"
                                    aria-label="Perluas Sidebar"
                                >
                                    <PanelLeft className="w-4 h-4 rotate-180" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold tracking-widest text-slate-950 uppercase leading-none">
                                            CATALYST
                                        </span>
                                        <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                                            Dunia Ikan
                                        </span>
                                    </div>
                                </Link>

                                <button
                                    type="button"
                                    onClick={onToggleCollapse}
                                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
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
                                                ? 'bg-slate-950 text-white shadow-xs'
                                                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100'
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
                                            ? 'bg-slate-950 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                                    }`}
                                    title={item.label}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Icon className={`w-4 h-4 shrink-0 transition ${
                                            item.active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                                        }`} />
                                        <span className="truncate">{item.label}</span>
                                    </div>

                                    {item.badge && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            item.active ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
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
                        <div className="mt-6 pt-5 border-t border-slate-100 space-y-1.5">
                            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Fitur Spesial
                            </p>
                            <Link
                                href="/guides"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
                            >
                                <HeartPulse className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Pusat Kesehatan Ikan</span>
                            </Link>
                            <Link
                                href="/products?category=ikan-hias"
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
                            >
                                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Garansi D.O.A. 100%</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Bottom Section: TIPS OF THE DAY Widget */}
                {isCollapsed ? (
                    <div className="p-3 border-t border-slate-100 flex justify-center">
                        <button
                            type="button"
                            onClick={nextTip}
                            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 hover:text-emerald-600 flex items-center justify-center border border-slate-200/70 hover:bg-slate-100 transition"
                            title={`Tip: ${currentTip.title}`}
                        >
                            <Lightbulb className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="p-4 border-t border-slate-100 shrink-0">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                TIPS OF THE DAY
                            </p>
                            <h5 className="text-xs font-extrabold text-slate-900 leading-tight">
                                {currentTip.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                                {currentTip.text}
                            </p>
                            <div className="pt-1 flex items-center justify-between text-[11px] font-medium text-slate-400">
                                <span>{tipIndex + 1} of {TIPS.length}</span>
                                <button
                                    type="button"
                                    onClick={nextTip}
                                    className="text-slate-900 hover:text-emerald-600 font-bold flex items-center gap-1 transition"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Mobile Drawer (Accessible on screens < 768px) */}
            <div 
                className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div 
                    onClick={onClose} 
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" 
                />

                {/* Sliding Drawer */}
                <aside 
                    className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out ${
                        isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="p-5 flex-1 flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                            <Link href="/" onClick={onClose} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center shadow-xs">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-extrabold tracking-widest text-slate-950 uppercase leading-none">
                                        CATALYST
                                    </span>
                                    <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                                        Dunia Ikan
                                    </span>
                                </div>
                            </Link>

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
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
                                                ? 'bg-slate-950 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                                            <span className="truncate">{item.label}</span>
                                        </div>
                                        {item.badge && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                item.active ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-6 pt-5 border-t border-slate-100 space-y-1.5">
                            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Fitur Spesial
                            </p>
                            <Link
                                href="/guides"
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
                            >
                                <HeartPulse className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Pusat Kesehatan Ikan</span>
                            </Link>
                            <Link
                                href="/products?category=ikan-hias"
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
                            >
                                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>Garansi D.O.A. 100%</span>
                            </Link>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                TIPS OF THE DAY
                            </p>
                            <h5 className="text-xs font-extrabold text-slate-900 leading-tight">
                                {currentTip.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                {currentTip.text}
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
