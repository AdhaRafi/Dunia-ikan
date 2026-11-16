<?php

namespace App\Filament\Resources\FishGuides\Schemas;

use App\Models\FishGuide;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class FishGuideForm
{
    /**
     * @return array<string, string>
     */
    public static function categoryOptions(): array
    {
        $defaults = [
            'Penyakit Parasit' => 'Penyakit Parasit',
            'Infeksi Bakteri / Jamur' => 'Infeksi Bakteri / Jamur',
            'Kualitas Air & Filter' => 'Kualitas Air & Filter',
            'Gangguan Pencernaan & Organ' => 'Gangguan Pencernaan & Organ',
            'Perawatan Dasar' => 'Perawatan Dasar',
        ];

        $existing = FishGuide::query()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category', 'category')
            ->all();

        return array_merge($existing, $defaults);
    }

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                TextInput::make('title')
                    ->label('Judul Panduan')
                    ->placeholder('Mis. Mengatasi White Spot (Ich) pada Koi')
                    ->required()
                    ->maxLength(200),
                TextInput::make('fish_type')
                    ->label('Jenis Ikan')
                    ->default('Semua Ikan Air Tawar')
                    ->required()
                    ->maxLength(100),
                Select::make('category')
                    ->label('Kategori Masalah')
                    ->options(fn (): array => self::categoryOptions())
                    ->default('Penyakit Parasit')
                    ->searchable()
                    ->required(),
                TextInput::make('source')
                    ->label('Sumber Referensi / Asosiasi')
                    ->default('Standar Perawatan Ikan Hias')
                    ->maxLength(255),
                Textarea::make('symptoms')
                    ->label('Gejala yang Terlihat')
                    ->placeholder('Jelaskan bintik putih, sirip robek, berenang miring, dll.')
                    ->rows(3)
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('possible_causes')
                    ->label('Kemungkinan Penyebab Utama')
                    ->placeholder('Penurunan suhu mendadak, amonia tinggi, pakan membusuk...')
                    ->rows(3)
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('care_instructions')
                    ->label('Langkah Penanganan')
                    ->placeholder('Karantina ikan, stabilkan suhu 28-30°C, kurangi pakan...')
                    ->rows(4)
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('prevention')
                    ->label('Pencegahan (Opsional)')
                    ->rows(3)
                    ->columnSpanFull(),
                Toggle::make('is_active')
                    ->label('Aktif sebagai referensi AI Kiko & Halaman Publik')
                    ->default(true)
                    ->columnSpanFull(),
            ]);
    }
}
