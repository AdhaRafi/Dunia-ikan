<?php

namespace App\Filament\Resources\Stores\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class StoreInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.name')
                    ->label('User'),
                TextEntry::make('name'),
                TextEntry::make('slug'),
                TextEntry::make('city'),
                TextEntry::make('province'),
                TextEntry::make('address')
                    ->columnSpanFull(),
                TextEntry::make('phone'),
                TextEntry::make('description')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('logo')
                    ->placeholder('-'),
                TextEntry::make('banner')
                    ->placeholder('-'),
                TextEntry::make('doa_policy')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('bank_name')
                    ->placeholder('-'),
                TextEntry::make('bank_account_number')
                    ->placeholder('-'),
                TextEntry::make('bank_account_name')
                    ->placeholder('-'),
                ImageEntry::make('qris_image')
                    ->placeholder('-'),
                IconEntry::make('is_active')
                    ->boolean(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
