<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nama Lengkap')
                    ->required(),
                TextInput::make('email')
                    ->label('Alamat Email')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->label('Nomor Telepon')
                    ->tel(),
                Select::make('role')
                    ->label('Peran')
                    ->options([
                        'buyer' => 'Pembeli',
                        'seller' => 'Penjual',
                        'admin' => 'Administrator',
                    ])
                    ->required()
                    ->default('buyer'),
                Select::make('seller_status')
                    ->label('Status Verifikasi Penjual')
                    ->options([
                        'none' => 'Pembeli Biasa',
                        'pending' => 'Menunggu Verifikasi',
                        'approved' => 'Disetujui',
                        'rejected' => 'Ditolak',
                    ])
                    ->required()
                    ->default('none'),
                TextInput::make('seller_store_name')
                    ->label('Rencana Nama Toko')
                    ->maxLength(120),
                Textarea::make('seller_application_note')
                    ->label('Catatan Pengajuan Penjual')
                    ->columnSpanFull(),
                TextInput::make('password')
                    ->label('Kata Sandi')
                    ->password()
                    ->dehydrated(fn (?string $state): bool => filled($state))
                    ->required(fn (string $operation): bool => $operation === 'create'),
            ]);
    }
}
