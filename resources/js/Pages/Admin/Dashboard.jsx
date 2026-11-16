import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowUpDown,
    Download,
    ExternalLink,
    FileBarChart2,
    HelpCircle,
    MapPin,
    MoreHorizontal,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const REGION_MARKERS = {
    sumatra: { cx: 74, cy: 62 },
    java: { cx: 142, cy: 112 },
    east_java_bali: { cx: 184, cy: 116 },
    kalimantan_sulawesi: { cx: 214, cy: 64 },
};

function formatCompactIdr(value) {
    const num = Number(value || 0);
    if (num >= 1_000_000) {
        return `Rp ${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')} jt`;
    }
    if (num >= 1_000) {
        return `Rp ${Math.round(num / 1_000)} rb`;
    }
    return `Rp ${num}`;
}

export default function Dashboard({
    stats,
    comparisons = {},
    salesSeries = {},
    statusBreakdown = [],
    topOrders = [],
    cityDistribution = { source: 'orders', items: [] },
    recentOrders = [],
}) {
    const { isEn, pick, trOrderStatus } = useLanguage();

    const [period, setPeriod] = useState('6m');
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [hoveredSliceKey, setHoveredSliceKey] = useState(null);
    const [sortField, setSortField] = useState('grand_total');
    const [sortDir, setSortDir] = useState('desc');

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(price || 0));

    const activeSeries = useMemo(() => {
        const list = salesSeries?.[period];
        return Array.isArray(list) ? list : [];
    }, [salesSeries, period]);

    // Default active point cleanly highlights the highest revenue bar/point
    const defaultPinIndex = useMemo(() => {
        if (activeSeries.length === 0) {
            return -1;
        }
        let bestIdx = activeSeries.length - 1;
        let bestRev = -1;
        activeSeries.forEach((pt, idx) => {
            if (pt.revenue > bestRev) {
                bestRev = pt.revenue;
                bestIdx = idx;
            }
        });
        return bestIdx;
    }, [activeSeries]);

    const pinIndex = hoveredIdx !== null && activeSeries[hoveredIdx] ? hoveredIdx : defaultPinIndex;

    const chartMetrics = useMemo(() => {
        const width = 580;
        const height = 236;
        const padL = 62;
        const padR = 22;
        const padT = 56;
        const padB = 28;
        const plotW = width - padL - padR;
        const plotH = height - padT - padB;

        const maxRevRaw = Math.max(100_000, ...activeSeries.map((d) => Number(d.revenue || 0)));
        const maxOrdRaw = Math.max(2, ...activeSeries.map((d) => Number(d.orders || 0)));

        const points = activeSeries.map((item, idx) => {
            const x =
                activeSeries.length <= 1
                    ? padL + plotW / 2
                    : padL + (idx / (activeSeries.length - 1)) * plotW;
            const revY = padT + plotH - (Number(item.revenue || 0) / maxRevRaw) * plotH;
            const ordY = padT + plotH - (Number(item.orders || 0) / maxOrdRaw) * (plotH * 0.78);

            return {
                ...item,
                x,
                revY,
                ordY,
            };
        });

        const buildSmoothPath = (key) => {
            if (points.length === 0) {
                return '';
            }
            if (points.length === 1) {
                return `M ${points[0].x} ${points[0][key]}`;
            }

            let d = `M ${points[0].x.toFixed(1)} ${points[0][key].toFixed(1)}`;
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i];
                const p1 = points[i + 1];
                const midX = ((p0.x + p1.x) / 2).toFixed(1);
                d += ` C ${midX} ${p0[key].toFixed(1)}, ${midX} ${p1[key].toFixed(1)}, ${p1.x.toFixed(1)} ${p1[key].toFixed(1)}`;
            }
            return d;
        };

        const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
            value: maxRevRaw * ratio,
            y: padT + plotH - ratio * plotH,
        }));

        return {
            width,
            height,
            padT,
            padB,
            plotH,
            points,
            yTicks,
            revPath: buildSmoothPath('revY'),
            ordPath: buildSmoothPath('ordY'),
        };
    }, [activeSeries]);

    // Build Donut segments for Order Activity
    const donutSlices = useMemo(() => {
        const radius = 58;
        const circumference = 2 * Math.PI * radius;
        const nonZero = statusBreakdown.filter((item) => item.count > 0);
        const total = nonZero.reduce((sum, item) => sum + item.count, 0);

        if (total === 0) {
            return { radius, circumference, total: 0, arcs: [] };
        }

        let offset = 0;
        const arcs = nonZero.map((item) => {
            const fraction = item.count / total;
            const segLen = fraction * circumference;
            const gap = nonZero.length > 1 ? 2.5 : 0;
            const dash = Math.max(segLen - gap, 1);
            const arc = {
                ...item,
                dashArray: `${dash} ${circumference - dash}`,
                dashOffset: -offset,
            };
            offset += segLen;
            return arc;
        });

        return { radius, circumference, total, arcs };
    }, [statusBreakdown]);

    const activeSlice = useMemo(() => {
        if (!hoveredSliceKey) {
            return null;
        }
        return statusBreakdown.find((s) => s.key === hoveredSliceKey) || null;
    }, [statusBreakdown, hoveredSliceKey]);

    const tableRows = useMemo(() => {
        const source =
            topOrders && topOrders.length > 0
                ? topOrders
                : recentOrders.slice(0, 5).map((ord) => ({
                      id: ord.id,
                      order_number: ord.order_number,
                      store_name: ord.store?.name ?? 'Toko',
                      buyer_name: ord.buyer?.name ?? 'Pembeli',
                      grand_total: Number(ord.grand_total || 0),
                      status: ord.status,
                      payment_status: ord.payment_status,
                  }));

        return [...source].sort((a, b) => {
            const mul = sortDir === 'asc' ? 1 : -1;
            if (sortField === 'grand_total') {
                return (a.grand_total - b.grand_total) * mul;
            }
            return String(a[sortField] || '').localeCompare(String(b[sortField] || '')) * mul;
        });
    }, [topOrders, recentOrders, sortField, sortDir]);

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const pinnedPoint = pinIndex >= 0 ? chartMetrics.points[pinIndex] : null;
    const pinnedLeftPct =
        pinnedPoint && chartMetrics.width > 0
            ? Math.min(Math.max((pinnedPoint.x / chartMetrics.width) * 100, 14), 84)
            : 50;

    return (
        <AdminLayout>
            <Head title={pick('Dashboard Admin - Dunia Ikan', 'Admin Dashboard - Dunia Ikan')} />

            <div className="space-y-5">
                {/* Workspace Header Row (Overall + Dual CTAs) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-slate-900">
                            {pick('Ringkasan Platform', 'Platform Overview')}
                        </h1>
                        <p className="text-xs text-slate-600 mt-0.5">
                            {pick(
                                'Statistik performa transaksi, toko penangkar, dan panduan ikan secara real-time.',
                                'Real-time marketplace revenue, orders, breeder stores, and guide analytics.',
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <a
                            href="/admin-portal/reports/export"
                            className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition"
                        >
                            <Download className="h-3.5 w-3.5 text-slate-600" />
                            <span>{pick('Unduh CSV', 'Download report')}</span>
                        </a>
                        <Link
                            href="/admin-portal/reports"
                            className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition"
                        >
                            <FileBarChart2 className="h-3.5 w-3.5 text-[#0369A1]" />
                            <span>{pick('Buka Laporan Lengkap', 'Open detailed report')}</span>
                        </Link>
                    </div>
                </div>

                {/* Row 1: 4-Column Equify KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* KPI 1: Verified Revenue */}
                    <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-5 flex flex-col justify-between gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-600">
                                {pick('Volume Terverifikasi', 'Verified Revenue')}
                            </span>
                            <Link
                                href="/admin-portal/reports?payment_status=verified"
                                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                title={pick('Lihat laporan terbayar', 'View verified revenue report')}
                                aria-label={pick('Lihat laporan terbayar', 'View verified revenue report')}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="text-[22px] sm:text-[24px] font-bold tracking-tight text-slate-900 tabular-nums">
                            {formatPrice(stats.totalRevenue)}
                        </p>
                        <div>
                            {comparisons.revenueDeltaPct !== null && comparisons.revenueDeltaPct !== undefined ? (
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                        comparisons.revenueDeltaPct >= 0
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-rose-50 text-rose-700'
                                    }`}
                                >
                                    {comparisons.revenueDeltaPct >= 0 ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    <span>
                                        {comparisons.revenueDeltaPct >= 0 ? '+' : ''}
                                        {comparisons.revenueDeltaPct}% {pick('dari 30h lalu', 'vs prev 30d')}
                                    </span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>
                                        {pick('30h terakhir:', 'Last 30d:')} {formatCompactIdr(comparisons.revenueCurrent30d)}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* KPI 2: Orders */}
                    <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-5 flex flex-col justify-between gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-600">
                                {pick('Total Pesanan', 'Total Orders')}
                            </span>
                            <Link
                                href="/admin-portal/transactions"
                                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                title={pick('Buka daftar transaksi', 'View all orders')}
                                aria-label={pick('Buka daftar transaksi', 'View all orders')}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="text-[22px] sm:text-[24px] font-bold tracking-tight text-slate-900 tabular-nums">
                            {stats.totalOrders}
                        </p>
                        <div>
                            {comparisons.ordersDeltaPct !== null && comparisons.ordersDeltaPct !== undefined ? (
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                        comparisons.ordersDeltaPct >= 0
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-rose-50 text-rose-700'
                                    }`}
                                >
                                    {comparisons.ordersDeltaPct >= 0 ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    <span>
                                        {comparisons.ordersDeltaPct >= 0 ? '+' : ''}
                                        {comparisons.ordersDeltaPct}% {pick('dari 30h lalu', 'vs prev 30d')}
                                    </span>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-[#0369A1] px-2.5 py-0.5 text-[11px] font-semibold">
                                    <span>
                                        +{comparisons.ordersCurrent30d ?? stats.totalOrders}{' '}
                                        {pick('pesanan 30h terakhir', 'orders last 30d')}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* KPI 3: Stores & Users */}
                    <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-5 flex flex-col justify-between gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-600">
                                {pick('Toko & Pengguna', 'Stores & Users')}
                            </span>
                            <Link
                                href="/admin-portal/users"
                                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                title={pick('Kelola pengguna & penjual', 'Manage users & sellers')}
                                aria-label={pick('Kelola pengguna & penjual', 'Manage users & sellers')}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[22px] sm:text-[24px] font-bold tracking-tight text-slate-900 tabular-nums">
                                {stats.totalStores}
                            </span>
                            <span className="text-xs font-medium text-slate-600">
                                {pick('toko', 'stores')} · {stats.totalUsers} {pick('akun', 'users')}
                            </span>
                        </div>
                        <div>
                            {stats.pendingSellers > 0 ? (
                                <Link
                                    href="/admin-portal/users?seller_status=pending"
                                    className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 px-2.5 py-0.5 text-[11px] font-semibold hover:bg-amber-100 transition"
                                >
                                    <span>
                                        {stats.pendingSellers}{' '}
                                        {pick('pengajuan toko tunggu cek', 'seller approvals pending')}
                                    </span>
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold">
                                    <span>
                                        +{comparisons.usersCurrent30d ?? 0}{' '}
                                        {pick('pengguna baru 30h', 'new users in 30d')}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* KPI 4: Products & AI Guides */}
                    <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-5 flex flex-col justify-between gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-600">
                                {pick('Produk & Panduan Kiko', 'Products & Kiko Guides')}
                            </span>
                            <Link
                                href="/admin-portal/guides"
                                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                title={pick('Kelola panduan ikan Kiko', 'Manage Kiko fish guides')}
                                aria-label={pick('Kelola panduan ikan Kiko', 'Manage Kiko fish guides')}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[22px] sm:text-[24px] font-bold tracking-tight text-slate-900 tabular-nums">
                                {stats.totalProducts}
                            </span>
                            <span className="text-xs font-medium text-slate-600">
                                {pick('produk', 'products')} · {stats.totalGuides} {pick('panduan', 'guides')}
                            </span>
                        </div>
                        <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold">
                                <span>
                                    {stats.activeProducts ?? stats.totalProducts}{' '}
                                    {pick('produk aktif tayang', 'active catalog listings')}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Middle Analytics Row (Total Sales Line Chart + Order Activity Donut) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                    {/* Left Chart: Total Sales */}
                    <div className="xl:col-span-7 bg-white rounded-[14px] border border-[#E5E7EB] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-[15px] font-semibold text-slate-900">
                                    {pick('Total Penjualan', 'Total Sales')}
                                </h2>
                                <span
                                    className="group relative inline-flex items-center text-slate-500"
                                    tabIndex={0}
                                    aria-label={pick(
                                        'Grafik volume pendapatan terverifikasi dan jumlah pesanan',
                                        'Verified revenue and order count trend chart',
                                    )}
                                >
                                    <HelpCircle className="h-3.5 w-3.5" />
                                    <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 w-52 -translate-x-1/2 rounded-lg bg-[#1A1C20] px-2.5 py-1.5 text-[11px] font-normal text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus:opacity-100">
                                        {pick(
                                            'Garis hitam menunjukkan omzet terbayar terverifikasi; garis hijau menampilkan jumlah pesanan.',
                                            'Dark line shows verified revenue; lime line tracks order counts.',
                                        )}
                                    </span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={period}
                                    onChange={(e) => {
                                        setPeriod(e.target.value);
                                        setHoveredIdx(null);
                                    }}
                                    aria-label={pick('Rentang waktu grafik', 'Chart timeframe')}
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:border-[#00C0E8] focus:outline-none"
                                >
                                    <option value="7d">{pick('7 Hari', 'Last 7 days')}</option>
                                    <option value="30d">{pick('30 Hari', 'Last 30 days')}</option>
                                    <option value="6m">{pick('6 Bulan', '6 Months')}</option>
                                </select>
                                <Link
                                    href="/admin-portal/reports"
                                    className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                    title={pick('Detail laporan', 'Report details')}
                                    aria-label={pick('Detail laporan', 'Report details')}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* SVG Dual-Line Chart + Obsidian Floating Tooltip */}
                        <div className="relative">
                            {pinnedPoint && (
                                <div
                                    style={{ left: `${pinnedLeftPct}%` }}
                                    className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md bg-[#1A1C20] px-2.5 py-1.5 text-center shadow-lg transition-all duration-150"
                                >
                                    <p className="text-[10px] font-medium text-slate-300 whitespace-nowrap">
                                        {pinnedPoint.fullLabel}
                                    </p>
                                    <p className="text-xs font-bold text-white whitespace-nowrap tabular-nums">
                                        {formatPrice(pinnedPoint.revenue)}
                                    </p>
                                    <p className="text-[10px] font-medium text-[#A3E635] whitespace-nowrap">
                                        {pinnedPoint.orders} {pick('pesanan', 'orders')}
                                    </p>
                                </div>
                            )}

                            <svg
                                viewBox={`0 0 ${chartMetrics.width} ${chartMetrics.height}`}
                                className="w-full h-52 overflow-visible select-none"
                                role="img"
                                aria-label={pick('Grafik tren penjualan Dunia Ikan', 'Dunia Ikan sales trend chart')}
                            >
                                {/* Horizontal gridlines & Y ticks */}
                                {chartMetrics.yTicks.map((tick, idx) => (
                                    <g key={idx}>
                                        <line
                                            x1={56}
                                            x2={chartMetrics.width - 12}
                                            y1={tick.y}
                                            y2={tick.y}
                                            stroke="#E5E7EB"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={50}
                                            y={tick.y + 3}
                                            textAnchor="end"
                                            className="fill-slate-500 text-[10px]"
                                        >
                                            {formatCompactIdr(tick.value)}
                                        </text>
                                    </g>
                                ))}

                                {/* Vertical Dashed Line on Active Point */}
                                {pinnedPoint && (
                                    <line
                                        x1={pinnedPoint.x}
                                        x2={pinnedPoint.x}
                                        y1={chartMetrics.padT}
                                        y2={chartMetrics.padT + chartMetrics.plotH}
                                        stroke="#9CA3AF"
                                        strokeDasharray="3 3"
                                        strokeWidth="1"
                                    />
                                )}

                                {/* Orders Line (Lime Green) */}
                                {chartMetrics.ordPath && (
                                    <path
                                        d={chartMetrics.ordPath}
                                        fill="none"
                                        stroke="#84CC16"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                )}

                                {/* Revenue Line (Charcoal Black) */}
                                {chartMetrics.revPath && (
                                    <path
                                        d={chartMetrics.revPath}
                                        fill="none"
                                        stroke="#111827"
                                        strokeWidth="2.3"
                                        strokeLinecap="round"
                                    />
                                )}

                                {/* Interactive Points + X Labels */}
                                {chartMetrics.points.map((pt, idx) => {
                                    const isActive = idx === pinIndex;
                                    return (
                                        <g
                                            key={idx}
                                            onMouseEnter={() => setHoveredIdx(idx)}
                                            onFocus={() => setHoveredIdx(idx)}
                                            className="cursor-pointer"
                                        >
                                            <rect
                                                x={pt.x - 24}
                                                y={chartMetrics.padT}
                                                width={48}
                                                height={chartMetrics.plotH + 22}
                                                fill="transparent"
                                            />
                                            <circle
                                                cx={pt.x}
                                                cy={pt.revY}
                                                r={isActive ? 4.5 : 2.5}
                                                fill={isActive ? '#FFFFFF' : '#111827'}
                                                stroke="#111827"
                                                strokeWidth={isActive ? 2.5 : 0}
                                            />
                                            <text
                                                x={pt.x}
                                                y={chartMetrics.height - 6}
                                                textAnchor="middle"
                                                className={`text-[10px] ${
                                                    isActive
                                                        ? 'fill-slate-900 font-bold'
                                                        : 'fill-slate-500 font-medium'
                                                }`}
                                            >
                                                {pt.label}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Chart Bottom Legend */}
                        <div className="mt-3 flex items-center justify-center gap-6 text-xs font-medium text-slate-700">
                            <span className="inline-flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-[2px] bg-[#111827]" />
                                {pick('Pendapatan (Rp)', 'Revenue')}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-[2px] bg-[#84CC16]" />
                                {pick('Jumlah Pesanan', 'Orders')}
                            </span>
                        </div>
                    </div>

                    {/* Right Chart: Order Activity Donut */}
                    <div className="xl:col-span-5 bg-white rounded-[14px] border border-[#E5E7EB] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-[15px] font-semibold text-slate-900">
                                    {pick('Aktivitas Pesanan', 'Order Activity')}
                                </h2>
                                <span
                                    className="group relative inline-flex items-center text-slate-500"
                                    tabIndex={0}
                                    aria-label={pick(
                                        'Distribusi status seluruh pesanan marketplace',
                                        'Status breakdown of all marketplace orders',
                                    )}
                                >
                                    <HelpCircle className="h-3.5 w-3.5" />
                                    <span className="pointer-events-none absolute right-0 top-full z-20 mt-1.5 w-48 rounded-lg bg-[#1A1C20] px-2.5 py-1.5 text-[11px] font-normal text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus:opacity-100">
                                        {pick(
                                            'Persentase tiap tahap pesanan dari menunggu bayar hingga selesai.',
                                            'Share of orders across payment, shipping, and completion.',
                                        )}
                                    </span>
                                </span>
                            </div>
                            <Link
                                href="/admin-portal/transactions"
                                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                title={pick('Lihat semua pesanan', 'View all transactions')}
                                aria-label={pick('Lihat semua pesanan', 'View all transactions')}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Link>
                        </div>

                        {donutSlices.total > 0 ? (
                            <>
                                <div className="relative mx-auto my-2 flex items-center justify-center">
                                    <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
                                        <circle
                                            cx="90"
                                            cy="90"
                                            r={donutSlices.radius}
                                            fill="transparent"
                                            stroke="#F1F5F9"
                                            strokeWidth="26"
                                        />
                                        {donutSlices.arcs.map((arc) => {
                                            const isHovered = hoveredSliceKey === arc.key;
                                            return (
                                                <circle
                                                    key={arc.key}
                                                    cx="90"
                                                    cy="90"
                                                    r={donutSlices.radius}
                                                    fill="transparent"
                                                    stroke={arc.color}
                                                    strokeWidth={isHovered ? 30 : 26}
                                                    strokeDasharray={arc.dashArray}
                                                    strokeDashoffset={arc.dashOffset}
                                                    onMouseEnter={() => setHoveredSliceKey(arc.key)}
                                                    onMouseLeave={() => setHoveredSliceKey(null)}
                                                    className="cursor-pointer transition-all duration-150"
                                                />
                                            );
                                        })}
                                    </svg>
                                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                        <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                                            {activeSlice ? `${activeSlice.percentage}%` : donutSlices.total}
                                        </span>
                                        <span className="text-[11px] font-medium text-slate-600 max-w-[92px] truncate">
                                            {activeSlice
                                                ? isEn
                                                    ? activeSlice.labelEn
                                                    : activeSlice.labelId
                                                : pick('Total Pesanan', 'Total Orders')}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
                                    {statusBreakdown.map((item) => (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onMouseEnter={() => setHoveredSliceKey(item.key)}
                                            onMouseLeave={() => setHoveredSliceKey(null)}
                                            onClick={() =>
                                                setHoveredSliceKey((prev) =>
                                                    prev === item.key ? null : item.key,
                                                )
                                            }
                                            className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition ${
                                                hoveredSliceKey === item.key
                                                    ? 'bg-slate-100 font-bold text-slate-900'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span
                                                className="h-2.5 w-2.5 rounded-[2px] shrink-0"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span>{isEn ? item.labelEn : item.labelId}</span>
                                            <span className="font-bold text-slate-900 tabular-nums">
                                                {item.percentage}%
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                                <p className="text-xs font-semibold text-slate-700">
                                    {pick('Belum ada pesanan tercatat.', 'No orders recorded yet.')}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    {pick(
                                        'Grafik proporsi status akan muncul saat transaksi pertama masuk.',
                                        'Status distribution appears once the first order arrives.',
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 3: Bottom Report Row (Top Orders Table + Regional City Map) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                    {/* Left Table: Top Store / Order Deals */}
                    <div className="xl:col-span-7 bg-white rounded-[14px] border border-[#E5E7EB] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-[15px] font-semibold text-slate-900">
                                    {pick('Transaksi Terbesar', 'Top Transactions')}
                                </h2>
                                <span
                                    className="group relative inline-flex items-center text-slate-500"
                                    tabIndex={0}
                                    aria-label={pick(
                                        'Pesanan aktif dengan nilai transaksi tertinggi',
                                        'Non-cancelled orders ranked by transaction value',
                                    )}
                                >
                                    <HelpCircle className="h-3.5 w-3.5" />
                                </span>
                            </div>

                            <Link
                                href="/admin-portal/transactions"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0369A1] hover:text-[#0284C7] transition"
                            >
                                <span>{pick('Semua Transaksi', 'All Transactions')}</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {tableRows.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-slate-600 font-semibold">
                                            <th className="py-2.5 pr-3 w-10">No</th>
                                            <th className="py-2.5 pr-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSort('store_name')}
                                                    className="inline-flex items-center gap-1 hover:text-slate-900"
                                                >
                                                    <span>{pick('Toko & Pesanan', 'Store & Order')}</span>
                                                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                                                </button>
                                            </th>
                                            <th className="py-2.5 pr-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSort('grand_total')}
                                                    className="inline-flex items-center gap-1 hover:text-slate-900"
                                                >
                                                    <span>{pick('Nilai Transaksi', 'Deal Value')}</span>
                                                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                                                </button>
                                            </th>
                                            <th className="py-2.5 pr-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleSort('buyer_name')}
                                                    className="inline-flex items-center gap-1 hover:text-slate-900"
                                                >
                                                    <span>{pick('Pembeli', 'Buyer')}</span>
                                                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                                                </button>
                                            </th>
                                            <th className="py-2.5 text-right">{pick('Status', 'Status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {tableRows.map((ord, idx) => (
                                            <tr
                                                key={ord.id}
                                                className="hover:bg-slate-50/80 transition"
                                            >
                                                <td className="py-3 pr-3 font-medium text-slate-500 tabular-nums">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3 pr-3">
                                                    <Link
                                                        href={`/admin-portal/transactions?q=${encodeURIComponent(ord.order_number)}`}
                                                        className="font-semibold text-slate-900 hover:text-[#0369A1] transition block"
                                                    >
                                                        {ord.store_name}
                                                    </Link>
                                                    <span className="font-mono text-[11px] text-slate-500">
                                                        {ord.order_number}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-3 font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                                                    {formatPrice(ord.grand_total)}
                                                </td>
                                                <td className="py-3 pr-3 text-slate-700 font-medium">
                                                    {ord.buyer_name}
                                                </td>
                                                <td className="py-3 text-right whitespace-nowrap">
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                                                        {trOrderStatus(ord.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 py-8 text-center">
                                {pick('Belum ada transaksi di platform.', 'No platform transactions yet.')}
                            </p>
                        )}
                    </div>

                    {/* Right Visual: Customer/Order City Distribution Map (Indonesian Archipelago) */}
                    <div className="xl:col-span-5 bg-white rounded-[14px] border border-[#E5E7EB] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-[15px] font-semibold text-slate-900">
                                    {pick('Sebaran Kota Pesanan', 'Orders by City')}
                                </h2>
                                <span className="text-[11px] font-medium text-slate-500">
                                    ({cityDistribution.source === 'stores' ? pick('Toko', 'Stores') : pick('Pengiriman', 'Shipping')})
                                </span>
                            </div>
                            <Link
                                href="/admin-portal/reports"
                                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                title={pick('Lihat rincian laporan', 'Open reports')}
                                aria-label={pick('Lihat rincian laporan', 'Open reports')}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Stylized Minimal Archipelago Map */}
                        <div className="relative my-2 flex items-center justify-center">
                            <svg
                                viewBox="0 0 360 155"
                                className="w-full max-w-[340px] h-auto"
                                role="img"
                                aria-label={pick('Peta sebaran kota transaksi Indonesia', 'Indonesian city distribution map')}
                            >
                                {/* Sumatra */}
                                <path
                                    d="M28 24 L42 18 L66 42 L95 74 L98 94 L82 96 L56 68 L30 42 Z"
                                    fill="#E2E8F0"
                                />
                                {/* Java */}
                                <path
                                    d="M104 108 L156 104 L182 114 L180 124 L132 122 L102 117 Z"
                                    fill="#E2E8F0"
                                />
                                {/* Bali & Nusa Tenggara */}
                                <path
                                    d="M188 116 L210 115 L242 121 L238 128 L205 123 L187 122 Z"
                                    fill="#E2E8F0"
                                />
                                {/* Kalimantan */}
                                <path
                                    d="M138 36 L176 28 L194 48 L186 80 L152 84 L134 62 Z"
                                    fill="#E2E8F0"
                                />
                                {/* Sulawesi */}
                                <path
                                    d="M214 40 L242 36 L246 52 L228 60 L236 86 L216 90 L210 66 Z"
                                    fill="#E2E8F0"
                                />
                                {/* Maluku / Papua */}
                                <path
                                    d="M268 48 L286 44 L290 66 L270 72 Z M296 56 L342 62 L352 96 L326 98 L300 78 Z"
                                    fill="#E2E8F0"
                                />

                                {/* Active Glowing Radar Dots per Real City */}
                                {cityDistribution.items?.map((item, idx) => {
                                    const pos = REGION_MARKERS[item.region] || REGION_MARKERS.java;
                                    const jitterX = (idx % 2 === 0 ? -1 : 1) * idx * 6;
                                    const jitterY = idx * 3;
                                    return (
                                        <g key={item.city}>
                                            <circle
                                                cx={pos.cx + jitterX}
                                                cy={pos.cy + jitterY}
                                                r="12"
                                                fill={item.color}
                                                fillOpacity="0.22"
                                            />
                                            <circle
                                                cx={pos.cx + jitterX}
                                                cy={pos.cy + jitterY}
                                                r="5"
                                                fill={item.color}
                                                stroke="#FFFFFF"
                                                strokeWidth="1.5"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Top Cities Percentage Pills */}
                        {cityDistribution.items?.length > 0 ? (
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                                {cityDistribution.items.map((item) => (
                                    <span
                                        key={item.city}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-800"
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full shrink-0"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="max-w-[115px] truncate">{item.city}</span>
                                        <span className="font-bold text-slate-900 tabular-nums">
                                            {item.percentage}%
                                        </span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{pick('Belum ada data kota tercatat.', 'No city data recorded yet.')}</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
