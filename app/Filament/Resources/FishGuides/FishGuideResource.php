<?php

namespace App\Filament\Resources\FishGuides;

use App\Filament\Resources\FishGuides\Pages\CreateFishGuide;
use App\Filament\Resources\FishGuides\Pages\EditFishGuide;
use App\Filament\Resources\FishGuides\Pages\ListFishGuides;
use App\Filament\Resources\FishGuides\Pages\ViewFishGuide;
use App\Filament\Resources\FishGuides\Schemas\FishGuideForm;
use App\Filament\Resources\FishGuides\Schemas\FishGuideInfolist;
use App\Filament\Resources\FishGuides\Tables\FishGuidesTable;
use App\Models\FishGuide;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class FishGuideResource extends Resource
{
    protected static ?string $model = FishGuide::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBookOpen;

    protected static ?string $navigationLabel = 'Panduan Kesehatan & AI';

    protected static ?string $modelLabel = 'Panduan Ikan';

    protected static ?string $pluralModelLabel = 'Panduan Kesehatan & AI';

    protected static string|UnitEnum|null $navigationGroup = 'Konten & AI Kiko';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $activeCount = FishGuide::where('is_active', true)->count();

        return $activeCount > 0 ? (string) $activeCount : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'info';
    }

    public static function form(Schema $schema): Schema
    {
        return FishGuideForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return FishGuideInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FishGuidesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFishGuides::route('/'),
            'create' => CreateFishGuide::route('/create'),
            'view' => ViewFishGuide::route('/{record}'),
            'edit' => EditFishGuide::route('/{record}/edit'),
        ];
    }
}
