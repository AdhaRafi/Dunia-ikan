<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class OrderInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('order_number'),
                TextEntry::make('buyer.name')
                    ->label('Buyer'),
                TextEntry::make('store.name')
                    ->label('Store'),
                TextEntry::make('status'),
                TextEntry::make('payment_method'),
                TextEntry::make('payment_status'),
                TextEntry::make('total_product_amount')
                    ->numeric(),
                TextEntry::make('shipping_cost')
                    ->money(),
                TextEntry::make('grand_total')
                    ->numeric(),
                TextEntry::make('shipping_recipient_name'),
                TextEntry::make('shipping_phone'),
                TextEntry::make('shipping_city'),
                TextEntry::make('shipping_address')
                    ->columnSpanFull(),
                TextEntry::make('shipping_notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('shipping_courier')
                    ->placeholder('-'),
                TextEntry::make('shipping_tracking_number')
                    ->placeholder('-'),
                TextEntry::make('payment_proof')
                    ->placeholder('-'),
                TextEntry::make('payment_notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
