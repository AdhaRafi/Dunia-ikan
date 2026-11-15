import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CheckCircle2, Clock, Store, XCircle } from 'lucide-react';

const SELLER_STATUS_BADGE = {
    pending: { label: 'Menunggu Verifikasi', className: 'bg-amber-100 text-amber-800' },
    approved: { label: 'Disetujui', className: 'bg-emerald-100 text-emerald-800' },
    rejected: { label: 'Ditolak', className: 'bg-rose-100 text-rose-700' },
    none: { label: 'Pembeli Biasa', className: 'bg-slate-100 text-slate-600' },
};

export default function Index({ users, filters, pendingCount = 0 }) {
    const [search, setSearch] = useState(filters?.q || '');
    const [role, setRole] = useState(filters?.role || '');
    const [sellerStatus, setSellerStatus] = useState(filters?.seller_status || '');

    const applyFilters = (next = {}) => {
        router.get(
            '/admin-portal/users',
            {
                q: next.q ?? search,
                role: next.role ?? role,
                seller_status: next.seller_status ?? sellerStatus,
            },
            { preserveState: true }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleApproveSeller = (user) => {
        router.post(`/admin-portal/users/${user.id}/approve-seller`, {}, { preserveScroll: true });
    };

    const handleRejectSeller = (user) => {
        router.post(`/admin-portal/users/${user.id}/reject-seller`, {}, { preserveScroll: true });
    };

    const handleChangeRole = (userId, newRole) => {
        router.post(
            `/admin-portal/users/${userId}/role`,
            { role: newRole },
            { preserveScroll: true }
        );
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna - Panel Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Manajemen Pengguna & Verifikasi Penjual
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Kelola peran akun serta setujui atau tolak pengajuan calon penjual baru di Dunia Ikan.
                    </p>
                </div>

                {pendingCount > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs text-amber-900">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-bold">
                                    {pendingCount} Pengajuan Penjual Menunggu Persetujuan
                                </p>
                                <p className="text-amber-700 mt-0.5">
                                    Klik Setujui agar pengguna dapat membuka toko, atau Tolak jika belum memenuhi syarat.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                const nextStatus = sellerStatus === 'pending' ? '' : 'pending';
                                setSellerStatus(nextStatus);
                                applyFilters({ seller_status: nextStatus });
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition whitespace-nowrap self-start sm:self-auto"
                        >
                            {sellerStatus === 'pending' ? 'Tampilkan Semua' : 'Filter Menunggu Acc'}
                        </button>
                    </div>
                )}

                {/* Filter and Search */}
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau rencana nama toko..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                    <select
                        value={sellerStatus}
                        onChange={(e) => {
                            setSellerStatus(e.target.value);
                            applyFilters({ seller_status: e.target.value });
                        }}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                        <option value="">Semua Status Penjual</option>
                        <option value="pending">Menunggu Verifikasi</option>
                        <option value="approved">Disetujui</option>
                        <option value="rejected">Ditolak</option>
                        <option value="none">Pembeli Biasa</option>
                    </select>
                    <select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            applyFilters({ role: e.target.value });
                        }}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                        <option value="">Semua Peran</option>
                        <option value="buyer">Pembeli (Buyer)</option>
                        <option value="seller">Penjual (Seller)</option>
                        <option value="admin">Administrator</option>
                    </select>
                    <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition"
                    >
                        Cari
                    </button>
                </form>

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
                    <table className="w-full text-left text-xs min-w-[760px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Pengguna</th>
                                <th className="p-4">Pengajuan / Toko</th>
                                <th className="p-4">Status Verifikasi</th>
                                <th className="p-4">Peran</th>
                                <th className="p-4 text-right">Verifikasi & Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users?.data?.map((user) => {
                                const statusMeta = SELLER_STATUS_BADGE[user.seller_status || 'none'] || SELLER_STATUS_BADGE.none;

                                return (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition align-top">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <p className="text-[11px] text-slate-500">{user.email}</p>
                                            {user.phone && (
                                                <span className="text-[10px] text-slate-400">{user.phone}</span>
                                            )}
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            {user.store ? (
                                                <span className="font-semibold text-dunia-marine flex items-center gap-1">
                                                    <Store className="w-3.5 h-3.5 shrink-0" />
                                                    {user.store.name}
                                                </span>
                                            ) : user.seller_store_name ? (
                                                <div className="space-y-1">
                                                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                                                        <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                        {user.seller_store_name}
                                                    </span>
                                                    {user.seller_application_note && (
                                                        <p className="text-[11px] text-slate-500 line-clamp-2">
                                                            {user.seller_application_note}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${statusMeta.className}`}>
                                                {statusMeta.label}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : user.role === 'seller'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="inline-flex flex-wrap items-center justify-end gap-2">
                                                {user.role !== 'admin' && user.seller_status === 'pending' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApproveSeller(user)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Setujui
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRejectSeller(user)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-bold text-[11px] hover:bg-rose-100 transition"
                                                        >
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Tolak
                                                        </button>
                                                    </>
                                                )}
                                                <select
                                                    aria-label={`Peran ${user.name}`}
                                                    value={user.role}
                                                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                                    className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white font-semibold cursor-pointer"
                                                >
                                                    <option value="buyer">Pembeli</option>
                                                    <option value="seller">Penjual</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
