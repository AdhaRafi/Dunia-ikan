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
import { useLanguage } from '@/lib/i18n';

export default function Dashboard({ stats, recentOrders }) {
    const { pick, trOrderStatus } = useLanguage();
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AdminLayout>
            <Head title={pick('Panel Admin - Dunia Ikan', 'Admin Panel - Dunia Ikan')} />

            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                        {pick('Ringkasan Platform Marketplace', 'Marketplace Platform Overview')}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        {pick('Pantau aktivitas pengguna, performa toko penangkar, transaksi, dan panduan kesehatan ikan.', 'Monitor user activity, breeder store performance, transactions, and fish health guides.')}
                    </p>
                </div>

                {/* Key Statistics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">{pick('Total Pengguna', 'Total Users')}</span>
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</p>
                        <p className="text-[11px] text-slate-400">{pick('Pembeli, Penjual, dan Admin', 'Buyers, Sellers, and Admins')}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">{pick('Toko Penangkar', 'Breeder Stores')}</span>
                            <Store className="w-5 h-5 text-dunia-marine" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalStores}</p>
                        <p className="text-[11px] text-slate-400">{pick('Toko aktif bergaransi DOA', 'Active DOA-guaranteed stores')}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">{pick('Produk / Morf', 'Products / Morphs')}</span>
                            <Fish className="w-5 h-5 text-dunia-blue" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalProducts}</p>
                        <p className="text-[11px] text-slate-400">{pick('Katalog terdaftar di database', 'Listings registered in database')}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">{pick('Total Pesanan', 'Total Orders')}</span>
                            <Package className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalOrders}</p>
                        <p className="text-[11px] text-slate-400">{pick('Seluruh status transaksi', 'All transaction statuses')}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">{pick('Volume Terverifikasi', 'Verified Volume')}</span>
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-xl font-extrabold text-emerald-700">{formatPrice(stats.totalRevenue)}</p>
                        <p className="text-[11px] text-slate-400">{pick('Pesanan terbayar dan selesai', 'Paid and completed orders')}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold uppercase tracking-wider">{pick('Panduan Ikan Chatbot', 'Chatbot Fish Guides')}</span>
                            <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-extrabold text-slate-900">{stats.totalGuides}</p>
                        <p className="text-[11px] text-slate-400">{pick('Basis rujukan Gemini AI', 'Gemini AI knowledge base')}</p>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                            {pick('Transaksi Terbaru Platform', 'Latest Platform Transactions')}
                        </h2>
                        <Link href="/admin/transactions" className="text-xs font-bold text-dunia-blue hover:text-sky-700 flex items-center gap-1">
                            {pick('Buka Semua Transaksi', 'View All Transactions')} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {recentOrders?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                                    <tr>
                                        <th className="p-3">{pick('No. Order', 'Order #')}</th>
                                        <th className="p-3">{pick('Pembeli', 'Buyer')}</th>
                                        <th className="p-3">{pick('Toko', 'Store')}</th>
                                        <th className="p-3">{pick('Total', 'Total')}</th>
                                        <th className="p-3">{pick('Status', 'Status')}</th>
                                        <th className="p-3">{pick('Pembayaran', 'Payment')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOrders.map((ord) => (
                                        <tr key={ord.id} className="hover:bg-slate-50/60">
                                            <td className="p-3 font-mono font-bold text-slate-900">{ord.order_number}</td>
                                            <td className="p-3 font-semibold text-slate-700">{ord.buyer?.name}</td>
                                            <td className="p-3 text-slate-600">{ord.store?.name}</td>
                                            <td className="p-3 font-bold text-dunia-blue">{formatPrice(ord.grand_total)}</td>
                                            <td className="p-3 font-semibold">{trOrderStatus(ord.status)}</td>
                                            <td className="p-3 uppercase text-[10px] font-bold text-slate-500">{ord.payment_status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 py-4 text-center">{pick('Belum ada transaksi di platform.', 'No transactions on the platform yet.')}</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
