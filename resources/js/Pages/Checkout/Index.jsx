import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    ShieldCheck, 
    MapPin, 
    CreditCard, 
    QrCode, 
    Banknote, 
    Store, 
    ArrowLeft, 
    CheckCircle2, 
    PlusCircle,
    Zap 
} from 'lucide-react';

export default function Index({ groupedCart, addresses, totalProducts, totalShipping, grandTotal }) {
    const primaryAddress = addresses?.find((a) => a.is_primary) || addresses?.[0];

    const { data, setData, post, processing, errors } = useForm({
        address_id: primaryAddress?.id || '',
        payment_method: 'midtrans',
        shipping_notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/checkout');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AppLayout>
            <Head title="Checkout Pembelian Ikan - Dunia Ikan" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue mb-6 transition">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Keranjang
                </Link>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy tracking-tight mb-8">
                    Checkout Pembelian
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Address & Payment Methods */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 1. Alamat Pengiriman */}
                        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="font-bold text-sm text-dunia-navy uppercase tracking-wider flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-dunia-blue" />
                                    1. Alamat Tujuan Pengiriman Ikan
                                </h2>

                                <Link
                                    href="/addresses"
                                    className="text-xs font-bold text-dunia-blue hover:text-sky-700 flex items-center gap-1"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    Kelola Alamat
                                </Link>
                            </div>

                            {addresses?.length > 0 ? (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <label
                                            key={addr.id}
                                            className={`block p-4 rounded-xl border cursor-pointer transition ${
                                                data.address_id === addr.id
                                                    ? 'bg-sky-50/60 border-dunia-blue ring-1 ring-dunia-blue'
                                                    : 'border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    name="address_id"
                                                    value={addr.id}
                                                    checked={data.address_id === addr.id}
                                                    onChange={() => setData('address_id', addr.id)}
                                                    className="mt-1 text-dunia-blue focus:ring-dunia-aqua"
                                                />
                                                <div className="text-xs space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 text-sm">{addr.recipient_name}</span>
                                                        <span className="text-slate-500">({addr.phone})</span>
                                                        {addr.is_primary && (
                                                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-dunia-blue font-bold text-[10px]">
                                                                Utama
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-600 leading-relaxed">
                                                        {addr.full_address}, {addr.city}, {addr.province} {addr.postal_code}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                                    <span>Anda belum memiliki alamat pengiriman. Silakan tambahkan terlebih dahulu.</span>
                                    <Link
                                        href="/addresses"
                                        className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition"
                                    >
                                        Tambah Alamat
                                    </Link>
                                </div>
                            )}

                            {errors.address_id && (
                                <p className="text-xs text-rose-600 font-semibold">{errors.address_id}</p>
                            )}
                        </div>

                        {/* 2. Metode Pembayaran Manual */}
                        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-4">
                            <h2 className="font-bold text-sm text-dunia-navy uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                                <CreditCard className="w-4 h-4 text-dunia-blue" />
                                2. Metode Pembayaran
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Midtrans Payment Gateway */}
                                <label
                                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                        data.payment_method === 'midtrans'
                                            ? 'bg-blue-50/70 border-dunia-blue ring-2 ring-dunia-blue'
                                            : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <Zap className="w-5 h-5 text-dunia-blue" />
                                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 text-dunia-blue">
                                                    Otomatis
                                                </span>
                                            </div>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="midtrans"
                                                checked={data.payment_method === 'midtrans'}
                                                onChange={() => setData('payment_method', 'midtrans')}
                                                className="text-dunia-blue"
                                            />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900">Midtrans Gateway</p>
                                        <p className="text-[11px] text-slate-500 leading-snug">
                                            QRIS (GoPay/ShopeePay) & Virtual Account (BCA, Mandiri, BRI, BNI).
                                        </p>
                                    </div>
                                </label>

                                {/* Bank Transfer */}
                                <label
                                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                        data.payment_method === 'bank_transfer'
                                            ? 'bg-sky-50/60 border-dunia-blue ring-1 ring-dunia-blue'
                                            : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <CreditCard className="w-5 h-5 text-dunia-blue" />
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="bank_transfer"
                                                checked={data.payment_method === 'bank_transfer'}
                                                onChange={() => setData('payment_method', 'bank_transfer')}
                                                className="text-dunia-blue"
                                            />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900">Transfer Manual</p>
                                        <p className="text-[11px] text-slate-500 leading-snug">
                                            BCA, Mandiri, BRI. Unggah bukti transfer ke rekening toko.
                                        </p>
                                    </div>
                                </label>

                                {/* QRIS */}
                                <label
                                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                        data.payment_method === 'qris'
                                            ? 'bg-sky-50/60 border-dunia-blue ring-1 ring-dunia-blue'
                                            : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <QrCode className="w-5 h-5 text-teal-600" />
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="qris"
                                                checked={data.payment_method === 'qris'}
                                                onChange={() => setData('payment_method', 'qris')}
                                                className="text-dunia-blue"
                                            />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900">QRIS Toko Manual</p>
                                        <p className="text-[11px] text-slate-500 leading-snug">
                                            Scan barcode QRIS statis dari profil toko penangkar.
                                        </p>
                                    </div>
                                </label>

                                {/* COD */}
                                <label
                                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                        data.payment_method === 'cod'
                                            ? 'bg-sky-50/60 border-dunia-blue ring-1 ring-dunia-blue'
                                            : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Banknote className="w-5 h-5 text-amber-600" />
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cod"
                                                checked={data.payment_method === 'cod'}
                                                onChange={() => setData('payment_method', 'cod')}
                                                className="text-dunia-blue"
                                            />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900">Bayar di Tempat (COD)</p>
                                        <p className="text-[11px] text-slate-500 leading-snug">
                                            Khusus kurir toko lokal / pengiriman sameday terjangkau.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Catatan Tambahan Pengiriman */}
                        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-3">
                            <label className="block text-xs font-bold text-slate-700 uppercase">
                                Catatan Khusus Pengiriman (Opsional)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Contoh: Titipkan di satpam jika tidak ada orang di rumah, packing ekstra styrofoam..."
                                value={data.shipping_notes}
                                onChange={(e) => setData('shipping_notes', e.target.value)}
                                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua"
                            />
                        </div>
                    </div>

                    {/* Right Column: Breakdown Per Store & Order Finalization */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-5 sticky top-24">
                            <h3 className="font-extrabold text-base text-dunia-navy pb-3 border-b border-slate-100">
                                Rincian Pesanan Toko
                            </h3>

                            {/* Store Breakdowns */}
                            <div className="space-y-4">
                                {groupedCart.map((grp, i) => (
                                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                                        <div className="flex items-center justify-between font-bold text-slate-800">
                                            <span className="flex items-center gap-1.5">
                                                <Store className="w-3.5 h-3.5 text-dunia-marine" />
                                                {grp.store.name}
                                            </span>
                                            <span>{formatPrice(grp.subtotalWithShipping)}</span>
                                        </div>
                                        <div className="space-y-1 text-slate-500 text-[11px]">
                                            {grp.items.map((it) => (
                                                <div key={it.id} className="flex justify-between">
                                                    <span className="truncate max-w-[170px]">{it.quantity}x {it.product.name}</span>
                                                    <span>{formatPrice(it.product.price * it.quantity)}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between pt-1 text-slate-400 border-t border-slate-200">
                                                <span>Ongkir Box Styrofoam & Oksigen</span>
                                                <span>{formatPrice(grp.shippingCost)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Grand Total Calculation */}
                            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                                <div className="flex justify-between">
                                    <span>Total Produk:</span>
                                    <span className="font-bold text-slate-800">{formatPrice(totalProducts)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Ongkos Kirim:</span>
                                    <span className="font-bold text-slate-800">{formatPrice(totalShipping)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-dunia-navy pt-2 border-t border-slate-200">
                                    <span>Total Pembayaran:</span>
                                    <span className="text-xl font-extrabold text-dunia-blue">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.address_id}
                                className="w-full py-3.5 px-6 rounded-2xl bg-dunia-blue hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-dunia-blue/20 transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {processing ? 'Memproses Pesanan...' : 'Buat & Konfirmasi Pesanan'}
                            </button>

                            <div className="p-3 rounded-xl bg-sky-50 text-[11px] text-sky-900 flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-dunia-aqua shrink-0 mt-0.5" />
                                <p>
                                    Stok dikunci otomatis saat pesanan dibuat. Anda dapat melihat detail rekening dan mengunggah bukti transfer setelah ini.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
