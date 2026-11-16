<?php

namespace App\Filament\Resources\FishGuides\Pages;

use App\Filament\Resources\FishGuides\FishGuideResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFishGuides extends ListRecords
{
    protected static string $resource = FishGuideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
