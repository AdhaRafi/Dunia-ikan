import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Package, Store, ArrowRight, Clock, CheckCircle2, Truck, XCircle, CreditCard } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Index({ orders }) {
    const { isEn, pick, trOrderStatus } = useLanguage();
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status, paymentMethod) => {
        if (paymentMethod === 'cod' && status === 'pending_payment') {
            return {
                label: pick('COD · Diproses', 'COD · Processing'),
                bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
            };
        }

        const label = trOrderStatus(status);
        switch (status) {
            case 'pending_payment':
                return { label, bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
            case 'awaiting_confirmation':
                return { label, bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border-blue-200 dark:border-blue-800' };
            case 'processing':
                return { label, bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
            case 'shipped':
                return { label, bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
            case 'delivered':
                return { label, bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
            default:
                return { label, bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
        }
    };

    return (
        <AppLayout>
            <Head title={pick('Pesanan Saya - Dunia Ikan', 'My Orders — Dunia Ikan')} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy dark:text-white tracking-tight">
                        {pick('Pesanan Saya', 'My Orders')}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {pick(
                            'Pantau status pembayaran, proses karantina pengiriman, dan resi kurir ikan Anda.',
                            'Track payment status, pre-shipment quarantine, and courier tracking numbers.'
                        )}
                    </p>
                </div>

                {orders?.data?.length > 0 ? (
                    <div className="space-y-4">
                        {orders.data.map((order) => {
                            const badge = getStatusBadge(order.status, order.payment_method);
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-[#0e1424] rounded-2xl border border-sky-100 dark:border-slate-800 shadow-xs p-5 hover:border-dunia-aqua/60 transition space-y-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-sm text-dunia-navy dark:text-white">
                                                {order.order_number}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                                                {badge.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>
                                                {new Date(order.created_at).toLocaleDateString(
                                                    isEn ? 'en-US' : 'id-ID',
                                                    { day: 'numeric', month: 'short', year: 'numeric' }
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Store Name & Items Preview */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                                                <Store className="w-3.5 h-3.5 text-dunia-marine dark:text-[#60C2E6]" />
                                                {pick('Toko:', 'Store:')}{' '}
                                                <strong className="text-slate-800 dark:text-slate-200">{order.store?.name}</strong> ({order.store?.city})
                                            </p>
                                            <div className="text-xs text-slate-700 dark:text-slate-300">
                                                {order.items?.map((it, idx) => (
                                                    <span key={it.id}>
                                                        {idx > 0 && ', '}
                                                        {it.quantity}x {it.product_name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="text-[11px] text-slate-400">
                                                {pick('Total Tagihan', 'Total Due')}
                                            </p>
                                            <p className="text-base font-extrabold text-dunia-blue dark:text-[#60C2E6]">
                                                {formatPrice(order.grand_total)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {pick('Metode:', 'Method:')}{' '}
                                            <strong className="text-slate-700 dark:text-slate-200 uppercase">{order.payment_method.replace('_', ' ')}</strong>
                                        </div>

                                        <Link
                                            href={`/orders/${order.order_number}`}
                                            className="px-4 py-2 rounded-xl bg-sky-50 dark:bg-[#131d33] hover:bg-sky-100 dark:hover:bg-slate-800 text-dunia-navy dark:text-sky-300 font-bold text-xs flex items-center gap-1.5 transition"
                                        >
                                            {order.payment_method === 'cod'
                                                ? pick('Lihat Detail Pesanan', 'View Order Details')
                                                : pick('Lihat Detail & Bukti Pembayaran', 'View Details & Payment Proof')}
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-16 text-center bg-white dark:bg-[#0e1424] rounded-3xl border border-sky-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3">
                        <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                        <h2 className="font-bold text-slate-800 dark:text-white text-base">
                            {pick('Belum Ada Pesanan', 'No Orders Yet')}
                        </h2>
                        <p className="text-xs max-w-sm mx-auto">
                            {pick(
                                'Anda belum pernah melakukan pemesanan ikan atau perlengkapan.',
                                'You have not placed any fish or equipment orders yet.'
                            )}
                        </p>
                        <Link
                            href="/products"
                            className="inline-block px-5 py-2.5 rounded-xl bg-dunia-blue text-white text-xs font-bold hover:bg-sky-600 transition"
                        >
                            {pick('Mulai Belanja Ikan', 'Start Shopping')}
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
