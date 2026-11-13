import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Users, 
    Store, 
    Fish, 
    Package, 
    DollarSign, 
    BookOpen, 
    ArrowRight,
    TrendingUp
} from 'lucide-react';

export default function Dashboard({ stats, recentOrders }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AdminLayout>
            <Head title="Panel Admin - Dunia Ikan" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        Ringkasan Platform Marketplace
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Pantau aktivitas pengguna, performa toko penangkar, transaksi, dan panduan kesehatan ikan.
                    </p>
                </div>

                {/* Key Statistics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Total Pengguna</span>
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</p>
                        <p className="text-[11px] text-slate-400">Pembeli, Penjual, dan Admin</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Toko Penangkar</span>
                            <Store className="w-5 h-5 text-dunia-marine" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalStores}</p>
                        <p className="text-[11px] text-slate-400">Toko aktif bergaransi DOA</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Produk / Morf</span>
                            <Fish className="w-5 h-5 text-dunia-blue" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalProducts}</p>
                        <p className="text-[11px] text-slate-400">Katalog terdaftar di database</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Total Pesanan</span>
                            <Package className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalOrders}</p>
                        <p className="text-[11px] text-slate-400">Seluruh status transaksi</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Volume Terverifikasi</span>
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-xl font-extrabold text-emerald-700">{formatPrice(stats.totalRevenue)}</p>
                        <p className="text-[11px] text-slate-400">Pesanan terbayar dan selesai</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">Panduan Ikan Chatbot</span>
                            <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalGuides}</p>
                        <p className="text-[11px] text-slate-400">Basis rujukan Gemini AI</p>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                            Transaksi Terbaru Platform
                        </h2>
                        <Link href="/admin/transactions" className="text-xs font-bold text-dunia-blue hover:text-sky-700 flex items-center gap-1">
                            Buka Semua Transaksi <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {recentOrders?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                    <tr>
                                        <th className="p-3">No. Order</th>
                                        <th className="p-3">Pembeli</th>
                                        <th className="p-3">Toko</th>
                                        <th className="p-3">Total</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Pembayaran</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOrders.map((ord) => (
                                        <tr key={ord.id} className="hover:bg-slate-50/60">
                                            <td className="p-3 font-mono font-bold text-slate-900">{ord.order_number}</td>
                                            <td className="p-3 font-semibold text-slate-700">{ord.buyer?.name}</td>
                                            <td className="p-3 text-slate-600">{ord.store?.name}</td>
                                            <td className="p-3 font-bold text-dunia-blue">{formatPrice(ord.grand_total)}</td>
                                            <td className="p-3 font-semibold">{ord.status}</td>
                                            <td className="p-3 uppercase text-[10px] font-bold text-slate-500">{ord.payment_status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 py-4 text-center">Belum ada transaksi di platform.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
