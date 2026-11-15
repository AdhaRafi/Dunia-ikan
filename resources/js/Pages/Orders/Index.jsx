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

    const getStatusBadge = (status) => {
        const label = trOrderStatus(status);
        switch (status) {
            case 'pending_payment':
                return { label, bg: 'bg-amber-50 text-amber-700 border-amber-200' };
            case 'awaiting_confirmation':
                return { label, bg: 'bg-blue-50 text-blue-700 border-blue-200' };
            case 'processing':
                return { label, bg: 'bg-purple-50 text-purple-700 border-purple-200' };
            case 'shipped':
                return { label, bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
            case 'delivered':
                return { label, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
            default:
                return { label, bg: 'bg-rose-50 text-rose-700 border-rose-200' };
        }
    };

    return (
        <AppLayout>
            <Head title={pick('Pesanan Saya - Dunia Ikan', 'My Orders — Dunia Ikan')} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy tracking-tight">
                        {pick('Pesanan Saya', 'My Orders')}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        {pick(
                            'Pantau status pembayaran, proses karantina pengiriman, dan resi kurir ikan Anda.',
                            'Track payment status, pre-shipment quarantine, and courier tracking numbers.'
                        )}
                    </p>
                </div>

                {orders?.data?.length > 0 ? (
                    <div className="space-y-4">
                        {orders.data.map((order) => {
                            const badge = getStatusBadge(order.status);
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-2xl border border-sky-100 shadow-xs p-5 hover:border-dunia-aqua/60 transition space-y-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-extrabold text-sm text-dunia-navy">
                                                {order.order_number}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                                                {badge.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-400">
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
                                            <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                                <Store className="w-3.5 h-3.5 text-dunia-marine" />
                                                {pick('Toko:', 'Store:')}{' '}
                                                <strong className="text-slate-800">{order.store?.name}</strong> ({order.store?.city})
                                            </p>
                                            <div className="text-xs text-slate-700">
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
                                            <p className="text-base font-extrabold text-dunia-blue">
                                                {formatPrice(order.grand_total)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <div className="text-xs text-slate-500">
                                            {pick('Metode:', 'Method:')}{' '}
                                            <strong className="text-slate-700 uppercase">{order.payment_method.replace('_', ' ')}</strong>
                                        </div>

                                        <Link
                                            href={`/orders/${order.order_number}`}
                                            className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-dunia-navy font-bold text-xs flex items-center gap-1.5 transition"
                                        >
                                            {pick('Lihat Detail & Bukti Pembayaran', 'View Details & Payment Proof')}
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-16 text-center bg-white rounded-3xl border border-sky-100 text-slate-500 space-y-3">
                        <Package className="w-12 h-12 text-slate-300 mx-auto" />
                        <h2 className="font-bold text-slate-800 text-base">
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
