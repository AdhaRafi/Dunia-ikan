import { Link } from '@inertiajs/react';
import { Fish, ShieldCheck, HeartPulse, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0A1214] text-slate-400 text-xs border-t border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-4">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00C882] to-emerald-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                                <Fish className="w-6 h-6 text-[#0A1214]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                                    DUNIA <span className="text-[#00C882]">IKAN</span>
                                </span>
                                <span className="text-[10px] tracking-widest font-semibold text-slate-400 uppercase">
                                    Aquatic Morph & Care
                                </span>
                            </div>
                        </Link>

                        <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                            Platform ekosistem jual-beli ikan hias, mutasi genetik (morph), dan perlengkapan aquascape pertama di Indonesia dengan standar parameter biologi dan garansi hidup (Live Arrival Guarantee).
                        </p>

                        <div className="flex items-center gap-3 pt-2 text-slate-300">
                            <span className="hover:text-[#00C882] cursor-pointer transition">Facebook</span>
                            <span>•</span>
                            <span className="hover:text-[#00C882] cursor-pointer transition">Instagram</span>
                            <span>•</span>
                            <span className="hover:text-[#00C882] cursor-pointer transition">YouTube</span>
                            <span>•</span>
                            <span className="hover:text-[#00C882] cursor-pointer transition">Discord</span>
                        </div>
                    </div>

                    {/* Nav Column: Jelajahi */}
                    <div className="lg:col-span-3 space-y-3">
                        <p className="text-white font-extrabold uppercase tracking-wider text-xs">
                            Jelajahi Ekosistem
                        </p>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/products" className="hover:text-[#00C882] transition">
                                    Katalog Ikan & Morph
                                </Link>
                            </li>
                            <li>
                                <Link href="/guides" className="hover:text-[#00C882] transition">
                                    Pusat Panduan Kesehatan
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="hover:text-[#00C882] transition">
                                    Keranjang Belanja
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller/register" className="hover:text-[#00C882] transition">
                                    Pendaftaran Penangkar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policy Column: D.O.A. */}
                    <div className="lg:col-span-2 space-y-3">
                        <p className="text-white font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#00C882]" />
                            Garansi D.O.A.
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Ikan dijamin tiba hidup dengan standar pengemasan beroksigen tinggi. Klaim retur/refund melalui bukti video unboxing tanpa jeda.
                        </p>
                    </div>

                    {/* Mitra Penangkar */}
                    <div className="lg:col-span-3 space-y-3">
                        <p className="text-white font-extrabold uppercase tracking-wider text-xs">
                            Hubungi Kami
                        </p>
                        <p className="text-xs text-slate-400">
                            Layanan bantuan penghobi & penangkar aktif:
                        </p>
                        <div className="space-y-1.5 text-xs text-slate-300">
                            <p className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-[#00C882]" />
                                +62 812-8864-4725
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-[#00C882]" />
                                cs@duniaikan.id
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                    <p>© 2026 Dunia Ikan. Seluruh hak cipta dilindungi undang-undang.</p>
                    <p>
                        Foto spesimen: Wikimedia Commons (CC0, CC BY, CC BY-SA).{' '}
                        <a href="/images/products/credits.json" className="text-slate-400 hover:text-[#00C882] underline">
                            Atribusi Lisensi
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
