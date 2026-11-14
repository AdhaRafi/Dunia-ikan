<?php

namespace App\Filament\Resources\Stores\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class StoreForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                TextInput::make('city')
                    ->required(),
                TextInput::make('province')
                    ->required()
                    ->default('Jawa Barat'),
                Textarea::make('address')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('phone')
                    ->tel()
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('logo'),
                TextInput::make('banner'),
                Textarea::make('doa_policy')
                    ->columnSpanFull(),
                TextInput::make('bank_name'),
                TextInput::make('bank_account_number'),
                TextInput::make('bank_account_name'),
                FileUpload::make('qris_image')
                    ->image(),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
