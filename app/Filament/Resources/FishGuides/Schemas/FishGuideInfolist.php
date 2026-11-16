<?php

namespace App\Filament\Resources\FishGuides\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class FishGuideInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextEntry::make('title')
                    ->label('Judul Panduan')
                    ->weight('semibold'),
                TextEntry::make('fish_type')
                    ->label('Jenis Ikan'),
                TextEntry::make('category')
                    ->label('Kategori Masalah')
                    ->badge(),
                TextEntry::make('source')
                    ->label('Sumber Referensi')
                    ->placeholder('-'),
                IconEntry::make('is_active')
                    ->label('Status Aktif')
                    ->boolean(),
                TextEntry::make('updated_at')
                    ->label('Terakhir Diperbarui')
                    ->dateTime('d M Y H:i')
                    ->placeholder('-'),
                TextEntry::make('symptoms')
                    ->label('Gejala yang Terlihat')
                    ->columnSpanFull(),
                TextEntry::make('possible_causes')
                    ->label('Kemungkinan Penyebab Utama')
                    ->columnSpanFull(),
                TextEntry::make('care_instructions')
                    ->label('Langkah Penanganan')
                    ->columnSpanFull(),
                TextEntry::make('prevention')
                    ->label('Pencegahan')
                    ->placeholder('-')
                    ->columnSpanFull(),
            ]);
    }
}
