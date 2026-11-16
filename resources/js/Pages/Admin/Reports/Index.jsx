import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FileBarChart2,
    Printer,
    Download,
    Filter,
    RotateCcw,
    ReceiptText,
    CheckCircle2,
    Wallet,
    Store as StoreIcon,
    TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const formatLocalYmd = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value, isEn) => {
    if (!value) {
        return '-';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export default function Index({ orders, summary, storeBreakdown, stores, filters, generatedAt }) {
    const { isEn, pick, trOrderStatus } = useLanguage();

    const [form, setForm] = useState({
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
        store_id: filters?.store_id || '',
        status: filters?.status || '',
        payment_status: filters?.payment_status || '',
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(price || 0));
    };

    const buildQueryParams = (state) => {
        const params = {};
        if (state.date_from) params.date_from = state.date_from;
        if (state.date_to) params.date_to = state.date_to;
        if (state.store_id) params.store_id = state.store_id;
        if (state.status) params.status = state.status;
        if (state.payment_status) params.payment_status = state.payment_status;
        return params;
    };

    const applyFilters = (nextState) => {
        setForm(nextState);
        router.get('/admin-portal/reports', buildQueryParams(nextState), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        applyFilters(form);
    };

    const applyPreset = (preset) => {
        const today = new Date();
        let nextFrom = '';
        let nextTo = formatLocalYmd(today);

        if (preset === 'today') {
            nextFrom = nextTo;
        } else if (preset === '7d') {
            const past = new Date(today);
            past.setDate(today.getDate() - 6);
            nextFrom = formatLocalYmd(past);
        } else if (preset === 'month') {
            const first = new Date(today.getFullYear(), today.getMonth(), 1);
            nextFrom = formatLocalYmd(first);
        } else {
            nextFrom = '';
            nextTo = '';
        }

        applyFilters({
            ...form,
            date_from: nextFrom,
            date_to: nextTo,
        });
    };

    const handleReset = () => {
        applyFilters({
            date_from: '',
            date_to: '',
            store_id: '',
            status: '',
            payment_status: '',
        });
    };

    const activeQueryString = new URLSearchParams(buildQueryParams(form)).toString();
    const exportUrl = activeQueryString
        ? `/admin-portal/reports/export?${activeQueryString}`
        : '/admin-portal/reports/export';

    const selectedStoreName = form.store_id
        ? stores.find((s) => String(s.id) === String(form.store_id))?.name || '-'
        : pick('Semua Toko', 'All Stores');

    const periodLabel = form.date_from || form.date_to
        ? `${form.date_from || pick('Awal', 'Start')} s/d ${form.date_to || pick('Sekarang', 'Now')}`
        : pick('Semua Periode', 'All Time');

    const getPaymentStatusLabel = (status) => {
        const map = {
            unpaid: pick('Belum Bayar', 'Unpaid'),
            paid: pick('Sudah Dibayar', 'Paid'),
            verified: pick('Terverifikasi', 'Verified'),
            rejected: pick('Ditolak', 'Rejected'),
        };
        return map[status] || status;
    };

    const getPaymentBadgeClass = (status) => {
        const classes = {
            unpaid: 'bg-slate-100 text-slate-700',
            paid: 'bg-amber-50 text-amber-700',
            verified: 'bg-emerald-50 text-emerald-700',
            rejected: 'bg-rose-50 text-rose-700',
        };
        return classes[status] || 'bg-slate-100 text-slate-700';
    };

    const getOrderBadgeClass = (status) => {
        const classes = {
            pending_payment: 'bg-slate-100 text-slate-700',
            awaiting_confirmation: 'bg-amber-50 text-amber-700',
            processing: 'bg-sky-50 text-sky-700',
            shipped: 'bg-indigo-50 text-indigo-700',
            delivered: 'bg-emerald-50 text-emerald-700',
            cancelled: 'bg-rose-50 text-rose-700',
        };
        return classes[status] || 'bg-slate-100 text-slate-700';
    };

    return (
        <AdminLayout title={pick('Laporan Transaksi', 'Transaction Report')}>
            <Head title={pick('Laporan Transaksi Admin - Dunia Ikan', 'Admin Transaction Report - Dunia Ikan')} />

            <div className="space-y-6">
                {/* Print-only Formal Letterhead */}
                <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                Marketplace &amp; Chatbot Ikan Hias Indonesia
                            </p>
                            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                                DUNIA IKAN — {pick('LAPORAN REKAPITULASI TRANSAKSI', 'TRANSACTION SUMMARY REPORT')}
                            </h1>
                        </div>
                        <div className="text-right text-xs text-slate-600">
                            <p>{pick('Dicetak pada', 'Printed on')}: <span className="font-semibold text-slate-900">{formatDisplayDate(generatedAt, isEn)}</span></p>
                            <p>{pick('Periode', 'Period')}: <span className="font-semibold text-slate-900">{periodLabel}</span></p>
                            <p>{pick('Toko', 'Store')}: <span className="font-semibold text-slate-900">{selectedStoreName}</span></p>
                        </div>
                    </div>
                </div>

                {/* Screen Header & Print/Export Actions */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                            <FileBarChart2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {pick('Laporan Transaksi & Rekap Periode', 'Period Transaction Report & Summary')}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {pick(
                                    'Saring transaksi berdasarkan rentang tanggal, toko, atau status lalu cetak PDF atau unduh CSV.',
                                    'Filter transactions by date range, store, or status then print PDF or download CSV.'
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <a
                            href={exportUrl}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>{pick('Unduh CSV', 'Download CSV')}</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
                        >
                            <Printer className="w-4 h-4" />
                            <span>{pick('Cetak / Simpan PDF', 'Print / Save PDF')}</span>
                        </button>
                    </div>
                </div>

                {/* Filter Controls (hidden in print) */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 print:hidden"
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Filter className="w-4 h-4 text-slate-500" />
                            <span>{pick('Filter Periode & Parameter', 'Period & Parameter Filters')}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { id: 'today', label: pick('Hari Ini', 'Today') },
                                { id: '7d', label: pick('7 Hari', '7 Days') },
                                { id: 'month', label: pick('Bulan Ini', 'This Month') },
                                { id: 'all', label: pick('Semua', 'All Time') },
                            ].map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => applyPreset(preset.id)}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                {pick('Dari Tanggal', 'From Date')}
                            </label>
                            <input
                                type="date"
                                value={form.date_from}
                                onChange={(e) => setForm({ ...form, date_from: e.target.value })}
                                className="w-full text-sm rounded-xl border-slate-200 focus:border-dunia-blue focus:ring-dunia-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                {pick('Sampai Tanggal', 'To Date')}
                            </label>
                            <input
                                type="date"
                                value={form.date_to}
                                onChange={(e) => setForm({ ...form, date_to: e.target.value })}
                                className="w-full text-sm rounded-xl border-slate-200 focus:border-dunia-blue focus:ring-dunia-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                {pick('Toko', 'Store')}
                            </label>
                            <select
                                value={form.store_id}
                                onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                                className="w-full text-sm rounded-xl border-slate-200 focus:border-dunia-blue focus:ring-dunia-blue"
                            >
                                <option value="">{pick('Semua Toko', 'All Stores')}</option>
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                {pick('Status Pembayaran', 'Payment Status')}
                            </label>
                            <select
                                value={form.payment_status}
                                onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
                                className="w-full text-sm rounded-xl border-slate-200 focus:border-dunia-blue focus:ring-dunia-blue"
                            >
                                <option value="">{pick('Semua Pembayaran', 'All Payment Statuses')}</option>
                                <option value="verified">{pick('Terverifikasi', 'Verified')}</option>
                                <option value="paid">{pick('Sudah Dibayar', 'Paid')}</option>
                                <option value="unpaid">{pick('Belum Bayar', 'Unpaid')}</option>
                                <option value="rejected">{pick('Ditolak', 'Rejected')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                {pick('Status Pesanan', 'Order Status')}
                            </label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full text-sm rounded-xl border-slate-200 focus:border-dunia-blue focus:ring-dunia-blue"
                            >
                                <option value="">{pick('Semua Status', 'All Statuses')}</option>
                                <option value="pending_payment">{trOrderStatus('pending_payment')}</option>
                                <option value="awaiting_confirmation">{trOrderStatus('awaiting_confirmation')}</option>
                                <option value="processing">{trOrderStatus('processing')}</option>
                                <option value="shipped">{trOrderStatus('shipped')}</option>
                                <option value="delivered">{trOrderStatus('delivered')}</option>
                                <option value="cancelled">{trOrderStatus('cancelled')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <p className="text-xs text-slate-500">
                            {pick('Periode aktif', 'Active period')}: <span className="font-semibold text-slate-700">{periodLabel}</span> ·{' '}
                            {pick('Toko', 'Store')}: <span className="font-semibold text-slate-700">{selectedStoreName}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>{pick('Reset', 'Reset')}</span>
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-dunia-blue text-white hover:bg-dunia-blue-dark transition-colors"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>{pick('Terapkan Filter', 'Apply Filter')}</span>
                            </button>
                        </div>
                    </div>
                </form>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-3">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:p-3 print:rounded-lg">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                            <span>{pick('Total Transaksi', 'Total Orders')}</span>
                            <ReceiptText className="w-4 h-4 text-sky-600 print:hidden" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{summary.totalOrders}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {summary.cancelledOrders} {pick('dibatalkan', 'cancelled')}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:p-3 print:rounded-lg">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                            <span>{pick('Pembayaran Terverifikasi', 'Verified Payments')}</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 print:hidden" />
                        </div>
                        <p className="text-2xl font-bold text-emerald-700 mt-2">{summary.verifiedOrders}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {pick('Pesanan lunas sah', 'Settled valid orders')}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:p-3 print:rounded-lg">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                            <span>{pick('Omzet Terverifikasi', 'Verified Revenue')}</span>
                            <Wallet className="w-4 h-4 text-indigo-600 print:hidden" />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                            {formatPrice(summary.verifiedRevenue)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {pick('Status bayar terverifikasi', 'Verified payment status')}
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:p-3 print:rounded-lg">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                            <span>{pick('Total Nilai Aktif', 'Active Order Value')}</span>
                            <TrendingUp className="w-4 h-4 text-amber-600 print:hidden" />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                            {formatPrice(summary.activeOrderTotal)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {pick('Di luar pesanan dibatalkan', 'Excluding cancelled orders')}
                        </p>
                    </div>
                </div>

                {/* Store Breakdown Recap */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print:rounded-lg">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50/70">
                        <StoreIcon className="w-4 h-4 text-slate-600" />
                        <h3 className="text-sm font-bold text-slate-800">
                            {pick('Rekapitulasi Per Toko', 'Breakdown by Store')}
                        </h3>
                    </div>

                    {storeBreakdown.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-500">
                            {pick('Belum ada data toko pada periode yang dipilih.', 'No store activity found for the selected period.')}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3 px-4">{pick('Toko', 'Store')}</th>
                                        <th className="py-3 px-4 text-right">{pick('Total Order', 'Orders')}</th>
                                        <th className="py-3 px-4 text-right">{pick('Terverifikasi', 'Verified')}</th>
                                        <th className="py-3 px-4 text-right">{pick('Nilai Aktif', 'Active Total')}</th>
                                        <th className="py-3 px-4 text-right">{pick('Omzet Terverifikasi', 'Verified Revenue')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {storeBreakdown.map((row) => (
                                        <tr key={row.store_id ?? row.store_name}>
                                            <td className="py-3 px-4 font-semibold text-slate-900">{row.store_name}</td>
                                            <td className="py-3 px-4 text-right text-slate-700">{row.total_orders}</td>
                                            <td className="py-3 px-4 text-right text-emerald-700 font-medium">{row.verified_orders}</td>
                                            <td className="py-3 px-4 text-right text-slate-700">{formatPrice(row.active_order_total)}</td>
                                            <td className="py-3 px-4 text-right font-bold text-slate-900">{formatPrice(row.verified_revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Transaction Detail Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print:rounded-lg">
                    <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70">
                        <h3 className="text-sm font-bold text-slate-800">
                            {pick('Rincian Transaksi Periode', 'Period Transaction Details')} ({summary.displayedOrders})
                        </h3>
                        {summary.isTruncated && (
                            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                {pick(
                                    `Menampilkan ${summary.maxRows} dari ${summary.totalOrders} transaksi. Unduh CSV untuk semua data.`,
                                    `Showing ${summary.maxRows} of ${summary.totalOrders} orders. Download CSV for all rows.`
                                )}
                            </span>
                        )}
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-10 text-center text-sm text-slate-500">
                            {pick('Tidak ada transaksi yang sesuai dengan filter laporan ini.', 'No transactions match the selected report filters.')}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3 px-4">No</th>
                                        <th className="py-3 px-4">{pick('No. Pesanan & Tanggal', 'Order & Date')}</th>
                                        <th className="py-3 px-4">{pick('Pembeli', 'Buyer')}</th>
                                        <th className="py-3 px-4">{pick('Toko', 'Store')}</th>
                                        <th className="py-3 px-4">{pick('Item', 'Items')}</th>
                                        <th className="py-3 px-4">{pick('Status', 'Status')}</th>
                                        <th className="py-3 px-4 text-right">{pick('Total', 'Total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {orders.map((order, idx) => (
                                        <tr key={order.id} className="break-inside-avoid">
                                            <td className="py-3 px-4 text-slate-500">{idx + 1}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-mono text-xs font-semibold text-slate-900">
                                                    {order.order_number}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    {formatDisplayDate(order.created_at, isEn)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-slate-900">
                                                    {order.buyer?.name || 'Guest'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {order.buyer?.email || '-'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-700">
                                                {order.store?.name || pick('Toko Dihapus', 'Deleted Store')}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-slate-600 max-w-[240px]">
                                                {order.items?.length > 0
                                                    ? order.items
                                                          .map((item) => `${item.product_name} (x${item.quantity})`)
                                                          .join(', ')
                                                    : '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${getOrderBadgeClass(order.status)}`}>
                                                        {trOrderStatus(order.status)}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${getPaymentBadgeClass(order.payment_status)}`}>
                                                        {getPaymentStatusLabel(order.payment_status)} · {(order.payment_method || '-').toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                                {formatPrice(order.grand_total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-slate-200 bg-slate-50 text-sm font-bold text-slate-900">
                                        <td colSpan={6} className="py-3.5 px-4 text-right">
                                            {pick('Total Omzet Terverifikasi (Sesuai Filter)', 'Verified Revenue Total (Filtered)')}
                                        </td>
                                        <td className="py-3.5 px-4 text-right whitespace-nowrap text-emerald-700">
                                            {formatPrice(summary.verifiedRevenue)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>

                {/* Print Signature Area */}
                <div className="hidden print:flex justify-end pt-6">
                    <div className="text-center text-xs text-slate-700 w-56">
                        <p>{pick('Disahkan oleh,', 'Authorized by,')}</p>
                        <div className="h-14" />
                        <p className="font-bold border-t border-slate-400 pt-1">
                            {pick('Administrator Dunia Ikan', 'Dunia Ikan Administrator')}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
