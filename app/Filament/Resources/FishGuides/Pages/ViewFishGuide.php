<?php

namespace App\Filament\Resources\FishGuides\Pages;

use App\Filament\Resources\FishGuides\FishGuideResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewFishGuide extends ViewRecord
{
    protected static string $resource = FishGuideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
