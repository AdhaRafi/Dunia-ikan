<?php

namespace App\Filament\Widgets;

use App\Services\AdminAnalyticsService;
use Filament\Widgets\ChartWidget;

class SalesTrendChart extends ChartWidget
{
    protected static ?bool $isLazyLoaded = false;

    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'xl' => 8,
    ];

    protected ?string $heading = 'Total Penjualan';

    protected ?string $description = 'Perbandingan omzet terverifikasi (Rp) dan volume pesanan aktif.';

    protected ?string $maxHeight = '290px';

    public ?string $filter = '6m';

    protected function getType(): string
    {
        return 'line';
    }

    /**
     * @return array<string, string>|null
     */
    protected function getFilters(): ?array
    {
        return [
            '6m' => '6 Bulan',
            '30d' => '30 Hari',
            '7d' => '7 Hari',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function getData(): array
    {
        $seriesMap = app(AdminAnalyticsService::class)->getDashboardData()['salesSeries'];
        $activeKey = in_array($this->filter, ['7d', '30d', '6m'], true) ? $this->filter : '6m';
        $points = $seriesMap[$activeKey] ?? [];

        return [
            'labels' => array_map(fn (array $point): string => $point['label'], $points),
            'datasets' => [
                [
                    'label' => 'Omzet Terverifikasi (Rp)',
                    'data' => array_map(fn (array $point): float => (float) $point['revenue'], $points),
                    'yAxisID' => 'y',
                    'borderColor' => '#111827',
                    'backgroundColor' => 'rgba(17, 24, 39, 0.08)',
                    'borderWidth' => 2.5,
                    'tension' => 0.4,
                    'fill' => true,
                    'pointRadius' => 3.5,
                    'pointHoverRadius' => 5,
                ],
                [
                    'label' => 'Jumlah Pesanan',
                    'data' => array_map(fn (array $point): int => (int) $point['orders'], $points),
                    'yAxisID' => 'y1',
                    'borderColor' => '#84CC16',
                    'backgroundColor' => 'rgba(132, 204, 22, 0.14)',
                    'borderWidth' => 2.2,
                    'borderDash' => [5, 5],
                    'tension' => 0.4,
                    'fill' => false,
                    'pointRadius' => 3.5,
                    'pointHoverRadius' => 5,
                ],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function getOptions(): array
    {
        return [
            'responsive' => true,
            'maintainAspectRatio' => false,
            'interaction' => [
                'mode' => 'index',
                'intersect' => false,
            ],
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'top',
                    'align' => 'start',
                ],
            ],
            'scales' => [
                'x' => [
                    'grid' => [
                        'display' => false,
                    ],
                ],
                'y' => [
                    'type' => 'linear',
                    'position' => 'left',
                    'beginAtZero' => true,
                ],
                'y1' => [
                    'type' => 'linear',
                    'position' => 'right',
                    'beginAtZero' => true,
                    'grid' => [
                        'drawOnChartArea' => false,
                    ],
                    'ticks' => [
                        'precision' => 0,
                    ],
                ],
            ],
        ];
    }
}
