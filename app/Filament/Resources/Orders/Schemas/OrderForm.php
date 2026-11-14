<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_number')
                    ->required(),
                Select::make('buyer_id')
                    ->relationship('buyer', 'name')
                    ->required(),
                Select::make('store_id')
                    ->relationship('store', 'name')
                    ->required(),
                TextInput::make('status')
                    ->required()
                    ->default('pending_payment'),
                TextInput::make('payment_method')
                    ->required(),
                TextInput::make('payment_status')
                    ->required()
                    ->default('unpaid'),
                TextInput::make('total_product_amount')
                    ->required()
                    ->numeric(),
                TextInput::make('shipping_cost')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('$'),
                TextInput::make('grand_total')
                    ->required()
                    ->numeric(),
                TextInput::make('shipping_recipient_name')
                    ->required(),
                TextInput::make('shipping_phone')
                    ->tel()
                    ->required(),
                TextInput::make('shipping_city')
                    ->required(),
                Textarea::make('shipping_address')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('shipping_notes')
                    ->columnSpanFull(),
                TextInput::make('shipping_courier'),
                TextInput::make('shipping_tracking_number'),
                TextInput::make('payment_proof'),
                Textarea::make('payment_notes')
                    ->columnSpanFull(),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
