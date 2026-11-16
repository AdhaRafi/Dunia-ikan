<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\CityDistributionWidget;
use App\Filament\Widgets\OrderActivityChart;
use App\Filament\Widgets\PlatformStatsOverview;
use App\Filament\Widgets\SalesTrendChart;
use App\Filament\Widgets\TopTransactionsWidget;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\Widget;
use UnitEnum;

class Dashboard extends BaseDashboard
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSquares2x2;

    protected static ?string $navigationLabel = 'Ringkasan Platform';

    protected static string|UnitEnum|null $navigationGroup = 'Ringkasan & Laporan';

    protected static ?int $navigationSort = 1;

    protected ?string $heading = 'Ringkasan Platform';

    protected ?string $subheading = 'Monitor omzet terverifikasi, pesanan aktif, toko mitra, dan wilayah pembeli.';

    /**
     * @return int|array<string, ?int>
     */
    public function getColumns(): int|array
    {
        return [
            'default' => 1,
            'xl' => 12,
        ];
    }

    /**
     * @return array<class-string<Widget>>
     */
    public function getWidgets(): array
    {
        return [
            PlatformStatsOverview::class,
            SalesTrendChart::class,
            OrderActivityChart::class,
            TopTransactionsWidget::class,
            CityDistributionWidget::class,
        ];
    }

    /**
     * @return array<Action>
     */
    protected function getHeaderActions(): array
    {
        return [
            Action::make('downloadCsv')
                ->label('Unduh CSV')
                ->icon(Heroicon::OutlinedArrowDownTray)
                ->color('gray')
                ->url(route('filament.admin.reports.export'), shouldOpenInNewTab: true),
            Action::make('openReports')
                ->label('Laporan Transaksi')
                ->icon(Heroicon::OutlinedDocumentChartBar)
                ->color('primary')
                ->url(fn (): string => TransactionReports::getUrl()),
        ];
    }
}
