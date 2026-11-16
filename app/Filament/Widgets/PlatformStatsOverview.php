<?php

namespace App\Filament\Widgets;

use App\Filament\Pages\TransactionReports;
use App\Filament\Resources\Orders\OrderResource;
use App\Filament\Resources\Products\ProductResource;
use App\Filament\Resources\Users\UserResource;
use App\Services\AdminAnalyticsService;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PlatformStatsOverview extends StatsOverviewWidget
{
    protected static ?bool $isLazyLoaded = false;

    protected static ?int $sort = 1;

    protected int|string|array $columnSpan = 'full';

    /**
     * @return array<int, Stat>
     */
    protected function getStats(): array
    {
        $data = app(AdminAnalyticsService::class)->getDashboardData();
        $stats = $data['stats'];
        $comparisons = $data['comparisons'];

        $revenueDelta = $comparisons['revenueDeltaPct'];
        $revenueDesc = $revenueDelta !== null
            ? ($revenueDelta >= 0 ? '+' : '').number_format((float) $revenueDelta, 1, ',', '.').'% vs 30 hari lalu'
            : '30h terakhir: Rp '.number_format((float) $comparisons['revenueCurrent30d'], 0, ',', '.');

        $ordersDelta = $comparisons['ordersDeltaPct'];
        $aovFormatted = 'Rp '.number_format((float) $stats['averageOrderValue'], 0, ',', '.');
        $ordersDesc = $ordersDelta !== null
            ? ($ordersDelta >= 0 ? '+' : '').number_format((float) $ordersDelta, 1, ',', '.')."% • Rata-rata {$aovFormatted}"
            : "{$stats['verifiedOrders']} terverifikasi • AOV {$aovFormatted}";

        $pendingSellers = (int) $stats['pendingSellers'];
        $storesDesc = $pendingSellers > 0
            ? "{$stats['activeProducts']} aktif • {$pendingSellers} seller menunggu"
            : "{$stats['activeProducts']} produk aktif dari {$stats['totalProducts']} total";

        $usersDesc = "+{$comparisons['usersCurrent30d']} akun (30h) • {$stats['totalGuides']} panduan Kiko";

        return [
            Stat::make('Pendapatan Terverifikasi', 'Rp '.number_format((float) $stats['totalRevenue'], 0, ',', '.'))
                ->description($revenueDesc)
                ->descriptionIcon($revenueDelta !== null && $revenueDelta < 0 ? Heroicon::OutlinedArrowTrendingDown : Heroicon::OutlinedArrowTrendingUp)
                ->color($revenueDelta !== null && $revenueDelta < 0 ? 'danger' : 'success')
                ->url(TransactionReports::getUrl()),

            Stat::make('Total Pesanan', number_format((int) $stats['totalOrders'], 0, ',', '.'))
                ->description($ordersDesc)
                ->descriptionIcon(Heroicon::OutlinedShoppingBag)
                ->color($ordersDelta !== null && $ordersDelta < 0 ? 'danger' : 'info')
                ->url(OrderResource::getUrl()),

            Stat::make('Toko & Produk Aktif', number_format((int) $stats['totalStores'], 0, ',', '.').' Toko')
                ->description($storesDesc)
                ->descriptionIcon($pendingSellers > 0 ? Heroicon::OutlinedClock : Heroicon::OutlinedBuildingStorefront)
                ->color($pendingSellers > 0 ? 'warning' : 'success')
                ->url($pendingSellers > 0 ? UserResource::getUrl() : ProductResource::getUrl()),

            Stat::make('Pengguna & Panduan AI', number_format((int) $stats['totalUsers'], 0, ',', '.').' Akun')
                ->description($usersDesc)
                ->descriptionIcon(Heroicon::OutlinedUsers)
                ->color('primary')
                ->url(UserResource::getUrl()),
        ];
    }
}
