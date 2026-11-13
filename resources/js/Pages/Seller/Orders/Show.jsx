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
} from 'lucide-react';

export default function Show({ store, order }) {
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
            <Head title={`Kelola Pesanan ${order.order_number} - Portal Penjual`} />

            <div className="space-y-6">
                <Link href="/seller/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Pesanan Masuk
                </Link>

                {/* Header */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs text-slate-400 font-semibold">Nomor Pesanan</span>
                        <h1 className="text-2xl font-extrabold text-dunia-navy font-mono">{order.order_number}</h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Waktu order: {new Date(order.created_at).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-xs text-slate-400 font-semibold">Total Tagihan Toko</span>
                        <p className="text-2xl font-extrabold text-dunia-blue">{formatPrice(order.grand_total)}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            Status: {order.status}
                        </span>
                    </div>
                </div>

                {/* Step 1: Verifikasi Pembayaran Manual */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h2 className="font-bold text-sm text-dunia-navy uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                        <CreditCard className="w-4 h-4 text-dunia-blue" />
                        1. Verifikasi Pembayaran Pembeli ({order.payment_method.toUpperCase()})
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-2">
                            <p className="text-slate-500">Status Pembayaran Saat Ini:</p>
                            <p className="font-extrabold text-sm uppercase text-slate-900">
                                {order.payment_status}
                            </p>
                            {order.payment_notes && (
                                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    Catatan Pembeli: {order.payment_notes}
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
                                        Terima & Verifikasi Bayar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('rejected')}
                                        disabled={payProcessing}
                                        className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Tolak
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Image of payment proof */}
                        <div>
                            <span className="text-slate-500 block mb-1 font-semibold">Bukti Transfer yang Diunggah:</span>
                            {order.payment_proof ? (
                                <div className="space-y-2">
                                    <a
                                        href={`/storage/${order.payment_proof}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 hover:opacity-90 transition relative group"
                                    >
                                        <img
                                            src={`/storage/${order.payment_proof}`}
                                            alt="Bukti Transfer"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            Buka Ukuran Penuh
                                        </div>
                                    </a>
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                                    Pembeli belum mengunggah bukti pembayaran.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Step 2: Input Kurir & Nomor Resi Pengiriman */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h2 className="font-bold text-sm text-dunia-navy uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        2. Masukkan Kurir & Resi Pengiriman Ikan
                    </h2>

                    <form onSubmit={handleShipping} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Nama Jasa Kurir / Ekspedisi</label>
                                <input
                                    type="text"
                                    placeholder="e.g. JNE YES / Paxel / TiKi ONS / Kurir Farm"
                                    value={shipData.shipping_courier}
                                    onChange={(e) => setShipData('shipping_courier', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                    required
                                />
                                {shipErrors.shipping_courier && <p className="text-rose-600 mt-1">{shipErrors.shipping_courier}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Nomor Resi Pengiriman (Airwaybill)</label>
                                <input
                                    type="text"
                                    placeholder="Nomor resi resmi..."
                                    value={shipData.shipping_tracking_number}
                                    onChange={(e) => setShipData('shipping_tracking_number', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
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
                                {shipProcessing ? 'Menyimpan...' : 'Perbarui Status Menjadi Dikirim'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Items & Delivery Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-3">
                        <h3 className="font-bold text-dunia-navy uppercase pb-2 border-b border-slate-100 flex items-center gap-1.5">
                            <User className="w-4 h-4 text-dunia-marine" />
                            Data Pembeli & Alamat Tujuan:
                        </h3>
                        <p className="font-bold text-slate-800 text-sm">{order.shipping_recipient_name} ({order.shipping_phone})</p>
                        <p className="text-slate-600 leading-relaxed">{order.shipping_address}</p>
                        {order.shipping_notes && (
                            <p className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-100">
                                Catatan Pembeli: {order.shipping_notes}
                            </p>
                        )}
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-3">
                        <h3 className="font-bold text-dunia-navy uppercase pb-2 border-b border-slate-100 flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-dunia-blue" />
                            Item Ikan / Produk:
                        </h3>
                        <div className="divide-y divide-slate-100">
                            {order.items?.map((it) => (
                                <div key={it.id} className="py-2 first:pt-0 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800">{it.product_name}</p>
                                        <p className="text-slate-400">{it.quantity} ekor x {formatPrice(it.price)}</p>
                                    </div>
                                    <span className="font-bold text-slate-900">{formatPrice(it.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
