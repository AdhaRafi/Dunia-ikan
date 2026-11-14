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
    ChevronRight,
    ArrowRight,
    Tag,
    X,
    HeartPulse
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
            doaBadge: '100%',
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
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-white border-r border-slate-200/80 transition-all duration-300 md:static ${
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } ${
                    isCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'
                } w-72 h-screen overflow-y-auto select-none`}
            >
                <div className="p-5 flex-1 flex flex-col">
                    {/* Brand Logo & Collapse Toggle (like Catalyst logo: geometric icon + CATALYST + [|]) */}
                    <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                        <Link href="/" className="flex items-center gap-3 group">
                            {/* Geometric modern brand mark */}
                            <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className="w-4 h-4 fill-none stroke-current stroke-2"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col">
                                    <span className="text-base font-extrabold tracking-widest text-slate-950 uppercase leading-none">
                                        CATALYST
                                    </span>
                                    <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-1">
                                        Dunia Ikan
                                    </span>
                                </div>
                            )}
                        </Link>

                        <div className="flex items-center gap-1">
                            {/* Desktop Collapse Button */}
                            <button
                                type="button"
                                onClick={onToggleCollapse}
                                className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                                title={isCollapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
                            >
                                <PanelLeft className="w-4 h-4" />
                            </button>

                            {/* Mobile Close Button */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="md:hidden p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Nav Items List */}
                    <nav className="mt-6 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                                        item.active
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                                    }`}
                                    title={item.label}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Icon className={`w-4 h-4 shrink-0 transition ${
                                            item.active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                                        }`} />
                                        {!isCollapsed && (
                                            <span className="truncate">{item.label}</span>
                                        )}
                                    </div>

                                    {!isCollapsed && item.badge && (
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

                    {/* Separator & Secondary Nav */}
                    {!isCollapsed && (
                        <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
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

                {/* Bottom: TIPS OF THE DAY Widget (matches Catalyst reference) */}
                {!isCollapsed && (
                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                TIPS OF THE DAY
                            </p>
                            <h5 className="text-xs font-extrabold text-slate-900 leading-tight">
                                {currentTip.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
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
        </>
    );
}
