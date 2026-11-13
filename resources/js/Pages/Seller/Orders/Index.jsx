import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Package, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Index({ store, orders }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending_payment':
                return { label: 'Menunggu Bayar', bg: 'bg-amber-50 text-amber-700' };
            case 'awaiting_confirmation':
                return { label: 'Perlu Verifikasi', bg: 'bg-blue-100 text-blue-800' };
            case 'processing':
                return { label: 'Siap Kirim', bg: 'bg-purple-100 text-purple-800' };
            case 'shipped':
                return { label: 'Sedang Dikirim', bg: 'bg-indigo-100 text-indigo-800' };
            case 'delivered':
                return { label: 'Selesai', bg: 'bg-emerald-100 text-emerald-800' };
            default:
                return { label: 'Batal', bg: 'bg-rose-100 text-rose-800' };
        }
    };

    return (
        <SellerLayout>
            <Head title="Pesanan Masuk Toko - Portal Penjual" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-dunia-navy">
                        Pesanan Masuk Toko
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Verifikasi bukti transfer pembeli, siapkan packing oksigen ikan, dan masukkan nomor resi pengiriman.
                    </p>
                </div>

                {orders?.data?.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">No. Pesanan</th>
                                        <th className="p-4">Pembeli</th>
                                        <th className="p-4">Item Ikan</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Status Pesanan</th>
                                        <th className="p-4">Status Bayar</th>
                                        <th className="p-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.data.map((order) => {
                                        const badge = getStatusBadge(order.status);
                                        return (
                                            <tr key={order.id} className="hover:bg-slate-50/80 transition">
                                                <td className="p-4 font-extrabold text-dunia-navy font-mono">
                                                    {order.order_number}
                                                </td>

                                                <td className="p-4">
                                                    <p className="font-bold text-slate-800">{order.buyer?.name}</p>
                                                    <p className="text-[10px] text-slate-400">{order.buyer?.phone || order.buyer?.email}</p>
                                                </td>

                                                <td className="p-4 text-slate-600">
                                                    <span className="truncate max-w-[180px] block">
                                                        {order.items?.map((it) => `${it.quantity}x ${it.product_name}`).join(', ')}
                                                    </span>
                                                </td>

                                                <td className="p-4 font-bold text-dunia-blue">
                                                    {formatPrice(order.grand_total)}
                                                </td>

                                                <td className="p-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${badge.bg}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>

                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                                                        order.payment_status === 'verified'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : order.payment_status === 'paid'
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {order.payment_status}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-right">
                                                    <Link
                                                        href={`/seller/orders/${order.id}`}
                                                        className="px-3 py-1.5 rounded-xl bg-sky-50 text-dunia-navy hover:bg-sky-100 font-bold text-[11px] inline-flex items-center gap-1 transition"
                                                    >
                                                        Detail & Proses
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
                        <Package className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="font-bold text-slate-700">Belum ada pesanan masuk untuk toko Anda</p>
                        <p className="text-slate-400">Pesanan dari pembeli akan muncul di halaman ini.</p>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
