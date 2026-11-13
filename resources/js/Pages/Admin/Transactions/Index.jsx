import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ReceiptText, Search, Store, User } from 'lucide-react';

export default function Index({ orders, filters }) {
    const [search, setSearch] = useState(filters?.q || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [paymentStatus, setPaymentStatus] = useState(filters?.payment_status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/transactions', { q: search, status, payment_status: paymentStatus }, { preserveState: true });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AdminLayout>
            <Head title="Monitoring Semua Transaksi - Panel Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        Monitoring Semua Transaksi Platform
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Seluruh transaksi pesanan multi-toko tercatat di halaman ini untuk audit dan pengawasan.
                    </p>
                </div>

                {/* Filter Controls */}
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Cari no. order, pembeli, toko..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200"
                    />

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            router.get('/admin/transactions', { q: search, status: e.target.value, payment_status: paymentStatus }, { preserveState: true });
                        }}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                        <option value="">Semua Status Pesanan</option>
                        <option value="pending_payment">Menunggu Pembayaran</option>
                        <option value="awaiting_confirmation">Menunggu Konfirmasi</option>
                        <option value="processing">Diproses</option>
                        <option value="shipped">Dikirim</option>
                        <option value="delivered">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>

                    <select
                        value={paymentStatus}
                        onChange={(e) => {
                            setPaymentStatus(e.target.value);
                            router.get('/admin/transactions', { q: search, status, payment_status: e.target.value }, { preserveState: true });
                        }}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                        <option value="">Semua Status Bayar</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-dunia-blue text-white font-bold text-xs hover:bg-sky-600 transition"
                    >
                        Filter
                    </button>
                </form>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">No. Order</th>
                                <th className="p-4">Pembeli</th>
                                <th className="p-4">Toko Penangkar</th>
                                <th className="p-4">Total Tagihan</th>
                                <th className="p-4">Metode Bayar</th>
                                <th className="p-4">Status Pesanan</th>
                                <th className="p-4">Status Bayar</th>
                                <th className="p-4">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders?.data?.map((ord) => (
                                <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                                    <td className="p-4 font-mono font-bold text-dunia-navy">{ord.order_number}</td>
                                    <td className="p-4">
                                        <p className="font-semibold text-slate-800">{ord.buyer?.name}</p>
                                        <p className="text-[10px] text-slate-400">{ord.buyer?.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                                            <Store className="w-3.5 h-3.5 text-dunia-marine" />
                                            {ord.store?.name}
                                        </span>
                                    </td>
                                    <td className="p-4 font-extrabold text-dunia-blue">{formatPrice(ord.grand_total)}</td>
                                    <td className="p-4 uppercase text-[11px] font-semibold text-slate-600">
                                        {ord.payment_method.replace('_', ' ')}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700">
                                            {ord.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                                            ord.payment_status === 'verified'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : ord.payment_status === 'paid'
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {ord.payment_status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        {new Date(ord.created_at).toLocaleDateString('id-ID')}
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
