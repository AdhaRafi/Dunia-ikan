<?php

namespace App\Filament\Resources\FishGuides\Pages;

use App\Filament\Resources\FishGuides\FishGuideResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditFishGuide extends EditRecord
{
    protected static string $resource = FishGuideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
