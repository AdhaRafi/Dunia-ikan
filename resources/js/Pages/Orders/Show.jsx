import { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import axios from 'axios';
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
import { useLanguage } from '@/lib/i18n';

export default function Show({ order, midtransClientKey, isMidtransProduction }) {
    const { isEn, pick, trOrderStatus } = useLanguage();
    const store = order.store;
    const isCod = order.payment_method === 'cod';
    const showMidtrans =
        order.payment_method === 'midtrans' ||
        (order.payment_method === 'qris' && !store?.qris_image);
    const showManualProofUpload =
        order.payment_method === 'bank_transfer' ||
        order.payment_method === 'qris';
    const [confirming, setConfirming] = useState(false);
    const [loadingSnap, setLoadingSnap] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [midtransError, setMidtransError] = useState('');

    const ensureSnapLoaded = (clientKey, productionMode) => {
        if (window.snap) {
            return Promise.resolve(window.snap);
        }
        if (!clientKey) {
            return Promise.reject(new Error('missing_client_key'));
        }

        const snapScriptUrl = productionMode
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
        const scriptId = 'midtrans-snap-script';

        return new Promise((resolve, reject) => {
            let script = document.getElementById(scriptId);
            if (script && script.src !== snapScriptUrl) {
                script.remove();
                script = null;
            }
            const onLoad = () => {
                if (window.snap) {
                    resolve(window.snap);
                } else {
                    script?.remove();
                    reject(new Error('snap_unavailable'));
                }
            };
            const onError = () => {
                script?.remove();
                reject(new Error('snap_load_failed'));
            };

            if (!script) {
                script = document.createElement('script');
                script.id = scriptId;
                script.src = snapScriptUrl;
                script.setAttribute('data-client-key', clientKey);
                script.async = true;
                script.addEventListener('load', onLoad, { once: true });
                script.addEventListener('error', onError, { once: true });
                document.body.appendChild(script);
                return;
            }

            script.addEventListener('load', onLoad, { once: true });
            script.addEventListener('error', onError, { once: true });
        });
    };

    useEffect(() => {
        if (showMidtrans && midtransClientKey) {
            ensureSnapLoaded(midtransClientKey, isMidtransProduction).catch(() => {});
        }
    }, [showMidtrans, midtransClientKey, isMidtransProduction]);

    const handlePayMidtrans = async () => {
        setLoadingSnap(true);
        setMidtransError('');
        try {
            const { data: result } = await axios.post(`/orders/${order.order_number}/snap-token`);
            const snap = await ensureSnapLoaded(
                result.client_key || midtransClientKey,
                result.is_production ?? isMidtransProduction
            );

            snap.pay(result.snap_token, {
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
                onError: () => {
                    setMidtransError(
                        pick('Pembayaran gagal atau dibatalkan.', 'Payment failed or cancelled.')
                    );
                },
                onClose: () => {
                    // User closed Snap popup
                },
            });
        } catch (err) {
            const serverMessage = err?.response?.data?.message;
            setMidtransError(
                serverMessage ||
                    pick(
                        'Gagal memuat pop-up pembayaran Midtrans. Pastikan koneksi lancar atau gunakan unggah bukti manual di bawah.',
                        'Failed to open Midtrans payment pop-up. Please check your connection or use manual upload below.'
                    )
            );
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
        if (
            confirm(
                pick(
                    'Konfirmasi bahwa paket ikan hias telah Anda terima dengan selamat?',
                    'Confirm that your ornamental fish package arrived safely?'
                )
            )
        ) {
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

    const steps = isCod
        ? [
              { key: 'pending_payment', label: pick('Pesanan Dibuat', 'Order Placed') },
              { key: 'processing', label: pick('Diproses', 'Processing') },
              { key: 'shipped', label: pick('Dikirim', 'Shipped') },
              { key: 'delivered', label: pick('Selesai & Bayar Tunai', 'Delivered & Paid') },
          ]
        : [
              { key: 'pending_payment', label: pick('Menunggu Bayar', 'Awaiting Payment') },
              { key: 'awaiting_confirmation', label: pick('Verifikasi', 'Verification') },
              { key: 'processing', label: pick('Diproses', 'Processing') },
              { key: 'shipped', label: pick('Dikirim', 'Shipped') },
              { key: 'delivered', label: pick('Selesai', 'Delivered') },
          ];

    const resolvedStepIndex = steps.findIndex((s) => s.key === order.status);
    const currentStepIndex = resolvedStepIndex >= 0
        ? resolvedStepIndex
        : (isCod && order.status === 'awaiting_confirmation' ? 1 : 0);

    return (
        <AppLayout>
            <Head title={`${pick('Pesanan', 'Order')} ${order.order_number} - Dunia Ikan`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Back button */}
                <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    {pick('Kembali ke Daftar Pesanan', 'Back to Orders')}
                </Link>

                {/* Order Header */}
                <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                        <div>
                            <span className="text-xs text-slate-400 font-semibold">
                                {pick('Nomor Pesanan', 'Order Number')}
                            </span>
                            <h1 className="text-2xl font-extrabold text-dunia-navy">{order.order_number}</h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {pick('Dibuat pada', 'Placed on')}{' '}
                                {new Date(order.created_at).toLocaleString(isEn ? 'en-US' : 'id-ID')}
                            </p>
                        </div>

                        <div className="text-right">
                            <span className="text-xs text-slate-400 font-semibold">
                                {pick('Total Tagihan', 'Total Due')}
                            </span>
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
                            {pick('Pesanan ini telah dibatalkan.', 'This order has been cancelled.')}
                        </div>
                    )}
                </div>

                {/* Shipping & Courier Information */}
                {order.shipping_tracking_number && (
                    <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
                                <Truck className="w-5 h-5 text-indigo-600" />
                                <span>{pick('Informasi Pengiriman Ikan', 'Fish Shipment Info')}</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                                {trOrderStatus('shipped')}
                            </span>
                        </div>
                        <p className="text-indigo-800">
                            {pick('Kurir:', 'Courier:')}{' '}
                            <strong>{order.shipping_courier || pick('Kurir Khusus Ikan', 'Live Fish Courier')}</strong> |{' '}
                            {pick('No. Resi:', 'Tracking No.:')}{' '}
                            <strong className="font-mono text-sm">{order.shipping_tracking_number}</strong>
                        </p>
                        <p className="text-slate-500 text-[11px]">
                            {pick(
                                '* Ikan dikemas dengan tabung oksigen bertekanan dan kotak styrofoam tahan suhu.',
                                '* Fish are packed with pressurized oxygen and temperature-insulated styrofoam boxes.'
                            )}
                        </p>

                        {order.status === 'shipped' && (
                            <div className="pt-2">
                                <button
                                    onClick={handleConfirmDelivery}
                                    disabled={confirming}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {confirming
                                        ? pick('Menyimpan...', 'Saving...')
                                        : pick('Konfirmasi Paket Diterima', 'Confirm Package Received')}
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
                                <h4 className="text-sm font-extrabold text-emerald-950">
                                    {pick('Pembayaran Terverifikasi (Lunas)', 'Payment Verified (Paid)')}
                                </h4>
                                <p className="text-emerald-700 mt-0.5">
                                    {order.payment_notes ||
                                        pick(
                                            'Pembayaran telah divalidasi dan pesanan diteruskan ke penangkar.',
                                            'Payment has been validated and forwarded to the breeder store.'
                                        )}
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] shrink-0">
                            {pick('LUNAS', 'PAID')}
                        </span>
                    </div>
                )}

                {/* COD Info Card */}
                {order.payment_status !== 'verified' && order.status !== 'cancelled' && isCod && (
                    <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                            <div className="flex items-center gap-2 text-sm font-bold text-dunia-navy">
                                <Truck className="w-4 h-4 text-amber-600" />
                                <span>{pick('Pembayaran Tunai di Tempat (COD)', 'Cash on Delivery (COD)')}</span>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                {order.status === 'shipped'
                                    ? trOrderStatus('shipped')
                                    : pick('Langsung Diproses · Bayar saat Tiba', 'Processing · Pay on Delivery')}
                            </span>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                            <p className="font-bold">
                                {pick(
                                    'Pesanan langsung diteruskan ke penangkar tanpa pembayaran online.',
                                    'Order goes straight to the breeder — no online payment needed.'
                                )}
                            </p>
                            <p>
                                {pick(
                                    'Anda tidak perlu memilih metode pembayaran atau membayar melalui Midtrans. Siapkan uang tunai pas sebesar',
                                    'No Midtrans payment selection or receipt upload is required. Prepare exact cash of'
                                )}{' '}
                                <strong>{formatPrice(order.grand_total)}</strong>{' '}
                                {pick(
                                    'saat kurir mengantarkan ikan ke alamat Anda.',
                                    'when the courier delivers your order.'
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Bank / QRIS Instructions & Midtrans Gateway */}
                {order.payment_status !== 'verified' && order.status !== 'cancelled' && !isCod && (
                    <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                            <div className="flex items-center gap-2 text-sm font-bold text-dunia-navy">
                                <CreditCard className="w-4 h-4 text-dunia-blue" />
                                <span>{pick('Penyelesaian Pembayaran Pesanan', 'Complete Order Payment')}</span>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                {trOrderStatus('pending_payment')}
                            </span>
                        </div>

                        {/* Midtrans Snap Gateway (hanya untuk metode Midtrans atau fallback QRIS jika toko belum upload gambar) */}
                        {showMidtrans && (
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-sky-50/90 border border-blue-200/80 space-y-3.5 shadow-xs">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-start sm:items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-dunia-blue text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                                            <Zap className="w-5 h-5 fill-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-extrabold text-dunia-navy flex items-center gap-2">
                                                <span>{pick('Pembayaran Otomatis Midtrans', 'Midtrans Instant Payment')}</span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                                    Instant
                                                </span>
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {pick(
                                                    'QRIS (GoPay/ShopeePay/BCA) & Virtual Account (BCA, Mandiri, BRI, BNI). Langsung lunas otomatis!',
                                                    'QRIS (GoPay/ShopeePay/BCA) & Virtual Account (BCA, Mandiri, BRI, BNI). Verified automatically!'
                                                )}
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
                                            {loadingSnap
                                                ? pick('Memuat Snap...', 'Loading Snap...')
                                                : pick('Bayar Sekarang (Midtrans)', 'Pay Now (Midtrans)')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCheckStatus}
                                            disabled={checkingStatus}
                                            className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                            title={pick('Cek Status Pembayaran dari Midtrans', 'Check Payment Status via Midtrans')}
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? 'animate-spin' : ''}`} />
                                            <span className="hidden sm:inline">
                                                {checkingStatus ? pick('Mengecek...', 'Checking...') : pick('Cek Status', 'Check Status')}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {midtransError && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                                        <span>{midtransError}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bank Transfer Details (also shown as manual fallback if legacy QRIS order has no store QRIS image) */}
                        {(order.payment_method === 'bank_transfer' || (order.payment_method === 'qris' && !store?.qris_image)) && (
                            <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-100 space-y-2 text-xs">
                                {order.payment_method === 'qris' && !store?.qris_image && (
                                    <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
                                        {pick(
                                            'Toko ini belum mengunggah gambar QRIS statis. Gunakan QRIS instan via Midtrans di atas atau transfer manual ke rekening toko berikut:',
                                            'This store has not uploaded a static QRIS image yet. Use instant QRIS via Midtrans above or transfer to the store account below:'
                                        )}
                                    </p>
                                )}
                                <p className="font-bold text-slate-800">
                                    {pick('Transfer Manual ke Rekening Toko', 'Bank Transfer to Store Account')} ({store?.name}):
                                </p>
                                <div className="space-y-1 font-mono text-sm">
                                    <p>Bank: <strong className="font-sans text-dunia-navy">{store?.bank_name || 'BCA'}</strong></p>
                                    <p>{pick('No. Rekening:', 'Account Number:')} <strong className="text-dunia-blue text-base font-bold">{store?.bank_account_number || '7820192837'}</strong></p>
                                    <p>{pick('Atas Nama:', 'Account Name:')} <strong className="font-sans text-slate-800">{store?.bank_account_name || store?.name}</strong></p>
                                </div>
                                <p className="text-[11px] text-slate-500 pt-1">
                                    {pick('Transfer sesuai nominal persis:', 'Transfer the exact amount:')}{' '}
                                    <strong>{formatPrice(order.grand_total)}</strong>
                                </p>
                            </div>
                        )}

                        {order.payment_method === 'qris' && store?.qris_image && (
                            <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-100 space-y-3 text-xs text-center">
                                <p className="font-bold text-teal-900">
                                    {pick('Scan QRIS Toko', 'Scan Store QRIS')} ({store?.name}):
                                </p>
                                <img src={`/storage/${store.qris_image}`} alt="QRIS Toko" className="w-48 h-48 mx-auto object-contain border rounded-xl bg-white p-2" />
                                <p className="text-[11px] text-slate-500">
                                    {pick(
                                        'Scan melalui GoPay, OVO, Dana, ShopeePay, atau BCA Mobile, lalu unggah bukti pembayaran di bawah.',
                                        'Scan via GoPay, OVO, Dana, ShopeePay, or any mobile banking app, then upload proof below.'
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Upload Proof Form (for manual transfer & manual qris) */}
                        {showManualProofUpload && (
                            <form onSubmit={handleUploadProof} className="pt-4 border-t border-slate-100 space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700 uppercase">
                                        {pick(
                                            'Unggah Foto Bukti Pembayaran / Transfer',
                                            'Upload Payment / Transfer Receipt'
                                        )}
                                    </label>
                                    <p className="text-[11px] text-slate-400">
                                        {pick(
                                            'Format JPEG, PNG, JPG maksimal 3MB agar penjual dapat memverifikasi pembayaran Anda.',
                                            'JPEG, PNG, JPG up to 3MB so the seller can verify your payment.'
                                        )}
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
                                        {pick(
                                            'Catatan Pembayaran (Opsional, e.g. nama rekening pengirim):',
                                            'Payment Notes (Optional, e.g. sender account name):'
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={pick(
                                            'Contoh: Transfer dari rekening BCA a.n Andi',
                                            'Example: Transfer from BCA account under Andi'
                                        )}
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
                                    {processing
                                        ? pick('Mengunggah...', 'Uploading...')
                                        : pick('Kirim Bukti Pembayaran', 'Submit Payment Proof')}
                                </button>

                                {order.payment_proof && (
                                    <div className="pt-3 flex items-center gap-3">
                                        <span className="text-xs text-slate-500">
                                            {pick('Bukti yang telah diunggah:', 'Uploaded proof:')}
                                        </span>
                                        <a
                                            href={`/storage/${order.payment_proof}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs font-bold text-dunia-blue underline"
                                        >
                                            {pick('Lihat Bukti Terkirim', 'View Submitted Proof')}
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
                        {pick('Detail Ikan & Produk dari', 'Items from')} {store?.name}
                    </h3>

                    <div className="divide-y divide-slate-100">
                        {order.items?.map((item) => (
                            <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{item.product_name}</p>
                                    <p className="text-slate-500">
                                        {item.quantity} {pick('ekor', 'pcs')} x {formatPrice(item.price)}
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
                            <span>{pick('Subtotal Produk:', 'Items Subtotal:')}</span>
                            <span className="font-bold text-slate-800">{formatPrice(order.total_product_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{pick('Biaya Pengiriman & Box Oksigen:', 'Shipping & Oxygen Packing:')}</span>
                            <span className="font-bold text-slate-800">{formatPrice(order.shipping_cost)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-dunia-navy text-sm pt-2 border-t border-slate-200">
                            <span>{pick('Total Tagihan:', 'Grand Total:')}</span>
                            <span className="text-dunia-blue font-extrabold text-base">{formatPrice(order.grand_total)}</span>
                        </div>
                    </div>
                </div>

                {/* Recipient Details & DOA Policy Reminder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-sky-100 text-xs space-y-2">
                        <p className="font-bold text-dunia-navy uppercase">
                            {pick('Alamat Penerima:', 'Recipient Address:')}
                        </p>
                        <p className="font-semibold text-slate-800">{order.shipping_recipient_name} ({order.shipping_phone})</p>
                        <p className="text-slate-600">{order.shipping_address}</p>
                        {order.shipping_notes && (
                            <p className="text-slate-400 italic">
                                {pick('Catatan:', 'Notes:')} {order.shipping_notes}
                            </p>
                        )}
                    </div>

                    <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-100 text-xs space-y-2">
                        <p className="font-bold text-dunia-navy uppercase flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-dunia-aqua" />
                            {pick('Kebijakan Garansi Ikan Hidup (DOA):', 'Live Arrival Guarantee (DOA Policy):')}
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            {store?.doa_policy ||
                                pick(
                                    'Wajib menyertakan video unboxing utuh tanpa jeda maksimal 2 jam setelah ikan diterima.',
                                    'An unedited continuous unboxing video within 2 hours of delivery is required for DOA claims.'
                                )}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
