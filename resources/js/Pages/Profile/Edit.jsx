import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import {
    BadgeCheck,
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

const formatDate = (dateString) => {
    if (!dateString) {
        return '';
    }
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(dateString));
};

const ORDER_STATUS_LABELS = {
    pending_payment: 'Menunggu Pembayaran',
    awaiting_confirmation: 'Menunggu Konfirmasi',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Selesai',
};

export default function Edit({ mustVerifyEmail, status, recentOrders = [], orderStats = {} }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [activeTab, setActiveTab] = useState('profile');

    const roleLabel =
        user?.role === 'admin'
            ? 'Administrator'
            : user?.role === 'seller'
            ? 'Penangkar Terverifikasi'
            : 'Pembeli Terdaftar';

    const joinedAt = formatDate(user?.created_at);
    const totalOrdersCount =
        (orderStats?.pending || 0) +
        (orderStats?.processing || 0) +
        (orderStats?.shipped || 0) +
        (orderStats?.delivered || 0);

    const tabs = [
        { id: 'profile', label: 'Profil', icon: UserIcon },
        { id: 'orders', label: 'Pesanan', icon: Package, badge: totalOrdersCount },
        { id: 'security', label: 'Keamanan & Akses', icon: Shield },
    ];

    const activeTabMeta = tabs.find((t) => t.id === activeTab) || tabs[0];
    const ActiveIcon = activeTabMeta.icon;

    return (
        <AppLayout>
            <Head title="Profil — Dunia Ikan" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
                        {/* Left Settings Sub-Sidebar */}
                        <aside className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-neutral-800 bg-[#fbfbfc] dark:bg-[#0b101d] p-4">
                            <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-neutral-500">
                                Akun Saya
                            </p>

                            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`shrink-0 w-auto md:w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-[13px] transition ${
                                                isActive
                                                    ? 'bg-slate-200/70 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold'
                                                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white font-medium'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2.5">
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
                                    className="shrink-0 w-auto md:w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white transition"
                                >
                                    <MapPin className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                                    <span className="whitespace-nowrap">Buku Alamat</span>
                                </Link>

                                {user?.role === 'seller' && (
                                    <Link
                                        href="/seller/dashboard"
                                        className="shrink-0 w-auto md:w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white transition"
                                    >
                                        <Store className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                                        <span className="whitespace-nowrap">Toko Saya</span>
                                    </Link>
                                )}
                            </nav>
                        </aside>

                        {/* Right Content Panel */}
                        <div className="md:col-span-9 min-w-0 flex flex-col">
                            {/* Breadcrumb Bar */}
                            <div className="h-12 px-6 border-b border-slate-100 dark:border-neutral-800 flex items-center gap-2 text-xs text-slate-400 dark:text-neutral-500">
                                <span>Akun Saya</span>
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
                                        <div className="w-20 h-20 rounded-full bg-slate-900 dark:bg-slate-800 text-white text-2xl font-bold flex items-center justify-center ring-4 ring-white dark:ring-[#0e1424] shadow-xs">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                {user?.name}
                                            </h1>
                                            <BadgeCheck
                                                className="w-5 h-5 text-[#0684E5] shrink-0"
                                                aria-label="Akun terdaftar"
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
                                                { label: 'Menunggu Bayar', count: orderStats?.pending || 0 },
                                                { label: 'Diproses', count: orderStats?.processing || 0 },
                                                { label: 'Dikirim', count: orderStats?.shipped || 0 },
                                                { label: 'Selesai', count: orderStats?.delivered || 0 },
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
                                                    Pesanan Terakhir
                                                </h2>
                                                <Link
                                                    href="/orders"
                                                    className="text-xs font-medium text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-4"
                                                >
                                                    Semua Pesanan
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
                                                                    {order.store?.name || 'Toko Penangkar'} ·{' '}
                                                                    <span className="font-mono text-slate-500 dark:text-neutral-400 font-normal">
                                                                        {order.order_number}
                                                                    </span>
                                                                </p>
                                                                <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                                                                    {ORDER_STATUS_LABELS[order.status] || 'Dibatalkan'}
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
                                                    Belum ada riwayat pesanan.{' '}
                                                    <Link
                                                        href="/products"
                                                        className="text-slate-900 dark:text-white underline underline-offset-4 ml-1"
                                                    >
                                                        Jelajahi katalog
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
