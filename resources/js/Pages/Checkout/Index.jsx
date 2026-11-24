import { useState, useEffect } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
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
    Wallet,
    X 
} from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';

export default function Index({ groupedCart, addresses = [], totalProducts, totalShipping, grandTotal, supportsManualQris = false }) {
    const { pick } = useLanguage();
    const { auth } = usePage().props;
    const currentUser = auth?.user;
    const primaryAddress = addresses?.find((a) => a.is_primary) || addresses?.[0];

    const { data, setData, post, processing, errors } = useForm({
        address_id: primaryAddress?.id || '',
        payment_method: 'midtrans',
        shipping_notes: '',
    });

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [addressForm, setAddressForm] = useState({
        recipient_name: currentUser?.name || 'Administrator Dunia Ikan',
        phone: currentUser?.phone || '081234567890',
        city: 'Kota Bandung',
        province: 'Jawa Barat',
        postal_code: '40287',
        full_address: '',
    });

    useEffect(() => {
        if (currentUser?.name) {
            setAddressForm((prev) => ({
                ...prev,
                recipient_name: prev.recipient_name || currentUser.name,
                phone: (prev.phone && prev.phone !== '08') ? prev.phone : (currentUser.phone || '081234567890'),
            }));
        }
    }, [currentUser]);

    // Auto-select address when newly created
    useEffect(() => {
        if (!data.address_id && addresses?.length > 0) {
            setData('address_id', addresses[0].id);
        }
    }, [addresses]);

    const handleSaveAddress = (e) => {
        e.preventDefault();
        setSavingAddress(true);
        setAddressError('');
        router.post('/addresses', addressForm, {
            preserveScroll: true,
            onSuccess: (page) => {
                setShowAddressModal(false);
                const updated = page.props.addresses || [];
                if (updated.length > 0) {
                    setData('address_id', updated[0].id);
                }
            },
            onError: (errs) => {
                setAddressError(
                    Object.values(errs)[0] ||
                        pick(
                            'Gagal menyimpan alamat. Mohon lengkapi formulir.',
                            'Failed to save address. Please complete all required fields.'
                        )
                );
            },
            onFinish: () => setSavingAddress(false),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.address_id) {
            setShowAddressModal(true);
            return;
        }
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
            <Head title={pick('Checkout Pembelian Ikan - Dunia Ikan', 'Checkout — Dunia Ikan')} />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-dunia-blue dark:hover:text-[#60C2E6] mb-6 transition">
                    <ArrowLeft className="w-4 h-4" />
                    {pick('Kembali ke Keranjang', 'Back to Cart')}
                </Link>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-dunia-navy dark:text-white tracking-tight mb-8">
                    {pick('Checkout Pembelian', 'Checkout')}
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Address & Payment Methods */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 1. Alamat Pengiriman */}
                        <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="font-bold text-sm text-dunia-navy dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#005A9D] dark:text-[#60C2E6]" />
                                    {pick('1. Alamat Tujuan Pengiriman Ikan', '1. Shipping Address')}
                                </h2>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressModal(true)}
                                        className="text-xs font-bold text-[#005A9D] dark:text-sky-300 hover:text-[#006783] flex items-center gap-1 cursor-pointer bg-blue-50 dark:bg-[#131d33] px-2.5 py-1.5 rounded-xl transition"
                                    >
                                        <PlusCircle className="w-3.5 h-3.5" />
                                        {pick('+ Tambah Alamat Baru', '+ Add New Address')}
                                    </button>
                                    <Link
                                        href="/addresses"
                                        className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hidden sm:inline"
                                    >
                                        {pick('Kelola', 'Manage')}
                                    </Link>
                                </div>
                            </div>

                            {addresses?.length > 0 ? (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <label
                                            key={addr.id}
                                            className={`block p-4 rounded-xl border cursor-pointer transition ${
                                                data.address_id === addr.id
                                                    ? 'bg-sky-50/60 dark:bg-[#131d33] border-[#005A9D] ring-2 ring-[#005A9D]/30'
                                                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#131d33]/60'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    name="address_id"
                                                    value={addr.id}
                                                    checked={data.address_id === addr.id}
                                                    onChange={() => setData('address_id', addr.id)}
                                                    className="mt-1 text-[#005A9D] focus:ring-[#005A9D]"
                                                />
                                                <div className="text-xs space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{addr.recipient_name}</span>
                                                        <span className="text-slate-500 dark:text-slate-400">({addr.phone})</span>
                                                        {addr.is_primary && (
                                                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-[#005A9D]/20 text-[#005A9D] dark:text-sky-300 font-bold text-[10px]">
                                                                {pick('Utama', 'Primary')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                        {addr.full_address}, {addr.city}, {addr.province} {addr.postal_code}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-950 dark:text-amber-200 text-xs space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <p className="font-extrabold text-sm text-amber-900 dark:text-amber-100">
                                                {pick('Anda belum memiliki alamat pengiriman', 'No shipping address yet')}
                                            </p>
                                            <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                                                {pick(
                                                    'Ikan hidup memerlukan alamat pengiriman yang lengkap untuk kurir dan packing box beroksigen.',
                                                    'Live fish require a complete shipping address for courier delivery and oxygenated packing.'
                                                )}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddressModal(true)}
                                            className="px-4 py-2.5 rounded-xl bg-[#005A9D] hover:bg-[#006783] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            {pick('Tambah Alamat Sekarang', 'Add Address Now')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {errors.address_id && (
                                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{errors.address_id}</p>
                            )}
                        </div>

                        {/* 2. Metode Pembayaran Manual */}
                        <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-xs space-y-4">
                            <h2 className="font-bold text-sm text-dunia-navy dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <CreditCard className="w-4 h-4 text-dunia-blue dark:text-[#60C2E6]" />
                                {pick('2. Metode Pembayaran', '2. Payment Method')}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Midtrans Payment Gateway */}
                                <label
                                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                        data.payment_method === 'midtrans'
                                            ? 'bg-blue-50/70 dark:bg-[#131d33] border-dunia-blue ring-2 ring-dunia-blue'
                                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#131d33]/60'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <Wallet className="w-5 h-5 text-dunia-blue dark:text-[#60C2E6]" />
                                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-[#005A9D]/20 text-dunia-blue dark:text-sky-300">
                                                    {pick('Otomatis', 'Instant')}
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
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                                            {pick('Midtrans (QRIS & Virtual Account)', 'Midtrans (QRIS & Virtual Account)')}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                            {pick(
                                                'QRIS (GoPay, ShopeePay, DANA, OVO) & Virtual Account (BCA, Mandiri, BRI, BNI).',
                                                'QRIS (GoPay, ShopeePay, DANA, OVO) & Virtual Account (BCA, Mandiri, BRI, BNI).'
                                            )}
                                        </p>
                                    </div>
                                </label>

                                {/* Bank Transfer */}
                                <label
                                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                        data.payment_method === 'bank_transfer'
                                            ? 'bg-sky-50/60 dark:bg-[#131d33] border-dunia-blue ring-1 ring-dunia-blue'
                                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#131d33]/60'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <CreditCard className="w-5 h-5 text-dunia-blue dark:text-[#60C2E6]" />
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="bank_transfer"
                                                checked={data.payment_method === 'bank_transfer'}
                                                onChange={() => setData('payment_method', 'bank_transfer')}
                                                className="text-dunia-blue"
                                            />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                                            {pick('Transfer Manual', 'Bank Transfer')}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                            {pick(
                                                'BCA, Mandiri, BRI. Unggah bukti transfer ke rekening toko.',
                                                'BCA, Mandiri, BRI. Upload your transfer receipt to the store account.'
                                            )}
                                        </p>
                                    </div>
                                </label>

                                {/* QRIS */}
                                <label
                                    className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                                        !supportsManualQris
                                            ? 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 opacity-65 cursor-not-allowed'
                                            : data.payment_method === 'qris'
                                                ? 'bg-sky-50/60 dark:bg-[#131d33] border-dunia-blue ring-1 ring-dunia-blue cursor-pointer'
                                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#131d33]/60 cursor-pointer'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <QrCode className="w-5 h-5 text-teal-600 dark:text-[#60C2E6]" />
                                                {!supportsManualQris && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        {pick('Belum tersedia', 'Unavailable')}
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="qris"
                                                disabled={!supportsManualQris}
                                                checked={data.payment_method === 'qris'}
                                                onChange={() => supportsManualQris && setData('payment_method', 'qris')}
                                                className="text-dunia-blue disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                                            {pick('QRIS Toko Manual', 'Manual Store QRIS')}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                            {supportsManualQris
                                                ? pick(
                                                    'Scan barcode QRIS statis dari profil toko penangkar.',
                                                    'Scan the static QRIS code from the breeder store profile.'
                                                )
                                                : pick(
                                                    'Toko belum mengunggah gambar QRIS statis. Untuk bayar via QRIS, pilih Midtrans.',
                                                    'Store has not uploaded a static QRIS yet. Use Midtrans for QRIS.'
                                                )}
                                        </p>
                                    </div>
                                </label>

                                {/* COD */}
                                <label
                                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                                        data.payment_method === 'cod'
                                            ? 'bg-sky-50/60 dark:bg-[#131d33] border-dunia-blue ring-1 ring-dunia-blue'
                                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#131d33]/60'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Banknote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cod"
                                                checked={data.payment_method === 'cod'}
                                                onChange={() => setData('payment_method', 'cod')}
                                                className="text-dunia-blue"
                                            />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                                            {pick('Bayar di Tempat (COD)', 'Cash on Delivery (COD)')}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                            {pick(
                                                'Langsung checkout tanpa bayar online. Bayar tunai saat kurir tiba.',
                                                'Instant checkout without online payment. Pay cash when courier arrives.'
                                            )}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Catatan Tambahan Pengiriman */}
                        <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-xs space-y-3">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                                {pick('Catatan Khusus Pengiriman (Opsional)', 'Special Delivery Notes (Optional)')}
                            </label>
                            <textarea
                                rows={2}
                                placeholder={pick(
                                    'Contoh: Titipkan di satpam jika tidak ada orang di rumah, packing ekstra styrofoam...',
                                    'Example: Leave with security if nobody is home, extra styrofoam packing...'
                                )}
                                value={data.shipping_notes}
                                onChange={(e) => setData('shipping_notes', e.target.value)}
                                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-dunia-aqua"
                            />
                        </div>
                    </div>

                    {/* Right Column: Breakdown Per Store & Order Finalization */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-xs space-y-5 sticky top-24">
                            <h3 className="font-extrabold text-base text-dunia-navy dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                                {pick('Rincian Pesanan Toko', 'Order Breakdown by Store')}
                            </h3>

                            {/* Store Breakdowns */}
                            <div className="space-y-4">
                                {groupedCart.map((grp, i) => (
                                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131d33] border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-white">
                                            <span className="flex items-center gap-1.5">
                                                <Store className="w-3.5 h-3.5 text-dunia-marine dark:text-[#60C2E6]" />
                                                {grp.store.name}
                                            </span>
                                            <span>{formatPrice(grp.subtotalWithShipping)}</span>
                                        </div>
                                        <div className="space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                                            {grp.items.map((it) => (
                                                <div key={it.id} className="flex justify-between">
                                                    <span className="truncate max-w-[170px]">{it.quantity}x {it.product.name}</span>
                                                    <span>{formatPrice(it.product.price * it.quantity)}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between pt-1 text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-700">
                                                <span>{pick('Ongkir Box Styrofoam & Oksigen', 'Styrofoam Box & Oxygen Shipping')}</span>
                                                <span>{formatPrice(grp.shippingCost)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Grand Total Calculation */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                <div className="flex justify-between">
                                    <span>{pick('Total Produk:', 'Subtotal:')}</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(totalProducts)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{pick('Total Ongkos Kirim:', 'Total Shipping:')}</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(totalShipping)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-dunia-navy dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                                    <span>{pick('Total Pembayaran:', 'Grand Total:')}</span>
                                    <span className="text-xl font-extrabold text-dunia-blue dark:text-[#60C2E6]">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !data.address_id}
                                className="w-full py-3.5 px-6 rounded-2xl bg-[#005A9D] hover:bg-[#006783] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                {processing
                                    ? pick('Memproses Pesanan...', 'Processing Order...')
                                    : !data.address_id
                                        ? pick('Pilih / Tambah Alamat untuk Lanjut', 'Select or Add Address to Continue')
                                        : data.payment_method === 'cod'
                                            ? pick('Buat Pesanan COD', 'Place COD Order')
                                            : pick('Buat & Konfirmasi Pesanan', 'Place & Confirm Order')}
                            </button>

                            <div className="p-3 rounded-xl bg-sky-50 dark:bg-[#131d33] text-[11px] text-sky-900 dark:text-slate-300 flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#60C2E6] shrink-0 mt-0.5" />
                                <p>
                                    {data.payment_method === 'cod'
                                        ? pick(
                                            'Pesanan COD langsung diproses penangkar tanpa perlu pilih metode pembayaran online. Siapkan uang pas saat kurir tiba.',
                                            'Your COD order goes straight to the breeder without online payment selection. Prepare exact cash when the courier arrives.'
                                        )
                                        : data.payment_method === 'midtrans'
                                            ? pick(
                                                'Stok dikunci otomatis saat pesanan dibuat. Setelah ini Anda langsung diarahkan ke pembayaran instan Midtrans (QRIS & Virtual Account).',
                                                'Stock is automatically reserved once placed. You will proceed directly to Midtrans instant payment (QRIS & Virtual Account).'
                                            )
                                            : pick(
                                                'Stok dikunci otomatis saat pesanan dibuat. Anda dapat melihat detail rekening/QRIS toko dan mengunggah bukti pembayaran setelah ini.',
                                                'Stock is automatically reserved once placed. You can view the store account/QRIS details and upload payment proof right after.'
                                            )}
                                </p>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Modal Tambah Alamat Cepat Langsung di Checkout */}
                {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <div className="bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-[#005A9D] dark:text-[#60C2E6]" />
                                    {pick('Tambah Alamat Pengiriman Baru', 'Add New Shipping Address')}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {addressError && (
                                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
                                    {addressError}
                                </div>
                            )}

                            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            {pick('Nama Penerima', 'Recipient Name')}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={pick('Contoh: Budi Santoso', 'Example: Budi Santoso')}
                                            value={addressForm.recipient_name}
                                            onChange={(e) => setAddressForm({ ...addressForm, recipient_name: e.target.value })}
                                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#005A9D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            {pick('No. WhatsApp / HP', 'WhatsApp / Phone Number')}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder={pick('Contoh: 081234567890', 'Example: 081234567890')}
                                            value={addressForm.phone}
                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#005A9D]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            {pick('Kota / Kabupaten', 'City / Regency')}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={pick('Contoh: Kota Bandung', 'Example: Bandung')}
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#005A9D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            {pick('Kode Pos', 'Postal Code')}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="40287"
                                            value={addressForm.postal_code}
                                            onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#005A9D]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Provinsi', 'Province')}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={pick('Contoh: Jawa Barat', 'Example: West Java')}
                                        value={addressForm.province}
                                        onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#005A9D]"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Alamat Lengkap (Jalan, RT/RW, No. Rumah)', 'Full Address (Street, House No., Landmark)')}
                                    </label>
                                    <textarea
                                        rows={2}
                                        required
                                        placeholder={pick(
                                            'Contoh: Jl. Soekarno Hatta No. 45, RT 02 / RW 05, Kel. Batununggal',
                                            'Example: Jl. Soekarno Hatta No. 45, Batununggal'
                                        )}
                                        value={addressForm.full_address}
                                        onChange={(e) => setAddressForm({ ...addressForm, full_address: e.target.value })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#005A9D]"
                                    />
                                </div>

                                <div className="pt-2 flex justify-end gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressModal(false)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition cursor-pointer"
                                    >
                                        {pick('Batal', 'Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingAddress}
                                        className="px-5 py-2.5 rounded-xl bg-[#005A9D] hover:bg-[#006783] text-white font-extrabold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        {savingAddress
                                            ? pick('Menyimpan...', 'Saving...')
                                            : pick('Simpan & Gunakan Alamat', 'Save & Use Address')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
