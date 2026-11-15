<?php

namespace App\Filament\Resources\Users\Tables;

use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query): Builder => $query
                ->orderByRaw("CASE WHEN seller_status = 'pending' THEN 0 ELSE 1 END")
                ->latest())
            ->columns([
                TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('role')
                    ->label('Peran')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'primary',
                        'seller' => 'success',
                        default => 'gray',
                    }),
                TextColumn::make('seller_status')
                    ->label('Status Penjual')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'pending' => 'Menunggu Verifikasi',
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                        default => 'Pembeli Biasa',
                    })
                    ->color(fn (?string $state): string => match ($state) {
                        'pending' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('seller_store_name')
                    ->label('Rencana Toko / Farm')
                    ->placeholder('-')
                    ->searchable(),
                TextColumn::make('seller_application_note')
                    ->label('Catatan Pengajuan')
                    ->placeholder('-')
                    ->limit(40)
                    ->toggleable(),
                TextColumn::make('store.name')
                    ->label('Toko Aktif')
                    ->placeholder('-'),
                TextColumn::make('created_at')
                    ->label('Terdaftar')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('seller_status')
                    ->label('Status Pengajuan')
                    ->options([
                        'pending' => 'Menunggu Verifikasi',
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                        'none' => 'Pembeli Biasa',
                    ]),
                SelectFilter::make('role')
                    ->label('Peran')
                    ->options([
                        'buyer' => 'Pembeli',
                        'seller' => 'Penjual',
                        'admin' => 'Admin',
                    ]),
            ])
            ->recordActions([
                Action::make('approveSeller')
                    ->label('Setujui')
                    ->icon(Heroicon::OutlinedCheckCircle)
                    ->color('success')
                    ->visible(fn (User $record): bool => $record->role !== 'admin' && $record->seller_status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Setujui Pengajuan Penjual')
                    ->modalDescription(fn (User $record): string => "Setujui {$record->name} menjadi penjual terverifikasi?")
                    ->action(function (User $record): void {
                        $record->approveSellerApplication();

                        Notification::make()
                            ->title('Penjual disetujui')
                            ->body("{$record->name} kini memiliki akses akun penjual.")
                            ->success()
                            ->send();
                    }),
                Action::make('rejectSeller')
                    ->label('Tolak')
                    ->icon(Heroicon::OutlinedXCircle)
                    ->color('danger')
                    ->visible(fn (User $record): bool => $record->role !== 'admin' && $record->seller_status === 'pending')
                    ->requiresConfirmation()
                    ->modalHeading('Tolak Pengajuan Penjual')
                    ->modalDescription(fn (User $record): string => "Tolak pengajuan penjual dari {$record->name}?")
                    ->action(function (User $record): void {
                        $record->rejectSellerApplication();

                        Notification::make()
                            ->title('Pengajuan ditolak')
                            ->body("Pengajuan penjual {$record->name} telah ditolak.")
                            ->warning()
                            ->send();
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
