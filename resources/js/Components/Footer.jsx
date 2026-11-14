import { Link } from '@inertiajs/react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-slate-200/80 bg-white text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-950 text-white flex items-center justify-center">
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className="w-3.5 h-3.5 fill-none stroke-current stroke-2"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="font-extrabold tracking-widest text-slate-950 uppercase">
                                CATALYST
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Marketplace ikan hias & mutasi genetik (morph) terakreditasi Indonesia.
                        </p>
                    </div>

                    {/* Nav 1 */}
                    <div className="space-y-2">
                        <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                            Koleksi
                        </p>
                        <ul className="space-y-1.5 text-[11px]">
                            <li>
                                <Link href="/products?sort=popular" className="hover:text-slate-900 transition">
                                    The Most Trending
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?water_type=freshwater" className="hover:text-slate-900 transition">
                                    Air Tawar (Freshwater)
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?water_type=saltwater" className="hover:text-slate-900 transition">
                                    Air Laut & Terumbu
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=aquascape" className="hover:text-slate-900 transition">
                                    Aquascape & Flora
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Nav 2 */}
                    <div className="space-y-2">
                        <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                            Layanan
                        </p>
                        <ul className="space-y-1.5 text-[11px]">
                            <li>
                                <Link href="/guides" className="hover:text-slate-900 transition">
                                    Panduan Perawatan Ikan
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-slate-900 transition">
                                    Garansi D.O.A. 100%
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller/register" className="hover:text-slate-900 transition">
                                    Buka Toko Penangkar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policy */}
                    <div className="space-y-2 text-[11px]">
                        <p className="font-bold text-slate-900 uppercase tracking-wider">
                            Akreditasi D.O.A.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Setiap pembelian dilindungi garansi hidup sampai tujuan dengan kemasan beroksigen tinggi.
                        </p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                    <p>© 2026 Dunia Ikan (Catalyst Style). Seluruh hak cipta dilindungi.</p>
                    <p>
                        Spesimen foto: Wikimedia Commons (CC-BY / CC0).{' '}
                        <a href="/images/products/credits.json" className="underline hover:text-slate-600">
                            credits.json
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
