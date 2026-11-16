<?php

namespace App\Services;

use App\Models\FishGuide;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminAnalyticsService
{
    public const MAX_REPORT_ROWS = 500;

    /**
     * Compute all platform metrics, trend series, status breakdown, top orders, and city distribution.
     *
     * @return array{
     *     stats: array<string, float|int>,
     *     comparisons: array<string, float|int|null>,
     *     salesSeries: array<string, list<array{label: string, fullLabel: string, revenue: float, orders: int}>>,
     *     statusBreakdown: list<array{key: string, labelId: string, labelEn: string, count: int, percentage: float, color: string}>,
     *     topOrders: list<array{id: int, order_number: string, store_name: string, buyer_name: string, grand_total: float, status: string, payment_status: string}>,
     *     cityDistribution: array{source: string, items: list<array{city: string, count: int, percentage: float, color: string, region: string}>}
     * }
     */
    public function getDashboardData(): array
    {
        $now = now();
        $currentStart = $now->copy()->subDays(30)->startOfDay();
        $previousStart = $now->copy()->subDays(60)->startOfDay();

        $totalOrders = Order::count();
        $verifiedRevenue = (float) Order::where('payment_status', 'verified')->sum('grand_total');
        $verifiedOrders = Order::where('payment_status', 'verified')->count();
        $pendingSellers = User::where('role', 'buyer')->where('seller_status', 'pending')->count();
        $activeProducts = Product::where('is_active', true)->count();

        $stats = [
            'totalUsers' => User::count(),
            'totalStores' => Store::count(),
            'totalProducts' => Product::count(),
            'totalOrders' => $totalOrders,
            'totalRevenue' => $verifiedRevenue,
            'totalGuides' => FishGuide::count(),
            'pendingSellers' => $pendingSellers,
            'activeProducts' => $activeProducts,
            'verifiedOrders' => $verifiedOrders,
            'averageOrderValue' => $verifiedOrders > 0 ? round($verifiedRevenue / $verifiedOrders, 0) : 0.0,
        ];

        $revenueCurrent30d = (float) Order::where('payment_status', 'verified')
            ->where('created_at', '>=', $currentStart)
            ->sum('grand_total');
        $revenuePrev30d = (float) Order::where('payment_status', 'verified')
            ->whereBetween('created_at', [$previousStart, $currentStart])
            ->sum('grand_total');

        $ordersCurrent30d = Order::where('created_at', '>=', $currentStart)->count();
        $ordersPrev30d = Order::whereBetween('created_at', [$previousStart, $currentStart])->count();
        $usersCurrent30d = User::where('created_at', '>=', $currentStart)->count();

        $comparisons = [
            'revenueCurrent30d' => $revenueCurrent30d,
            'revenueDeltaPct' => $this->percentDelta($revenueCurrent30d, $revenuePrev30d),
            'ordersCurrent30d' => $ordersCurrent30d,
            'ordersDeltaPct' => $this->percentDelta((float) $ordersCurrent30d, (float) $ordersPrev30d),
            'usersCurrent30d' => $usersCurrent30d,
        ];

        $windowStart = $now->copy()->subMonths(5)->startOfMonth();
        $windowOrders = Order::query()
            ->where('created_at', '>=', $windowStart)
            ->get(['id', 'grand_total', 'payment_status', 'status', 'created_at']);

        $salesSeries = [
            '7d' => $this->buildDailySeries($windowOrders, $now, 7),
            '30d' => $this->buildFiveDaySeries($windowOrders, $now),
            '6m' => $this->buildMonthlySeries($windowOrders, $now, 6),
        ];

        $topOrders = Order::with(['buyer:id,name', 'store:id,name'])
            ->where('status', '!=', 'cancelled')
            ->orderByDesc('grand_total')
            ->latest()
            ->take(5)
            ->get()
            ->map(function (Order $order): array {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'store_name' => $order->store?->name ?? 'Toko',
                    'buyer_name' => $order->buyer?->name ?? 'Pembeli',
                    'grand_total' => (float) $order->grand_total,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                ];
            })
            ->values()
            ->all();

        return [
            'stats' => $stats,
            'comparisons' => $comparisons,
            'salesSeries' => $salesSeries,
            'statusBreakdown' => $this->buildStatusBreakdown($totalOrders),
            'topOrders' => $topOrders,
            'cityDistribution' => $this->buildCityDistribution(),
        ];
    }

    /**
     * Build filtered transaction report data, summary KPIs, and store breakdown.
     *
     * @param  array<string, mixed>  $rawFilters
     * @return array{
     *     orders: Collection<int, Order>,
     *     summary: array{totalOrders: int, verifiedOrders: int, verifiedRevenue: float, activeOrderTotal: float, cancelledOrders: int, displayedOrders: int, isTruncated: bool, maxRows: int},
     *     storeBreakdown: Collection<int, array{store_id: int|null, store_name: string, total_orders: int, verified_orders: int, verified_revenue: float, active_order_total: float}>,
     *     stores: Collection<int, Store>,
     *     filters: array{date_from: string, date_to: string, store_id: string, status: string, payment_status: string},
     *     generatedAt: string
     * }
     */
    public function getReportData(array $rawFilters): array
    {
        [$baseQuery, $filters] = $this->buildFilteredReportQuery($rawFilters);

        $totalMatchingOrders = (clone $baseQuery)->count();

        $summaryRow = (clone $baseQuery)
            ->selectRaw("
                COUNT(*) as total_orders,
                COALESCE(SUM(CASE WHEN payment_status = 'verified' THEN 1 ELSE 0 END), 0) as verified_orders,
                COALESCE(SUM(CASE WHEN payment_status = 'verified' THEN grand_total ELSE 0 END), 0) as verified_revenue,
                COALESCE(SUM(CASE WHEN status != 'cancelled' THEN grand_total ELSE 0 END), 0) as active_order_total,
                COALESCE(SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END), 0) as cancelled_orders
            ")
            ->first();

        $stores = Store::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        $storeNames = $stores->pluck('name', 'id');

        $storeBreakdown = (clone $baseQuery)
            ->selectRaw("
                store_id,
                COUNT(*) as total_orders,
                COALESCE(SUM(CASE WHEN payment_status = 'verified' THEN 1 ELSE 0 END), 0) as verified_orders,
                COALESCE(SUM(CASE WHEN payment_status = 'verified' THEN grand_total ELSE 0 END), 0) as verified_revenue,
                COALESCE(SUM(CASE WHEN status != 'cancelled' THEN grand_total ELSE 0 END), 0) as active_order_total
            ")
            ->groupBy('store_id')
            ->get()
            ->map(function (object $row) use ($storeNames): array {
                return [
                    'store_id' => $row->store_id ? (int) $row->store_id : null,
                    'store_name' => $storeNames[$row->store_id] ?? 'Toko Dihapus',
                    'total_orders' => (int) $row->total_orders,
                    'verified_orders' => (int) $row->verified_orders,
                    'verified_revenue' => (float) $row->verified_revenue,
                    'active_order_total' => (float) $row->active_order_total,
                ];
            })
            ->sortByDesc('verified_revenue')
            ->values();

        $orders = (clone $baseQuery)
            ->with(['buyer:id,name,email', 'store:id,name', 'items'])
            ->latest()
            ->limit(self::MAX_REPORT_ROWS)
            ->get();

        return [
            'orders' => $orders,
            'summary' => [
                'totalOrders' => (int) ($summaryRow->total_orders ?? 0),
                'verifiedOrders' => (int) ($summaryRow->verified_orders ?? 0),
                'verifiedRevenue' => (float) ($summaryRow->verified_revenue ?? 0),
                'activeOrderTotal' => (float) ($summaryRow->active_order_total ?? 0),
                'cancelledOrders' => (int) ($summaryRow->cancelled_orders ?? 0),
                'displayedOrders' => $orders->count(),
                'isTruncated' => $totalMatchingOrders > self::MAX_REPORT_ROWS,
                'maxRows' => self::MAX_REPORT_ROWS,
            ],
            'storeBreakdown' => $storeBreakdown,
            'stores' => $stores,
            'filters' => $filters,
            'generatedAt' => now()->toIso8601String(),
        ];
    }

    /**
     * Stream a UTF-8 BOM CSV export with formula-injection protection.
     *
     * @param  array<string, mixed>  $rawFilters
     */
    public function streamReportCsv(array $rawFilters): StreamedResponse
    {
        [$baseQuery, $filters] = $this->buildFilteredReportQuery($rawFilters);

        $fromPart = $filters['date_from'] !== '' ? $filters['date_from'] : 'awal';
        $toPart = $filters['date_to'] !== '' ? $filters['date_to'] : 'akhir';
        $filename = "laporan-transaksi-dunia-ikan-{$fromPart}-sd-{$toPart}.csv";

        return response()->streamDownload(function () use ($baseQuery): void {
            $handle = fopen('php://output', 'wb');

            if ($handle === false) {
                return;
            }

            // UTF-8 BOM keeps Indonesian text intact when opened in Microsoft Excel.
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'No',
                'No. Pesanan',
                'Tanggal Transaksi',
                'Pembeli',
                'Email Pembeli',
                'Toko',
                'Item Produk',
                'Metode Pembayaran',
                'Status Pembayaran',
                'Status Pesanan',
                'Subtotal Produk (Rp)',
                'Ongkir (Rp)',
                'Total (Rp)',
            ]);

            $index = 1;

            foreach ((clone $baseQuery)->with(['buyer:id,name,email', 'store:id,name', 'items'])->latest()->cursor() as $order) {
                $itemSummary = $order->items
                    ->map(fn (object $item): string => "{$item->product_name} (x{$item->quantity})")
                    ->implode('; ');

                fputcsv($handle, [
                    $index,
                    $this->safeCsvCell($order->order_number),
                    $order->created_at?->format('Y-m-d H:i:s') ?? '',
                    $this->safeCsvCell($order->buyer?->name ?? 'Guest'),
                    $this->safeCsvCell($order->buyer?->email ?? '-'),
                    $this->safeCsvCell($order->store?->name ?? 'Toko Dihapus'),
                    $this->safeCsvCell($itemSummary !== '' ? $itemSummary : '-'),
                    $this->safeCsvCell($order->payment_method),
                    $this->safeCsvCell($order->payment_status),
                    $this->safeCsvCell($order->status),
                    number_format((float) $order->total_product_amount, 2, '.', ''),
                    number_format((float) $order->shipping_cost, 2, '.', ''),
                    number_format((float) $order->grand_total, 2, '.', ''),
                ]);

                $index++;
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Build city distribution list from non-cancelled orders, falling back to stores.
     *
     * @return array{source: string, items: list<array{city: string, count: int, percentage: float, color: string, region: string}>}
     */
    public function buildCityDistribution(): array
    {
        $source = 'orders';
        $rows = Order::query()
            ->where('status', '!=', 'cancelled')
            ->whereNotNull('shipping_city')
            ->where('shipping_city', '!=', '')
            ->selectRaw('shipping_city as city_name, COUNT(*) as total')
            ->groupBy('shipping_city')
            ->orderByDesc('total')
            ->get();

        if ($rows->isEmpty()) {
            $source = 'stores';
            $rows = Store::query()
                ->whereNotNull('city')
                ->where('city', '!=', '')
                ->selectRaw('city as city_name, COUNT(*) as total')
                ->groupBy('city')
                ->orderByDesc('total')
                ->get();
        }

        $total = (int) $rows->sum('total');
        $palette = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B'];

        $items = $rows->take(4)->values()->map(function (object $row, int $index) use ($total, $palette): array {
            $city = trim((string) $row->city_name);
            $count = (int) $row->total;

            return [
                'city' => $city,
                'count' => $count,
                'percentage' => $total > 0 ? round(($count / $total) * 100, 1) : 0.0,
                'color' => $palette[$index % count($palette)],
                'region' => $this->inferRegion($city),
            ];
        })->all();

        return [
            'source' => $source,
            'items' => $items,
        ];
    }

    /**
     * @param  array<string, mixed>  $rawFilters
     * @return array{0: Builder<Order>, 1: array{date_from: string, date_to: string, store_id: string, status: string, payment_status: string}}
     */
    private function buildFilteredReportQuery(array $rawFilters): array
    {
        $dateFrom = $this->parseDate($rawFilters['date_from'] ?? null);
        $dateTo = $this->parseDate($rawFilters['date_to'] ?? null);
        $rawStoreId = $rawFilters['store_id'] ?? null;
        $storeId = is_numeric($rawStoreId) && (int) $rawStoreId > 0 ? (int) $rawStoreId : null;
        $status = is_string($rawFilters['status'] ?? null) ? trim((string) $rawFilters['status']) : '';
        $paymentStatus = is_string($rawFilters['payment_status'] ?? null) ? trim((string) $rawFilters['payment_status']) : '';

        $query = Order::query()
            ->when($dateFrom !== null, function (Builder $builder) use ($dateFrom): void {
                $builder->where('created_at', '>=', $dateFrom->copy()->startOfDay());
            })
            ->when($dateTo !== null, function (Builder $builder) use ($dateTo): void {
                $builder->where('created_at', '<=', $dateTo->copy()->endOfDay());
            })
            ->when($storeId !== null, function (Builder $builder) use ($storeId): void {
                $builder->where('store_id', $storeId);
            })
            ->when($status !== '', function (Builder $builder) use ($status): void {
                $builder->where('status', $status);
            })
            ->when($paymentStatus !== '', function (Builder $builder) use ($paymentStatus): void {
                $builder->where('payment_status', $paymentStatus);
            });

        $filters = [
            'date_from' => $dateFrom?->format('Y-m-d') ?? '',
            'date_to' => $dateTo?->format('Y-m-d') ?? '',
            'store_id' => $storeId !== null ? (string) $storeId : '',
            'status' => $status,
            'payment_status' => $paymentStatus,
        ];

        return [$query, $filters];
    }

    private function percentDelta(float $current, float $previous): ?float
    {
        if ($previous <= 0.0) {
            return null;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * @param  Collection<int, Order>  $orders
     * @return list<array{label: string, fullLabel: string, revenue: float, orders: int}>
     */
    private function buildDailySeries(Collection $orders, Carbon $now, int $days): array
    {
        $series = [];

        for ($offset = $days - 1; $offset >= 0; $offset--) {
            $day = $now->copy()->subDays($offset);
            $dayKey = $day->format('Y-m-d');
            $dayOrders = $orders->filter(fn (Order $order): bool => $order->created_at?->format('Y-m-d') === $dayKey);

            $series[] = [
                'label' => $day->format('d/m'),
                'fullLabel' => $day->translatedFormat('d M Y'),
                'revenue' => (float) $dayOrders->where('payment_status', 'verified')->sum('grand_total'),
                'orders' => $dayOrders->where('status', '!=', 'cancelled')->count(),
            ];
        }

        return $series;
    }

    /**
     * @param  Collection<int, Order>  $orders
     * @return list<array{label: string, fullLabel: string, revenue: float, orders: int}>
     */
    private function buildFiveDaySeries(Collection $orders, Carbon $now): array
    {
        $series = [];

        for ($bucket = 5; $bucket >= 0; $bucket--) {
            $end = $now->copy()->subDays($bucket * 5)->endOfDay();
            $start = $now->copy()->subDays(($bucket * 5) + 4)->startOfDay();
            $bucketOrders = $orders->filter(
                fn (Order $order): bool => $order->created_at !== null && $order->created_at->between($start, $end),
            );

            $series[] = [
                'label' => $end->format('d/m'),
                'fullLabel' => $start->format('d M').' - '.$end->format('d M Y'),
                'revenue' => (float) $bucketOrders->where('payment_status', 'verified')->sum('grand_total'),
                'orders' => $bucketOrders->where('status', '!=', 'cancelled')->count(),
            ];
        }

        return $series;
    }

    /**
     * @param  Collection<int, Order>  $orders
     * @return list<array{label: string, fullLabel: string, revenue: float, orders: int}>
     */
    private function buildMonthlySeries(Collection $orders, Carbon $now, int $months): array
    {
        $series = [];

        for ($offset = $months - 1; $offset >= 0; $offset--) {
            $month = $now->copy()->subMonths($offset)->startOfMonth();
            $monthKey = $month->format('Y-m');
            $monthOrders = $orders->filter(fn (Order $order): bool => $order->created_at?->format('Y-m') === $monthKey);

            $series[] = [
                'label' => $month->format('M Y'),
                'fullLabel' => $month->translatedFormat('F Y'),
                'revenue' => (float) $monthOrders->where('payment_status', 'verified')->sum('grand_total'),
                'orders' => $monthOrders->where('status', '!=', 'cancelled')->count(),
            ];
        }

        return $series;
    }

    /**
     * @return list<array{key: string, labelId: string, labelEn: string, count: int, percentage: float, color: string}>
     */
    private function buildStatusBreakdown(int $totalOrders): array
    {
        $counts = Order::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $groups = [
            [
                'key' => 'in_progress',
                'labelId' => 'Proses & Kirim',
                'labelEn' => 'Processing & Shipped',
                'count' => (int) ($counts['processing'] ?? 0) + (int) ($counts['shipped'] ?? 0),
                'color' => '#38BDF8',
            ],
            [
                'key' => 'delivered',
                'labelId' => 'Selesai',
                'labelEn' => 'Delivered',
                'count' => (int) ($counts['delivered'] ?? 0),
                'color' => '#6EE7B7',
            ],
            [
                'key' => 'awaiting',
                'labelId' => 'Verifikasi Bayar',
                'labelEn' => 'Verify Payment',
                'count' => (int) ($counts['awaiting_confirmation'] ?? 0),
                'color' => '#A5B4FC',
            ],
            [
                'key' => 'pending',
                'labelId' => 'Menunggu Bayar',
                'labelEn' => 'Pending Payment',
                'count' => (int) ($counts['pending_payment'] ?? 0) + (int) ($counts['pending'] ?? 0),
                'color' => '#F59E0B',
            ],
            [
                'key' => 'cancelled',
                'labelId' => 'Dibatalkan',
                'labelEn' => 'Cancelled',
                'count' => (int) ($counts['cancelled'] ?? 0),
                'color' => '#1E293B',
            ],
        ];

        return array_map(static function (array $item) use ($totalOrders): array {
            $item['percentage'] = $totalOrders > 0
                ? round(($item['count'] / $totalOrders) * 100, 1)
                : 0.0;

            return $item;
        }, $groups);
    }

    private function parseDate(mixed $value): ?Carbon
    {
        if (! is_string($value)) {
            return null;
        }

        $trimmed = trim($value);

        if ($trimmed === '') {
            return null;
        }

        try {
            $parsed = Carbon::createFromFormat('Y-m-d', $trimmed);

            return $parsed !== false ? $parsed : null;
        } catch (\Throwable) {
            return null;
        }
    }

    private function safeCsvCell(mixed $value): string
    {
        $text = (string) ($value ?? '');

        if ($text !== '' && in_array($text[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
            return "'".$text;
        }

        return $text;
    }

    private function inferRegion(string $city): string
    {
        $normalized = mb_strtolower($city);

        foreach (['medan', 'palembang', 'padang', 'pekanbaru', 'batam', 'lampung', 'aceh', 'jambi'] as $keyword) {
            if (str_contains($normalized, $keyword)) {
                return 'sumatra';
            }
        }

        foreach (['surabaya', 'malang', 'denpasar', 'bali', 'sidoarjo', 'banyuwangi', 'kediri', 'lombok', 'mataram'] as $keyword) {
            if (str_contains($normalized, $keyword)) {
                return 'east_java_bali';
            }
        }

        foreach (['makassar', 'balikpapan', 'samarinda', 'banjarmasin', 'pontianak', 'manado', 'palu', 'kendari'] as $keyword) {
            if (str_contains($normalized, $keyword)) {
                return 'kalimantan_sulawesi';
            }
        }

        return 'java';
    }
}
