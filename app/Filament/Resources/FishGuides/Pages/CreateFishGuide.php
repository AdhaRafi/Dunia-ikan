<?php

namespace App\Filament\Resources\FishGuides\Pages;

use App\Filament\Resources\FishGuides\FishGuideResource;
use Filament\Resources\Pages\CreateRecord;

class CreateFishGuide extends CreateRecord
{
    protected static string $resource = FishGuideResource::class;
}
