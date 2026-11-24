import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { 
    Package, 
    ArrowLeft, 
    CreditCard, 
    CheckCircle2, 
    XCircle, 
    Truck, 
    ShieldCheck, 
    User, 
    MapPin, 
    Clock 
} from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';

export default function Show({ store, order }) {
    const { isEn, pick, trOrderStatus } = useLanguage();
    const { data: payData, setData: setPayData, post: postPay, processing: payProcessing } = useForm({
        payment_status: 'verified',
        notes: '',
    });

    const { data: shipData, setData: setShipData, post: postShip, processing: shipProcessing, errors: shipErrors } = useForm({
        shipping_courier: order.shipping_courier || 'JNE YES (Yakin Esok Sampai)',
        shipping_tracking_number: order.shipping_tracking_number || '',
    });

    const handleVerify = (status) => {
        payData.payment_status = status;
        postPay(`/seller/orders/${order.id}/verify-payment`);
    };

    const handleShipping = (e) => {
        e.preventDefault();
        postShip(`/seller/orders/${order.id}/shipping`);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <SellerLayout>
            <Head title={`${pick('Kelola Pesanan', 'Manage Order')} ${order.order_number} - ${pick('Portal Penjual', 'Seller Portal')}`} />

            <div className="space-y-6">
                <Link href="/seller/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    {pick('Kembali ke Daftar Pesanan Masuk', 'Back to Incoming Orders')}
                </Link>

                {/* Header */}
                <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs text-slate-400 font-semibold">
                            {pick('Nomor Pesanan', 'Order Number')}
                        </span>
                        <h1 className="text-2xl font-extrabold text-dunia-navy dark:text-white font-mono">{order.order_number}</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {pick('Waktu order:', 'Ordered at:')}{' '}
                            {new Date(order.created_at).toLocaleString(isEn ? 'en-US' : 'id-ID')}
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-xs text-slate-400 font-semibold">
                            {pick('Total Tagihan Toko', 'Store Order Total')}
                        </span>
                        <p className="text-2xl font-extrabold text-dunia-blue">{formatPrice(order.grand_total)}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                            Status: {trOrderStatus(order.status)}
                        </span>
                    </div>
                </div>

                {/* Step 1: Pembayaran Tunai di Tempat (COD) vs Verifikasi Pembayaran Manual */}
                {order.payment_method === 'cod' ? (
                    <div className="bg-amber-50/70 dark:bg-amber-500/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-500/30 shadow-xs space-y-2 text-xs">
                        <h2 className="font-bold text-sm text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
                            <Truck className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                            {pick('1. Pembayaran Tunai di Tempat (COD)', '1. Cash on Delivery (COD)')}
                        </h2>
                        <p className="text-amber-900 dark:text-amber-100/90 leading-relaxed">
                            {pick(
                                'Pembeli memilih COD sehingga tidak ada pembayaran online atau bukti transfer di muka. Anda dapat langsung mengemas ikan dan memasukkan kurir & nomor resi di bawah. Kurir menagih tunai sebesar',
                                'The buyer chose COD, so no online payment or upfront transfer proof is needed. You can pack the order right away and enter the courier & tracking details below. Collect cash upon delivery of'
                            )}{' '}
                            <strong>{formatPrice(order.grand_total)}</strong>.
                        </p>
                        {order.payment_status === 'verified' && (
                            <p className="font-bold text-emerald-700 dark:text-emerald-300">
                                {pick('Status: Pembayaran COD telah diterima & selesai.', 'Status: COD payment collected & completed.')}
                            </p>
                        )}
                    </div>
                ) : (
                <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <h2 className="font-bold text-sm text-dunia-navy dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <CreditCard className="w-4 h-4 text-dunia-blue" />
                        {pick('1. Verifikasi Pembayaran Pembeli', '1. Buyer Payment Verification')} ({order.payment_method.toUpperCase()})
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-2">
                            <p className="text-slate-500">
                                {pick('Status Pembayaran Saat Ini:', 'Current Payment Status:')}
                            </p>
                            <p className="font-extrabold text-sm uppercase text-slate-900 dark:text-white">
                                {order.payment_status}
                            </p>
                            {order.payment_notes && (
                                <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#131d33] p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                    {pick('Catatan Pembeli:', 'Buyer Notes:')} {order.payment_notes}
                                </p>
                            )}

                            {/* Verification action buttons */}
                            {order.payment_status !== 'verified' && (
                                <div className="pt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('verified')}
                                        disabled={payProcessing}
                                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {pick('Terima & Verifikasi Bayar', 'Approve & Verify Payment')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('rejected')}
                                        disabled={payProcessing}
                                        className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold hover:bg-rose-100 dark:hover:bg-rose-500/25 transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        {pick('Tolak', 'Reject')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Image of payment proof */}
                        <div>
                            <span className="text-slate-500 block mb-1 font-semibold">
                                {pick('Bukti Transfer yang Diunggah:', 'Uploaded Transfer Proof:')}
                            </span>
                            {order.payment_proof ? (
                                <div className="space-y-2">
                                    <a
                                        href={`/storage/${order.payment_proof}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#131d33] hover:opacity-90 transition relative group"
                                    >
                                        <img
                                            src={`/storage/${order.payment_proof}`}
                                            alt={pick('Bukti Transfer', 'Payment Proof')}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            {pick('Buka Ukuran Penuh', 'Open Full Size')}
                                        </div>
                                    </a>
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-slate-50 dark:bg-[#131d33] rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                                    {pick('Pembeli belum mengunggah bukti pembayaran.', 'Buyer has not uploaded payment proof yet.')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                )}

                {/* Step 2: Input Kurir & Nomor Resi Pengiriman */}
                <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <h2 className="font-bold text-sm text-dunia-navy dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        {pick('2. Masukkan Kurir & Resi Pengiriman Ikan', '2. Enter Courier & Tracking Number')}
                    </h2>

                    <form onSubmit={handleShipping} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Nama Jasa Kurir / Ekspedisi', 'Courier / Carrier Name')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={pick('e.g. JNE YES / Paxel / TiKi ONS / Kurir Farm', 'e.g. JNE YES / Paxel / TIKI ONS / Farm Courier')}
                                    value={shipData.shipping_courier}
                                    onChange={(e) => setShipData('shipping_courier', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                    required
                                />
                                {shipErrors.shipping_courier && <p className="text-rose-600 mt-1">{shipErrors.shipping_courier}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Nomor Resi Pengiriman (Airwaybill)', 'Tracking Number (Airwaybill)')}
                                </label>
                                <input
                                    type="text"
                                    placeholder={pick('Nomor resi resmi...', 'Official tracking number...')}
                                    value={shipData.shipping_tracking_number}
                                    onChange={(e) => setShipData('shipping_tracking_number', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white font-mono"
                                    required
                                />
                                {shipErrors.shipping_tracking_number && <p className="text-rose-600 mt-1">{shipErrors.shipping_tracking_number}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={shipProcessing || !shipData.shipping_tracking_number}
                                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
                            >
                                <Truck className="w-4 h-4" />
                                {shipProcessing
                                    ? pick('Menyimpan...', 'Saving...')
                                    : pick('Perbarui Status Menjadi Dikirim', 'Mark Order as Shipped')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Items & Delivery Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#0e1424] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs space-y-3">
                        <h3 className="font-bold text-dunia-navy dark:text-white uppercase pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                            <User className="w-4 h-4 text-dunia-marine" />
                            {pick('Data Pembeli & Alamat Tujuan:', 'Buyer & Delivery Address:')}
                        </h3>
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{order.shipping_recipient_name} ({order.shipping_phone})</p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{order.shipping_address}</p>
                        {order.shipping_notes && (
                            <p className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-amber-500/30">
                                {pick('Catatan Pembeli:', 'Buyer Notes:')} {order.shipping_notes}
                            </p>
                        )}
                    </div>

                    <div className="bg-white dark:bg-[#0e1424] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs space-y-3">
                        <h3 className="font-bold text-dunia-navy dark:text-white uppercase pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-dunia-blue" />
                            {pick('Item Ikan / Produk:', 'Fish / Product Items:')}
                        </h3>
                        <div className="divide-y divide-slate-100">
                            {order.items?.map((it) => (
                                <div key={it.id} className="py-2 first:pt-0 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-100">{it.product_name}</p>
                                        <p className="text-slate-400 dark:text-slate-500">
                                            {it.quantity} {pick('ekor', 'pcs')} x {formatPrice(it.price)}
                                        </p>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(it.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
