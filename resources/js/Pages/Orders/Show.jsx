import { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Package, 
    Store, 
    ArrowLeft, 
    CreditCard, 
    QrCode, 
    Truck, 
    CheckCircle2, 
    AlertCircle, 
    Upload, 
    ShieldCheck, 
    Clock,
    Zap,
    RefreshCw,
    ExternalLink
} from 'lucide-react';

export default function Show({ order, midtransClientKey, isMidtransProduction }) {
    const store = order.store;
    const [confirming, setConfirming] = useState(false);
    const [loadingSnap, setLoadingSnap] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);

    useEffect(() => {
        const snapScriptUrl = isMidtransProduction 
            ? 'https://app.midtrans.com/snap/snap.js' 
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
        
        const scriptId = 'midtrans-snap-script';
        if (!document.getElementById(scriptId) && midtransClientKey) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = snapScriptUrl;
            script.setAttribute('data-client-key', midtransClientKey);
            script.async = true;
            document.body.appendChild(script);
        }
    }, [midtransClientKey, isMidtransProduction]);

    const handlePayMidtrans = async () => {
        setLoadingSnap(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch(`/orders/${order.order_number}/snap-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });
            const result = await res.json();
            if (!res.ok) {
                alert(result.message || 'Gagal memuat sesi pembayaran Midtrans');
                return;
            }

            if (window.snap) {
                window.snap.pay(result.snap_token, {
                    onSuccess: (snapResult) => {
                        router.post(`/orders/${order.order_number}/midtrans-finish`, { result: snapResult }, {
                            preserveScroll: true,
                        });
                    },
                    onPending: (snapResult) => {
                        router.post(`/orders/${order.order_number}/midtrans-finish`, { result: snapResult }, {
                            preserveScroll: true,
                        });
                    },
                    onError: (snapResult) => {
                        alert('Pembayaran gagal atau dibatalkan.');
                    },
                    onClose: () => {
                        // User menutup pop-up Snap
                    }
                });
            } else {
                alert('Script Midtrans Snap sedang dimuat, silakan klik kembali dalam beberapa detik.');
            }
        } catch (err) {
            alert('Terjadi kesalahan koneksi saat memanggil Midtrans.');
        } finally {
            setLoadingSnap(false);
        }
    };

    const handleCheckStatus = () => {
        setCheckingStatus(true);
        router.post(`/orders/${order.order_number}/midtrans-status`, {}, {
            preserveScroll: true,
            onFinish: () => setCheckingStatus(false),
        });
    };

    const { data, setData, post, processing, errors } = useForm({
        payment_proof: null,
        payment_notes: '',
    });

    const handleUploadProof = (e) => {
        e.preventDefault();
        post(`/orders/${order.order_number}/proof`, {
            preserveScroll: true,
        });
    };

    const handleConfirmDelivery = () => {
        if (confirm('Konfirmasi bahwa paket ikan hias telah Anda terima dengan selamat?')) {
            setConfirming(true);
            router.post(`/orders/${order.order_number}/confirm`, {}, {
                preserveScroll: true,
                onFinish: () => setConfirming(false),
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const steps = [
        { key: 'pending_payment', label: 'Menunggu Bayar' },
        { key: 'awaiting_confirmation', label: 'Verifikasi' },
        { key: 'processing', label: 'Diproses' },
        { key: 'shipped', label: 'Dikirim' },
        { key: 'delivered', label: 'Selesai' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === order.status);

    return (
        <AppLayout>
            <Head title={`Pesanan ${order.order_number} - Dunia Ikan`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Back button */}
                <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Pesanan
                </Link>

                {/* Order Header */}
                <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                        <div>
                            <span className="text-xs text-slate-400 font-semibold">Nomor Pesanan</span>
                            <h1 className="text-2xl font-extrabold text-dunia-navy">{order.order_number}</h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Dibuat pada {new Date(order.created_at).toLocaleString('id-ID')}
                            </p>
                        </div>

                        <div className="text-right">
                            <span className="text-xs text-slate-400 font-semibold">Total Tagihan</span>
                            <p className="text-2xl font-extrabold text-dunia-blue">
                                {formatPrice(order.grand_total)}
                            </p>
                        </div>
                    </div>

                    {/* Status Stepper */}
                    {order.status !== 'cancelled' ? (
                        <div className="py-2">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-0"></div>
                                <div
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-dunia-blue -z-0 transition-all duration-300"
                                    style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
                                ></div>

                                {steps.map((st, idx) => {
                                    const isPassed = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    return (
                                        <div key={st.key} className="flex flex-col items-center gap-1.5 z-10 bg-white px-1">
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                                    isPassed
                                                        ? 'bg-dunia-blue text-white shadow-xs'
                                                        : 'bg-slate-100 text-slate-400'
                                                } ${isCurrent ? 'ring-4 ring-sky-100' : ''}`}
                                            >
                                                {idx + 1}
                                            </div>
                                            <span className={`text-[11px] font-bold ${isPassed ? 'text-dunia-navy' : 'text-slate-400'}`}>
                                                {st.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl text-center">
                            Pesanan ini telah dibatalkan.
                        </div>
                    )}
                </div>

                {/* Shipping & Courier Information */}
                {order.shipping_tracking_number && (
                    <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
                                <Truck className="w-5 h-5 text-indigo-600" />
                                <span>Informasi Pengiriman Ikan</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                                Sedang Dikirim
                            </span>
                        </div>
                        <p className="text-indigo-800">
                            Kurir: <strong>{order.shipping_courier || 'Kurir Khusus Ikan'}</strong> | No. Resi: <strong className="font-mono text-sm">{order.shipping_tracking_number}</strong>
                        </p>
                        <p className="text-slate-500 text-[11px]">
                            * Ikan dikemas dengan tabung oksigen bertekanan dan kotak styrofoam tahan suhu.
                        </p>

                        {order.status === 'shipped' && (
                            <div className="pt-2">
                                <button
                                    onClick={handleConfirmDelivery}
                                    disabled={confirming}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {confirming ? 'Menyimpan...' : 'Konfirmasi Paket Diterima'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Verified Payment Status Banner */}
                {order.payment_status === 'verified' && (
                    <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-extrabold text-emerald-950">Pembayaran Terverifikasi (Lunas)</h4>
                                <p className="text-emerald-700 mt-0.5">
                                    {order.payment_notes || 'Pembayaran telah divalidasi dan pesanan diteruskan ke penangkar.'}
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] shrink-0">
                            LUNAS
                        </span>
                    </div>
                )}

                {/* Bank / QRIS Instructions & Midtrans Gateway */}
                {order.payment_status !== 'verified' && order.status !== 'cancelled' && (
                    <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                            <div className="flex items-center gap-2 text-sm font-bold text-dunia-navy">
                                <CreditCard className="w-4 h-4 text-dunia-blue" />
                                <span>Penyelesaian Pembayaran Pesanan</span>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                Menunggu Pembayaran
                            </span>
                        </div>

                        {/* Midtrans Snap Gateway (Otomatis & Realtime) */}
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-sky-50/90 border border-blue-200/80 space-y-3.5 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start sm:items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-dunia-blue text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                                        <Zap className="w-5 h-5 fill-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-dunia-navy flex items-center gap-2">
                                            <span>Pembayaran Otomatis Midtrans</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                                Instant
                                            </span>
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            QRIS (GoPay/ShopeePay/BCA) & Virtual Account (BCA, Mandiri, BRI, BNI). Langsung lunas otomatis!
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={handlePayMidtrans}
                                        disabled={loadingSnap}
                                        className="px-5 py-2.5 rounded-xl bg-dunia-blue hover:bg-sky-600 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        <Zap className="w-4 h-4 fill-white" />
                                        {loadingSnap ? 'Memuat Snap...' : 'Bayar Sekarang (Midtrans)'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCheckStatus}
                                        disabled={checkingStatus}
                                        className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        title="Cek Status Pembayaran dari Midtrans"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? 'animate-spin' : ''}`} />
                                        <span className="hidden sm:inline">{checkingStatus ? 'Mengecek...' : 'Cek Status'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Manual Transfer / QRIS / COD fallback section */}
                        {order.payment_method === 'bank_transfer' && (
                            <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-100 space-y-2 text-xs">
                                <p className="font-bold text-slate-800">Atau Transfer Manual ke Rekening Toko ({store?.name}):</p>
                                <div className="space-y-1 font-mono text-sm">
                                    <p>Bank: <strong className="font-sans text-dunia-navy">{store?.bank_name || 'BCA'}</strong></p>
                                    <p>No. Rekening: <strong className="text-dunia-blue text-base font-bold">{store?.bank_account_number || '7820192837'}</strong></p>
                                    <p>Atas Nama: <strong className="font-sans text-slate-800">{store?.bank_account_name || store?.name}</strong></p>
                                </div>
                                <p className="text-[11px] text-slate-500 pt-1">
                                    Transfer sesuai nominal persis: <strong>{formatPrice(order.grand_total)}</strong>
                                </p>
                            </div>
                        )}

                        {order.payment_method === 'qris' && (
                            <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-100 space-y-3 text-xs text-center">
                                <p className="font-bold text-teal-900">Atau Scan QRIS Manual Toko ({store?.name}):</p>
                                {store?.qris_image ? (
                                    <img src={`/storage/${store.qris_image}`} alt="QRIS Toko" className="w-48 h-48 mx-auto object-contain border rounded-xl bg-white p-2" />
                                ) : (
                                    <div className="w-44 h-44 bg-white border border-teal-200 rounded-xl mx-auto flex items-center justify-center text-teal-600 font-bold">
                                        [QRIS TOKO STATIS]
                                    </div>
                                )}
                                <p className="text-[11px] text-slate-500">
                                    Scan melalui GoPay, OVO, Dana, ShopeePay, atau BCA Mobile
                                </p>
                            </div>
                        )}

                        {order.payment_method === 'cod' && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                                <p className="font-bold">Pembayaran Tunai (Cash on Delivery)</p>
                                <p>
                                    Siapkan uang pas sebesar <strong>{formatPrice(order.grand_total)}</strong> saat kurir toko mengantarkan ikan ke alamat Anda.
                                </p>
                            </div>
                        )}

                        {/* Upload Proof Form (for manual transfer & manual qris) */}
                        {order.payment_method !== 'cod' && (
                            <form onSubmit={handleUploadProof} className="pt-4 border-t border-slate-100 space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700 uppercase">
                                        Unggah Foto Bukti Transfer Manual (Opsional jika bayar via transfer manual)
                                    </label>
                                    <p className="text-[11px] text-slate-400">
                                        Format JPEG, PNG, JPG maksimal 3MB. Jika bayar via tombol Midtrans di atas, Anda tidak perlu mengunggah bukti.
                                    </p>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('payment_proof', e.target.files[0])}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-dunia-blue hover:file:bg-sky-100 cursor-pointer"
                                />
                                {errors.payment_proof && (
                                    <p className="text-xs text-rose-600 font-semibold">{errors.payment_proof}</p>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Catatan Pembayaran (Opsional, e.g. nama rekening pengirim):
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Transfer dari rekening BCA a.n Andi"
                                        value={data.payment_notes}
                                        onChange={(e) => setData('payment_notes', e.target.value)}
                                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.payment_proof}
                                    className="px-5 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 disabled:opacity-50 transition cursor-pointer flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                                </button>

                                {order.payment_proof && (
                                    <div className="pt-3 flex items-center gap-3">
                                        <span className="text-xs text-slate-500">Bukti yang telah diunggah:</span>
                                        <a
                                            href={`/storage/${order.payment_proof}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-bold text-dunia-blue underline"
                                        >
                                            Lihat Bukti Terkirim
                                        </a>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                )}

                {/* Items & Store Details */}
                <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-4">
                    <h3 className="font-bold text-sm text-dunia-navy uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                        <Store className="w-4 h-4 text-dunia-marine" />
                        Detail Ikan & Produk dari {store?.name}
                    </h3>

                    <div className="divide-y divide-slate-100">
                        {order.items?.map((item) => (
                            <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{item.product_name}</p>
                                    <p className="text-slate-500">
                                        {item.quantity} ekor x {formatPrice(item.price)}
                                    </p>
                                </div>
                                <p className="font-bold text-slate-900 text-sm">
                                    {formatPrice(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                            <span>Subtotal Produk:</span>
                            <span className="font-bold text-slate-800">{formatPrice(order.total_product_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Biaya Pengiriman & Box Oksigen:</span>
                            <span className="font-bold text-slate-800">{formatPrice(order.shipping_cost)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-dunia-navy text-sm pt-2 border-t border-slate-200">
                            <span>Total Tagihan:</span>
                            <span className="text-dunia-blue font-extrabold text-base">{formatPrice(order.grand_total)}</span>
                        </div>
                    </div>
                </div>

                {/* Recipient Details & DOA Policy Reminder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-sky-100 text-xs space-y-2">
                        <p className="font-bold text-dunia-navy uppercase">Alamat Penerima:</p>
                        <p className="font-semibold text-slate-800">{order.shipping_recipient_name} ({order.shipping_phone})</p>
                        <p className="text-slate-600">{order.shipping_address}</p>
                        {order.shipping_notes && (
                            <p className="text-slate-400 italic">Catatan: {order.shipping_notes}</p>
                        )}
                    </div>

                    <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-100 text-xs space-y-2">
                        <p className="font-bold text-dunia-navy uppercase flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                            Kebijakan Garansi Ikan Hidup (DOA):
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            {store?.doa_policy || 'Wajib menyertakan video unboxing utuh tanpa jeda maksimal 2 jam setelah ikan diterima.'}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
