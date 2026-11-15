import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Package, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Index({ store, orders }) {
    const { pick, trOrderStatus } = useLanguage();
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const label = trOrderStatus(status);
        switch (status) {
            case 'pending_payment':
                return { label, bg: 'bg-amber-50 text-amber-700' };
            case 'awaiting_confirmation':
                return { label, bg: 'bg-blue-100 text-blue-800' };
            case 'processing':
                return { label, bg: 'bg-purple-100 text-purple-800' };
            case 'shipped':
                return { label, bg: 'bg-indigo-100 text-indigo-800' };
            case 'delivered':
                return { label, bg: 'bg-emerald-100 text-emerald-800' };
            default:
                return { label, bg: 'bg-rose-100 text-rose-800' };
        }
    };

    return (
        <SellerLayout>
            <Head title={pick('Pesanan Masuk Toko - Portal Penjual', 'Incoming Store Orders — Seller Portal')} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-dunia-navy">
                        {pick('Pesanan Masuk Toko', 'Incoming Store Orders')}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        {pick(
                            'Verifikasi bukti transfer pembeli, siapkan packing oksigen ikan, dan masukkan nomor resi pengiriman.',
                            'Verify buyer transfer proofs, prepare oxygenated fish packing, and enter courier tracking numbers.'
                        )}
                    </p>
                </div>

                {orders?.data?.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                        {/* Mobile Card List */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {orders.data.map((order) => {
                                const badge = getStatusBadge(order.status);
                                return (
                                    <div key={order.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-extrabold text-dunia-navy font-mono text-xs">
                                                    {order.order_number}
                                                </p>
                                                <p className="text-xs font-bold text-slate-800 mt-0.5">
                                                    {order.buyer?.name}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${badge.bg}`}>
                                                    {badge.label}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                                                    order.payment_status === 'verified'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : order.payment_status === 'paid'
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {order.payment_status}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-600 line-clamp-2">
                                            {order.items?.map((it) => `${it.quantity}x ${it.product_name}`).join(', ')}
                                        </p>

                                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                                            <div>
                                                <span className="block text-[10px] text-slate-400">
                                                    {pick('Total Tagihan', 'Total Due')}
                                                </span>
                                                <span className="font-extrabold text-sm text-dunia-blue tabular-nums">
                                                    {formatPrice(order.grand_total)}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/seller/orders/${order.id}`}
                                                className="px-3.5 py-2 rounded-xl bg-sky-50 text-dunia-navy hover:bg-sky-100 font-bold text-xs inline-flex items-center gap-1.5 transition"
                                            >
                                                {pick('Detail & Proses', 'Manage Order')}
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">{pick('No. Pesanan', 'Order No.')}</th>
                                        <th className="p-4">{pick('Pembeli', 'Buyer')}</th>
                                        <th className="p-4">{pick('Item Ikan', 'Fish Items')}</th>
                                        <th className="p-4">{pick('Total', 'Total')}</th>
                                        <th className="p-4">{pick('Status Pesanan', 'Order Status')}</th>
                                        <th className="p-4">{pick('Status Bayar', 'Payment Status')}</th>
                                        <th className="p-4 text-right">{pick('Aksi', 'Action')}</th>
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
                                                        {pick('Detail & Proses', 'Manage Order')}
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
                        <p className="font-bold text-slate-700">
                            {pick('Belum ada pesanan masuk untuk toko Anda', 'No incoming orders for your store yet')}
                        </p>
                        <p className="text-slate-400">
                            {pick('Pesanan dari pembeli akan muncul di halaman ini.', 'Buyer orders will appear here.')}
                        </p>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
