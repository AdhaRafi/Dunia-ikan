import { Link } from '@inertiajs/react';
import { Fish, ShieldCheck, HeartPulse, Send, Award } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-dunia-navy text-white pt-16 pb-12 border-t border-sky-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-sky-800/60">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-dunia-blue flex items-center justify-center text-white shadow-md">
                                <Fish className="w-5 h-5 -rotate-12" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-white">
                                DUNIA<span className="text-dunia-aqua">IKAN</span>
                            </span>
                        </div>
                        <p className="text-sm text-sky-200/80 leading-relaxed">
                            Marketplace multi-penjual ikan hias tropis, mutasi genetik (morph), dan kebutuhan aquascape terpercaya di Indonesia dengan jaminan keselamatan hidup ikan.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-800/60 text-dunia-aqua text-xs font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Standar D.O.A. Terverifikasi
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-sm text-dunia-aqua uppercase tracking-wider mb-4">
                            Katalog Utama
                        </h4>
                        <ul className="space-y-2.5 text-sm text-sky-100/80">
                            <li>
                                <Link href="/products?category=ikan-hias" className="hover:text-white transition">
                                    Ikan Hias & Mutasi Morph
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=aquascape" className="hover:text-white transition">
                                    Aquascape & Flora Air
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=pakan-ikan" className="hover:text-white transition">
                                    Pakan & Nutrisi Ikan
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=perawatan-ikan" className="hover:text-white transition">
                                    Obat & Perawatan Air
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=perlengkapan-aquarium" className="hover:text-white transition">
                                    Perlengkapan & Tank Rimless
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Educational / Knowledge Base */}
                    <div>
                        <h4 className="font-bold text-sm text-dunia-aqua uppercase tracking-wider mb-4">
                            Pusat Pengetahuan
                        </h4>
                        <ul className="space-y-2.5 text-sm text-sky-100/80">
                            <li>
                                <Link href="/guides" className="hover:text-white transition flex items-center gap-1.5">
                                    <HeartPulse className="w-3.5 h-3.5 text-dunia-aqua" />
                                    Panduan Kesehatan Ikan
                                </Link>
                            </li>
                            <li>
                                <span className="text-sky-300/60 text-xs block">
                                    Konsultasi White Spot, Fin Rot & Parameter Air
                                </span>
                            </li>
                            <li className="pt-2">
                                <Link href="/seller/register" className="hover:text-white transition font-medium text-white flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-dunia-cream" />
                                    Buka Toko / Gabung Peternak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Live Arrival Rules / DOA Information */}
                    <div>
                        <h4 className="font-bold text-sm text-dunia-aqua uppercase tracking-wider mb-4">
                            Kebijakan Ikan Hidup (DOA)
                        </h4>
                        <div className="bg-sky-900/40 p-4 rounded-2xl border border-sky-800/50 space-y-2 text-xs text-sky-200">
                            <p className="font-semibold text-white">
                                Death On Arrival (D.O.A) Policy:
                            </p>
                            <p>
                                Seluruh penjual wajib menyediakan packing oksigen ganda. Pembeli wajib menyertakan video unboxing utuh tanpa jeda saat mengajukan klaim garansi ikan hidup.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-300/70">
                    <p>© 2026 Dunia Ikan - Platform Marketplace & Edukasi Ikan Hias.</p>
                    <div className="flex items-center gap-6">
                        <span>Sistem Pembayaran Manual & Terverifikasi</span>
                        <span>Multi-Penjual Terkurasi</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
