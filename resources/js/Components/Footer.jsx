import { Link } from '@inertiajs/react';
import { ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-16 bg-[#0D2E92] text-white text-xs border-t border-[#1E80A0]/20 selection:bg-[#4AB8BD] selection:text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-white text-[#0D2E92] flex items-center justify-center font-bold">
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className="w-4 h-4 fill-none stroke-current stroke-2"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="font-extrabold tracking-widest text-white uppercase text-sm">
                                CATALYST
                            </span>
                        </div>
                        <p className="text-[11px] text-[#dde1ff] leading-relaxed">
                            Modern Aquatic Lifestyle & Mutasi Genetik (Morph) Marketplace terakreditasi Indonesia.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C0ECB8] text-[10px] font-bold border border-white/20">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C0ECB8]" />
                            <span>Certified Aquatic Origin</span>
                        </div>
                    </div>

                    {/* Nav 1: Koleksi */}
                    <div className="space-y-2.5">
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                            Koleksi Spesimen
                        </p>
                        <ul className="space-y-2 text-[11px] text-[#dde1ff]">
                            <li>
                                <Link href="/products?sort=popular" className="hover:text-white transition">
                                    The Most Trending 100
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?water_type=freshwater" className="hover:text-white transition">
                                    Air Tawar (Freshwater)
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?water_type=saltwater" className="hover:text-white transition">
                                    Air Laut & Terumbu Karang
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=aquascape" className="hover:text-white transition">
                                    Aquascape & Tanaman Air
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Nav 2: Layanan */}
                    <div className="space-y-2.5">
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                            Layanan & Jaminan
                        </p>
                        <ul className="space-y-2 text-[11px] text-[#dde1ff]">
                            <li>
                                <Link href="/guides" className="hover:text-white transition">
                                    Panduan Perawatan & Karantina
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-white transition">
                                    Garansi D.O.A. 100% Hidup
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller/register" className="hover:text-white transition">
                                    Buka Toko Penangkar
                                </Link>
                            </li>
                            <li>
                                <Link href="/addresses" className="hover:text-white transition">
                                    Kalkulator Ongkos Kirim Aman
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policy / Certified Seal */}
                    <div className="space-y-3 text-[11px]">
                        <p className="font-bold text-white uppercase tracking-wider">
                            Akreditasi D.O.A. 100%
                        </p>
                        <p className="text-[#dde1ff] leading-relaxed">
                            Setiap pembelian dilindungi garansi hidup sampai tujuan dengan kemasan beroksigen tinggi dan pengiriman khusus hewan hidup.
                        </p>
                        <div className="flex items-center gap-2 text-[#4AB8BD] font-semibold text-[11px]">
                            <ShieldCheck className="w-4 h-4 text-[#C0ECB8]" />
                            <span>100% Verified Breeders</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal bar */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#dde1ff]">
                    <p>© 2026 Dunia Ikan — Modern Aquatic Lifestyle. Seluruh hak cipta dilindungi.</p>
                    <p className="text-[#4AB8BD]">
                        Spesimen foto: Wikimedia Commons (CC-BY / CC0).{' '}
                        <a href="/images/products/credits.json" className="underline hover:text-white text-white">
                            credits.json
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
