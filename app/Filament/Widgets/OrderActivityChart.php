<?php

namespace App\Filament\Widgets;

use App\Services\AdminAnalyticsService;
use Filament\Widgets\ChartWidget;

class OrderActivityChart extends ChartWidget
{
    protected static ?bool $isLazyLoaded = false;

    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'xl' => 4,
    ];

    protected ?string $heading = 'Aktivitas Pesanan';

    protected ?string $description = 'Proporsi status seluruh transaksi marketplace.';

    protected ?string $maxHeight = '290px';

    protected function getType(): string
    {
        return 'doughnut';
    }

    /**
     * @return array<string, mixed>
     */
    protected function getData(): array
    {
        $breakdown = app(AdminAnalyticsService::class)->getDashboardData()['statusBreakdown'];
        $counts = array_map(fn (array $item): int => (int) $item['count'], $breakdown);

        if (array_sum($counts) === 0) {
            return [
                'labels' => ['Belum ada transaksi'],
                'datasets' => [
                    [
                        'data' => [1],
                        'backgroundColor' => ['#E2E8F0'],
                        'borderWidth' => 0,
                    ],
                ],
            ];
        }

        return [
            'labels' => array_map(fn (array $item): string => "{$item['labelId']} ({$item['percentage']}%)", $breakdown),
            'datasets' => [
                [
                    'data' => $counts,
                    'backgroundColor' => array_map(fn (array $item): string => $item['color'], $breakdown),
                    'borderColor' => '#FFFFFF',
                    'borderWidth' => 2,
                    'hoverOffset' => 6,
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
            'cutout' => '66%',
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'bottom',
                ],
            ],
            'scales' => [
                'x' => [
                    'display' => false,
                ],
                'y' => [
                    'display' => false,
                ],
            ],
        ];
    }
}
