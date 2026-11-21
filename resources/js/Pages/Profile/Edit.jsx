import { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/lib/i18n';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import {
    BadgeCheck,
    Camera,
    MapPin,
    Package,
    Shield,
    Store,
    User as UserIcon,
} from 'lucide-react';

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price || 0);

const formatDate = (dateString, locale) => {
    if (!dateString) {
        return '';
    }
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(dateString));
};

export default function Edit({ mustVerifyEmail, status, recentOrders = [], orderStats = {} }) {
    const { locale, pick, trOrderStatus } = useLanguage();
    const { auth } = usePage().props;
    const user = auth?.user;
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarBusy, setAvatarBusy] = useState(false);
    const [avatarError, setAvatarError] = useState('');

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) {
            return;
        }
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        const preview = URL.createObjectURL(file);
        setAvatarPreview(preview);
        setAvatarError('');
        setAvatarBusy(true);

        router.post(
            route('profile.update'),
            {
                _method: 'patch',
                name: user.name,
                email: user.email,
                avatar: file,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onError: (errors) => {
                    setAvatarError(
                        errors.avatar || pick('Gagal mengunggah foto profil.', 'Failed to upload profile photo.')
                    );
                    setAvatarPreview(null);
                },
                onFinish: () => {
                    setAvatarBusy(false);
                    e.target.value = '';
                },
            }
        );
    };

    const handleRemoveAvatar = () => {
        if (!user) {
            return;
        }
        setAvatarError('');
        setAvatarBusy(true);

        router.patch(
            route('profile.update'),
            {
                name: user.name,
                email: user.email,
                remove_avatar: true,
            },
            {
                preserveScroll: true,
                onSuccess: () => setAvatarPreview(null),
                onFinish: () => setAvatarBusy(false),
            }
        );
    };

    const roleLabel =
        user?.role === 'admin'
            ? pick('Administrator', 'Administrator')
            : user?.role === 'seller'
              ? pick('Penangkar Terverifikasi', 'Verified Breeder')
              : user?.seller_status === 'pending'
                ? pick('Pembeli · Menunggu Verifikasi Penjual', 'Buyer · Seller Verification Pending')
                : user?.seller_status === 'rejected'
                  ? pick('Pembeli · Pengajuan Penjual Ditolak', 'Buyer · Seller Application Rejected')
                  : pick('Pembeli Terdaftar', 'Registered Buyer');

    const joinedAt = formatDate(user?.created_at, locale);
    const totalOrdersCount =
        (orderStats?.pending || 0) +
        (orderStats?.processing || 0) +
        (orderStats?.shipped || 0) +
        (orderStats?.delivered || 0);

    const tabs = [
        { id: 'profile', label: pick('Profil', 'Profile'), icon: UserIcon },
        { id: 'orders', label: pick('Pesanan', 'Orders'), icon: Package, badge: totalOrdersCount },
        { id: 'security', label: pick('Keamanan & Akses', 'Security & Access'), icon: Shield },
    ];

    const activeTabMeta = tabs.find((t) => t.id === activeTab) || tabs[0];
    const ActiveIcon = activeTabMeta.icon;

    return (
        <AppLayout>
            <Head title={pick('Profil — Dunia Ikan', 'Profile — Dunia Ikan')} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
                        {/* Left Settings Sub-Sidebar */}
                        <aside className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-neutral-800 bg-[#fbfbfc] dark:bg-[#0b101d] p-3.5 sm:p-4">
                            <p className="px-2 md:px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-neutral-500">
                                {pick('Akun Saya', 'My Account')}
                            </p>

                            <nav className="flex flex-wrap md:flex-col gap-1.5 md:gap-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-auto md:w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs sm:text-[13px] transition ${
                                                isActive
                                                    ? 'bg-slate-200/70 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold'
                                                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white font-medium'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                                                <span className="whitespace-nowrap">{tab.label}</span>
                                            </span>
                                            {tab.badge > 0 && (
                                                <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 tabular-nums">
                                                    {tab.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}

                                <Link
                                    href="/addresses"
                                    className="w-auto md:w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white transition"
                                >
                                    <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                                    <span className="whitespace-nowrap">{pick('Buku Alamat', 'Address Book')}</span>
                                </Link>

                                {user?.role === 'seller' && (
                                    <Link
                                        href="/seller/products"
                                        className="w-auto md:w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white transition"
                                    >
                                        <Store className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                                        <span className="whitespace-nowrap">{pick('Toko Saya', 'My Store')}</span>
                                    </Link>
                                )}

                                {user?.role === 'buyer' && (user?.seller_status === 'pending' || user?.seller_status === 'rejected') && (
                                    <Link
                                        href="/seller/register"
                                        className="w-auto md:w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white transition"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Store className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                                            <span className="whitespace-nowrap">{pick('Status Penjual', 'Seller Status')}</span>
                                        </span>
                                        <span
                                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                                user.seller_status === 'pending'
                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                                            }`}
                                        >
                                            {user.seller_status === 'pending'
                                                ? pick('Pending', 'Pending')
                                                : pick('Ditolak', 'Rejected')}
                                        </span>
                                    </Link>
                                )}
                            </nav>
                        </aside>

                        {/* Right Content Panel */}
                        <div className="md:col-span-9 min-w-0 flex flex-col">
                            {/* Breadcrumb Bar */}
                            <div className="h-12 px-6 border-b border-slate-100 dark:border-neutral-800 flex items-center gap-2 text-xs text-slate-400 dark:text-neutral-500">
                                <span>{pick('Akun Saya', 'My Account')}</span>
                                <span>/</span>
                                <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                                    <ActiveIcon className="w-3.5 h-3.5" strokeWidth={1.8} />
                                    <span>{activeTabMeta.label}</span>
                                </span>
                            </div>

                            {/* Subtle Grid Pattern Identity Header */}
                            {activeTab === 'profile' && (
                                <div className="relative px-6 sm:px-8 pt-6 pb-6 border-b border-slate-100 dark:border-neutral-800 overflow-hidden">
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:linear-gradient(to_bottom,black_45%,transparent_100%)]"
                                    />

                                    <div className="relative flex flex-col items-start">
                                        <div className="flex items-end gap-4">
                                            <label
                                                className="relative group cursor-pointer"
                                                title={pick('Ganti foto profil', 'Change profile photo')}
                                            >
                                                <UserAvatar
                                                    user={user}
                                                    previewUrl={avatarPreview}
                                                    className="w-20 h-20 text-2xl ring-4 ring-white dark:ring-[#0e1424] shadow-xs"
                                                />
                                                <span className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                                                    <Camera className="w-3.5 h-3.5" />
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={handleAvatarChange}
                                                    disabled={avatarBusy}
                                                    className="hidden"
                                                />
                                            </label>

                                            <div className="flex items-center gap-3 pb-1 text-xs">
                                                <label className="font-medium text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-4 decoration-slate-300 dark:decoration-neutral-700 cursor-pointer transition">
                                                    {avatarBusy
                                                        ? pick('Mengunggah...', 'Uploading...')
                                                        : pick('Ganti foto', 'Change photo')}
                                                    <input
                                                        type="file"
                                                        accept="image/png,image/jpeg,image/webp"
                                                        onChange={handleAvatarChange}
                                                        disabled={avatarBusy}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {(user?.avatar_url || avatarPreview) && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveAvatar}
                                                        disabled={avatarBusy}
                                                        className="font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                                                    >
                                                        {pick('Hapus', 'Remove')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {avatarError && (
                                            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                                                {avatarError}
                                            </p>
                                        )}

                                        <div className="mt-4 flex items-center gap-2">
                                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                {user?.name}
                                            </h1>
                                            <BadgeCheck
                                                className="w-5 h-5 text-[#005A9D] shrink-0"
                                                aria-label={pick('Akun terdaftar', 'Registered account')}
                                            />
                                        </div>
                                        <p className="text-xs sm:text-[13px] text-slate-500 dark:text-neutral-400 mt-0.5">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Tab Body */}
                            <div className="flex-1 p-6 sm:p-8 space-y-6 bg-[#fbfbfc]/60 dark:bg-[#0b101d]/40">
                                {activeTab === 'profile' && (
                                    <>
                                        <UpdateProfileInformationForm
                                            mustVerifyEmail={mustVerifyEmail}
                                            status={status}
                                            roleLabel={roleLabel}
                                            joinedAt={joinedAt}
                                        />
                                        <UpdatePasswordForm />
                                        <DeleteUserForm />
                                    </>
                                )}

                                {activeTab === 'orders' && (
                                    <div className="space-y-6">
                                        {/* Compact Monochrome Status Strip */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { label: pick('Menunggu Bayar', 'Pending'), count: orderStats?.pending || 0 },
                                                { label: pick('Diproses', 'Processing'), count: orderStats?.processing || 0 },
                                                { label: pick('Dikirim', 'Shipped'), count: orderStats?.shipped || 0 },
                                                { label: pick('Selesai', 'Delivered'), count: orderStats?.delivered || 0 },
                                            ].map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="rounded-xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 px-4 py-3"
                                                >
                                                    <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                                                        {stat.label}
                                                    </p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                                                        {stat.count}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {pick('Pesanan Terakhir', 'Recent Orders')}
                                                </h2>
                                                <Link
                                                    href="/orders"
                                                    className="text-xs font-medium text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-4"
                                                >
                                                    {pick('Semua Pesanan', 'All Orders')}
                                                </Link>
                                            </div>

                                            {recentOrders.length > 0 ? (
                                                <div className="divide-y divide-dashed divide-slate-200/80 dark:divide-neutral-800">
                                                    {recentOrders.map((order) => (
                                                        <Link
                                                            key={order.id}
                                                            href={`/orders/${order.order_number}`}
                                                            className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition"
                                                        >
                                                            <div className="space-y-0.5">
                                                                <p className="text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-white">
                                                                    {order.store?.name || pick('Toko Penangkar', 'Breeder Store')} ·{' '}
                                                                    <span className="font-mono text-slate-500 dark:text-neutral-400 font-normal">
                                                                        {order.order_number}
                                                                    </span>
                                                                </p>
                                                                <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                                                                    {trOrderStatus(order.status)}
                                                                </p>
                                                            </div>
                                                            <span className="text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-white tabular-nums">
                                                                {formatPrice(order.grand_total || order.total_amount)}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-6 py-10 text-center text-xs text-slate-400 dark:text-neutral-500">
                                                    {pick('Belum ada riwayat pesanan.', 'No order history yet.')}{' '}
                                                    <Link
                                                        href="/products"
                                                        className="text-slate-900 dark:text-white underline underline-offset-4 ml-1"
                                                    >
                                                        {pick('Jelajahi katalog', 'Browse catalog')}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <>
                                        <UpdatePasswordForm />
                                        <DeleteUserForm />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
