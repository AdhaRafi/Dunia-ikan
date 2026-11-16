<?php

namespace App\Filament\Resources\FishGuides\Tables;

use App\Filament\Resources\FishGuides\Schemas\FishGuideForm;
use App\Models\FishGuide;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class FishGuidesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('title')
                    ->label('Judul Panduan')
                    ->weight('semibold')
                    ->searchable()
                    ->limit(55),
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color('info')
                    ->searchable(),
                TextColumn::make('fish_type')
                    ->label('Jenis Ikan')
                    ->searchable(),
                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean()
                    ->sortable(),
                TextColumn::make('source')
                    ->label('Sumber')
                    ->placeholder('-')
                    ->limit(30)
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Diperbarui')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->label('Kategori Masalah')
                    ->options(fn (): array => FishGuideForm::categoryOptions()),
                TernaryFilter::make('is_active')
                    ->label('Status Referensi')
                    ->trueLabel('Aktif')
                    ->falseLabel('Non-aktif'),
            ])
            ->recordActions([
                Action::make('toggleActive')
                    ->label(fn (FishGuide $record): string => $record->is_active ? 'Nonaktifkan' : 'Aktifkan')
                    ->icon(fn (FishGuide $record): Heroicon => $record->is_active ? Heroicon::OutlinedPauseCircle : Heroicon::OutlinedCheckCircle)
                    ->color(fn (FishGuide $record): string => $record->is_active ? 'warning' : 'success')
                    ->action(function (FishGuide $record): void {
                        $nextState = ! $record->is_active;
                        $record->update(['is_active' => $nextState]);

                        Notification::make()
                            ->title($nextState ? 'Panduan diaktifkan' : 'Panduan dinonaktifkan')
                            ->body("{$record->title} kini berstatus ".($nextState ? 'Aktif' : 'Non-aktif').'.')
                            ->success()
                            ->send();
                    }),
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
