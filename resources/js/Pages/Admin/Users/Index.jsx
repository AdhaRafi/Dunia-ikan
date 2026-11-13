import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Users, Search, Store } from 'lucide-react';

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters?.q || '');
    const [role, setRole] = useState(filters?.role || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { q: search, role }, { preserveState: true });
    };

    const handleChangeRole = (userId, newRole) => {
        if (confirm(`Ubah peran pengguna ini menjadi "${newRole}"?`)) {
            router.post(`/admin/users/${userId}/role`, {
                role: newRole,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna - Panel Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Manajemen Pengguna & Peran
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Daftar pengguna terdaftar di marketplace Dunia Ikan dan pengaturan hak akses peran.
                    </p>
                </div>

                {/* Filter and Search */}
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                    <select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            router.get('/admin/users', { q: search, role: e.target.value }, { preserveState: true });
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
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Pengguna</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Kontak Telepon</th>
                                <th className="p-4">Toko Terdaftar</th>
                                <th className="p-4">Peran (Role)</th>
                                <th className="p-4 text-right">Ubah Peran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users?.data?.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-900">{user.name}</p>
                                        <span className="text-[10px] text-slate-400">ID #{user.id}</span>
                                    </td>
                                    <td className="p-4 text-slate-600">{user.email}</td>
                                    <td className="p-4 text-slate-600">{user.phone || '-'}</td>
                                    <td className="p-4">
                                        {user.store ? (
                                            <span className="font-semibold text-dunia-marine flex items-center gap-1">
                                                <Store className="w-3.5 h-3.5" />
                                                {user.store.name}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
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
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                            className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white font-semibold cursor-pointer"
                                        >
                                            <option value="buyer">Pembeli</option>
                                            <option value="seller">Penjual</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
