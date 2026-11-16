<?php

namespace App\Filament\Widgets;

use App\Services\AdminAnalyticsService;
use Filament\Widgets\Widget;

class CityDistributionWidget extends Widget
{
    protected static ?bool $isLazyLoaded = false;

    protected static ?int $sort = 5;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'xl' => 5,
    ];

    protected string $view = 'filament.widgets.city-distribution-widget';

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        return [
            'distribution' => app(AdminAnalyticsService::class)->buildCityDistribution(),
        ];
    }
}
