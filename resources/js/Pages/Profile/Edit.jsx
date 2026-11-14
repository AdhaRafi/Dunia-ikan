import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { 
    Package, 
    Clock, 
    Truck, 
    CheckCircle2, 
    ArrowRight, 
    MapPin, 
    Store, 
    CreditCard, 
    ShieldCheck, 
    User as UserIcon, 
    ShoppingBag,
    Calendar,
    ChevronRight
} from 'lucide-react';

export default function Edit({ mustVerifyEmail, status, recentOrders = [], orderStats = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusBadge = (statusKey) => {
        switch (statusKey) {
            case 'pending_payment':
                return { label: 'Menunggu Pembayaran', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
            case 'awaiting_confirmation':
                return { label: 'Menunggu Konfirmasi', bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
            case 'processing':
                return { label: 'Diproses / Karantina', bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' };
            case 'shipped':
                return { label: 'Sedang Dikirim', bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
            case 'delivered':
                return { label: 'Selesai / Diterima', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
            default:
                return { label: 'Dibatalkan', bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800' };
        }
    };

    const pendingCount = orderStats?.pending || 0;
    const processingCount = orderStats?.processing || 0;
    const shippedCount = orderStats?.shipped || 0;
    const deliveredCount = orderStats?.delivered || 0;

    return (
        <AppLayout>
            <Head title="Profil Saya - Dunia Ikan" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* 1. Header Profile Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001454] via-[#0D2E92] to-[#0684E5] p-6 sm:p-8 text-white shadow-xl">
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-inner">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                                        {user?.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#4AB8BD]" />
                                        {user?.role === 'admin' ? 'Administrator' : user?.role === 'seller' ? 'Penangkar Terverifikasi' : 'Pembeli Terdaftar'}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-cyan-100/90 mt-1">
                                    {user?.email}
                                </p>
                                <div className="flex items-center gap-4 text-[11px] text-cyan-200/80 mt-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Bergabung {formatDate(user?.created_at).split(',')[0]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick links beside avatar */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                            <Link
                                href="/orders"
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#001454] hover:bg-cyan-50 font-bold text-xs shadow-md transition"
                            >
                                <Package className="w-4 h-4 text-[#0684E5]" />
                                <span>Semua Pesanan</span>
                            </Link>
                            <Link
                                href="/addresses"
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold text-xs backdrop-blur-sm transition"
                            >
                                <MapPin className="w-4 h-4 text-[#4AB8BD]" />
                                <span>Buku Alamat</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. Order Status Shortcuts (Shopee/Tokopedia Style) */}
                <div className="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-neutral-800">
                        <div>
                            <h2 className="text-base sm:text-lg font-extrabold text-[#001454] dark:text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#0684E5]" />
                                <span>Status Pesanan Ikan Saya</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                                Pantau verifikasi pembayaran, karantina kesehatan, dan paket kurir hidup Anda.
                            </p>
                        </div>
                        <Link
                            href="/orders"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0684E5] hover:text-[#001454] dark:text-[#4AB8BD] transition"
                        >
                            <span>Lihat Riwayat Lengkap</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {/* Menunggu Pembayaran */}
                        <Link
                            href="/orders"
                            className="group p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 hover:border-amber-400 transition relative flex flex-col items-center text-center"
                        >
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                Menunggu Bayar
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                                Verifikasi Midtrans
                            </span>
                            {pendingCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-xs">
                                    {pendingCount}
                                </span>
                            )}
                        </Link>

                        {/* Diproses / Karantina */}
                        <Link
                            href="/orders"
                            className="group p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 hover:border-purple-400 transition relative flex flex-col items-center text-center"
                        >
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                Karantina & Packing
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                                Oksigen & Box Styrofoam
                            </span>
                            {processingCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-xs">
                                    {processingCount}
                                </span>
                            )}
                        </Link>

                        {/* Sedang Dikirim */}
                        <Link
                            href="/orders"
                            className="group p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 hover:border-indigo-400 transition relative flex flex-col items-center text-center"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Truck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                Sedang Dikirim
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                                Pantau Resi Ekspedisi
                            </span>
                            {shippedCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shadow-xs">
                                    {shippedCount}
                                </span>
                            )}
                        </Link>

                        {/* Selesai */}
                        <Link
                            href="/orders"
                            className="group p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-400 transition relative flex flex-col items-center text-center"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                Selesai / Diterima
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                                Garansi Ikan Hidup
                            </span>
                            {deliveredCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                                    {deliveredCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* 3. Recent Orders List */}
                <div className="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-800">
                        <div>
                            <h2 className="text-base sm:text-lg font-extrabold text-[#001454] dark:text-white">
                                Pesanan Terakhir Saya
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                                Transaksi pembelian ikan hias dan perlengkapan akuarium terbaru.
                            </p>
                        </div>
                        {recentOrders.length > 0 && (
                            <Link
                                href="/orders"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0684E5] hover:text-[#001454] dark:text-[#4AB8BD] transition"
                            >
                                <span>Lihat Semua ({recentOrders.length})</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => {
                                const badge = getStatusBadge(order.status);
                                return (
                                    <div
                                        key={order.id}
                                        className="rounded-xl border border-slate-200/80 dark:border-neutral-800 p-4 sm:p-5 hover:border-[#0684E5]/40 transition bg-slate-50/50 dark:bg-neutral-900/50 space-y-3"
                                    >
                                        {/* Order Top Bar: Store & Status */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-neutral-800 text-xs">
                                            <div className="flex items-center gap-2">
                                                <Store className="w-4 h-4 text-[#0684E5]" />
                                                <span className="font-bold text-[#001454] dark:text-white">
                                                    {order.store?.name || 'Toko Penangkar'}
                                                </span>
                                                <span className="text-slate-400 dark:text-neutral-500">•</span>
                                                <span className="font-mono text-slate-600 dark:text-neutral-400 font-medium">
                                                    {order.order_number}
                                                </span>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                                                {badge.label}
                                            </span>
                                        </div>

                                        {/* Order Items Preview */}
                                        <div className="space-y-2">
                                            {order.items?.slice(0, 2).map((item) => (
                                                <div key={item.id} className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-neutral-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-neutral-700">
                                                        {item.product?.primary_image ? (
                                                            <img
                                                                src={item.product.primary_image}
                                                                alt={item.product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                                                Ikan
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-bold text-slate-800 dark:text-neutral-100 truncate">
                                                            {item.product?.name || 'Spesimen Ikan'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                                                            {item.quantity} barang × {formatPrice(item.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items?.length > 2 && (
                                                <p className="text-[11px] text-slate-500 dark:text-neutral-400 italic">
                                                    +{order.items.length - 2} produk lainnya...
                                                </p>
                                            )}
                                        </div>

                                        {/* Order Footer: Total and Action Button */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-neutral-800">
                                            <div>
                                                <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">
                                                    Total Pembayaran:
                                                </span>
                                                <span className="text-sm font-extrabold text-[#0684E5]">
                                                    {formatPrice(order.grand_total || order.total_amount)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/orders/${order.order_number}`}
                                                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition ${
                                                        order.status === 'pending_payment'
                                                            ? 'bg-[#0684E5] hover:bg-[#001454] text-white'
                                                            : 'bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-200 hover:border-[#0684E5]'
                                                    }`}
                                                >
                                                    {order.status === 'pending_payment' ? (
                                                        <>
                                                            <CreditCard className="w-3.5 h-3.5" />
                                                            <span>Bayar / Cek Status</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Lihat Detail</span>
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </>
                                                    )}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800">
                            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-neutral-700 mx-auto mb-3" />
                            <h3 className="text-sm font-bold text-slate-700 dark:text-neutral-300">
                                Belum Ada Pesanan Aktif
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                                Semua riwayat transaksi pembelian ikan, bukti pembayaran, dan nomor resi pengiriman akan muncul di sini.
                            </p>
                            <Link
                                href="/products"
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0684E5] hover:bg-[#001454] text-white font-bold text-xs shadow-xs transition"
                            >
                                <span>Mulai Belanja Ikan Sekarang</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* 4. Account Settings & Forms Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Information Form */}
                    <div className="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Password Update Form */}
                    <div className="bg-white dark:bg-[#0d1424] rounded-2xl border border-slate-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* 5. Danger Zone / Delete Account */}
                <div className="bg-white dark:bg-[#0d1424] rounded-2xl border border-rose-200/60 dark:border-rose-950/60 p-5 sm:p-6 shadow-xs">
                    <DeleteUserForm />
                </div>
            </div>
        </AppLayout>
    );
}
